import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './supabase-client.js';

const ADMIN_EMAIL = 'info@duonera.cz';
const SESSION_KEY = 'duonera-admin-session';

const loginView = document.querySelector('#loginView');
const dashboardView = document.querySelector('#dashboardView');
const loginForm = document.querySelector('#loginForm');
const loginButton = document.querySelector('#loginButton');
const loginMessage = document.querySelector('#loginMessage');
const logoutButton = document.querySelector('#logoutButton');
const refreshButton = document.querySelector('#refreshButton');
const lastUpdated = document.querySelector('#lastUpdated');
const leadCount = document.querySelector('#leadCount');
const profileCount = document.querySelector('#profileCount');
const newProfileCount = document.querySelector('#newProfileCount');
const searchInput = document.querySelector('#searchInput');
const dataMessage = document.querySelector('#dataMessage');
const tableHead = document.querySelector('#tableHead');
const tableBody = document.querySelector('#tableBody');
const detailDialog = document.querySelector('#detailDialog');
const detailTitle = document.querySelector('#detailTitle');
const detailContent = document.querySelector('#detailContent');

let session = null;
let profiles = [];
let leads = [];
let currentView = 'profiles';

function authHeaders(accessToken) {
  return {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json'
  };
}

function getSavedSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  } catch {
    return null;
  }
}

function saveSession(value) {
  session = value;
  localStorage.setItem(SESSION_KEY, JSON.stringify(value));
}

function clearSession() {
  session = null;
  localStorage.removeItem(SESSION_KEY);
}

async function readError(response, fallback) {
  try {
    const data = await response.json();
    return data.msg || data.message || data.error_description || data.error || fallback;
  } catch {
    return fallback;
  }
}

async function signIn(email, password) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new Error(await readError(response, 'Přihlášení se nezdařilo.'));
  }

  return response.json();
}

async function refreshSession(refreshToken) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refresh_token: refreshToken })
  });

  if (!response.ok) {
    throw new Error('Platnost přihlášení vypršela.');
  }

  return response.json();
}

async function getAuthenticatedUser(accessToken) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: authHeaders(accessToken)
  });

  if (!response.ok) return null;
  return response.json();
}

async function requireValidSession() {
  const saved = getSavedSession();
  if (!saved?.access_token) return false;

  let user = await getAuthenticatedUser(saved.access_token);
  if (!user && saved.refresh_token) {
    try {
      const refreshed = await refreshSession(saved.refresh_token);
      saveSession(refreshed);
      user = refreshed.user || await getAuthenticatedUser(refreshed.access_token);
    } catch {
      clearSession();
      return false;
    }
  } else {
    session = saved;
  }

  if (!user || String(user.email || '').toLowerCase() !== ADMIN_EMAIL) {
    clearSession();
    return false;
  }

  return true;
}

async function fetchRows(table) {
  const query = new URLSearchParams({
    select: '*',
    order: 'created_at.desc',
    limit: '500'
  });
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: authHeaders(session.access_token)
  });

  if (response.status === 401) {
    const refreshed = await refreshSession(session.refresh_token);
    saveSession(refreshed);
    return fetchRows(table);
  }

  if (!response.ok) {
    throw new Error(await readError(response, `Tabulku ${table} se nepodařilo načíst.`));
  }

  return response.json();
}

function showLogin(message = '') {
  dashboardView.hidden = true;
  logoutButton.hidden = true;
  loginView.hidden = false;
  loginMessage.textContent = message;
}

function showDashboard() {
  loginView.hidden = true;
  dashboardView.hidden = false;
  logoutButton.hidden = false;
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('cs-CZ', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

function calculateAge(birthDate) {
  if (!birthDate) return '—';
  const birth = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return '—';
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const month = today.getMonth() - birth.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age >= 18 && age <= 120 ? String(age) : '—';
}

function text(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(', ') || '—';
  if (value === true) return 'Ano';
  if (value === false) return 'Ne';
  if (value === null || value === undefined || value === '') return '—';
  return String(value);
}

function normalizedSearch(row) {
  return [
    row.first_name,
    row.city,
    row.email,
    row.phone,
    row.gender,
    row.looking_for,
    row.country,
    row.status
  ].map(value => text(value).toLocaleLowerCase('cs')).join(' ');
}

function appendCell(row, value, className = '') {
  const cell = document.createElement('td');
  if (className) cell.className = className;
  cell.textContent = text(value);
  row.appendChild(cell);
}

function renderProfiles(rows) {
  tableHead.innerHTML = `
    <tr>
      <th>Datum</th>
      <th>Jméno</th>
      <th>Věk</th>
      <th>Město</th>
      <th>Jsem / hledám</th>
      <th>Stav</th>
      <th>Detail</th>
    </tr>`;

  tableBody.replaceChildren();
  if (!rows.length) {
    tableBody.innerHTML = '<tr><td class="empty-row" colspan="7">Žádné profily nebyly nalezeny.</td></tr>';
    return;
  }

  rows.forEach(profile => {
    const row = document.createElement('tr');
    appendCell(row, formatDate(profile.created_at));
    appendCell(row, profile.first_name, 'table-name');
    appendCell(row, calculateAge(profile.birth_date));
    appendCell(row, [profile.city, profile.country].filter(Boolean).join(', '));
    appendCell(row, `${text(profile.gender)} / ${text(profile.looking_for)}`);

    const statusCell = document.createElement('td');
    const status = document.createElement('span');
    status.className = 'status-pill';
    status.textContent = text(profile.status || 'new');
    statusCell.appendChild(status);
    row.appendChild(statusCell);

    const actionCell = document.createElement('td');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'detail-button';
    button.textContent = 'Otevřít';
    button.addEventListener('click', () => openProfile(profile));
    actionCell.appendChild(button);
    row.appendChild(actionCell);
    tableBody.appendChild(row);
  });
}

function renderLeads(rows) {
  tableHead.innerHTML = `
    <tr>
      <th>Datum</th>
      <th>Věk</th>
      <th>Město</th>
      <th>Jsem / hledám</th>
      <th>E-mail</th>
      <th>Telefon</th>
    </tr>`;

  tableBody.replaceChildren();
  if (!rows.length) {
    tableBody.innerHTML = '<tr><td class="empty-row" colspan="6">Žádné registrace nebyly nalezeny.</td></tr>';
    return;
  }

  rows.forEach(lead => {
    const row = document.createElement('tr');
    appendCell(row, formatDate(lead.created_at));
    appendCell(row, lead.age);
    appendCell(row, lead.city, 'table-name');
    appendCell(row, `${text(lead.gender)} / ${text(lead.looking_for)}`);
    appendCell(row, lead.email);
    appendCell(row, lead.phone);
    tableBody.appendChild(row);
  });
}

function renderCurrentTable() {
  const needle = searchInput.value.trim().toLocaleLowerCase('cs');
  const source = currentView === 'profiles' ? profiles : leads;
  const filtered = needle
    ? source.filter(row => normalizedSearch(row).includes(needle))
    : source;

  if (currentView === 'profiles') renderProfiles(filtered);
  else renderLeads(filtered);

  dataMessage.className = 'data-message';
  dataMessage.textContent = needle
    ? `Nalezeno: ${filtered.length}`
    : `Zobrazeno záznamů: ${filtered.length}`;
}

function appendDetail(label, value, wide = false) {
  const item = document.createElement('div');
  item.className = `detail-item${wide ? ' wide' : ''}`;
  const heading = document.createElement('span');
  heading.textContent = label;
  const content = document.createElement('p');
  content.textContent = text(value);
  item.append(heading, content);
  detailContent.appendChild(item);
}

function rawDataEntries(rawData) {
  if (!rawData || typeof rawData !== 'object' || Array.isArray(rawData)) return [];
  return Object.entries(rawData).filter(([, value]) => {
    if (Array.isArray(value)) return value.length;
    return value !== null && value !== undefined && value !== '';
  });
}

function openProfile(profile) {
  detailTitle.textContent = `${text(profile.first_name)}, ${calculateAge(profile.birth_date)}`;
  detailContent.replaceChildren();

  [
    ['Datum registrace', formatDate(profile.created_at)],
    ['Stav', profile.status || 'new'],
    ['E-mail', profile.email],
    ['Telefon', profile.phone],
    ['Město a země', [profile.city, profile.country].filter(Boolean).join(', ')],
    ['Jsem / hledám', `${text(profile.gender)} / ${text(profile.looking_for)}`],
    ['Datum narození', profile.birth_date],
    ['Jazyky', profile.languages],
    ['Výška', profile.height_cm ? `${profile.height_cm} cm` : null],
    ['Povolání', profile.occupation],
    ['Vzdělání', profile.education],
    ['Rodinný stav', profile.relationship_status],
    ['Děti', profile.children],
    ['Domácí zvířata', profile.pets],
    ['Kouření', profile.smoking],
    ['Alkohol', profile.alcohol],
    ['Povaha', profile.traits],
    ['Zájmy', profile.interests],
    ['Hledaný věk', profile.preferred_age_min || profile.preferred_age_max
      ? `${text(profile.preferred_age_min)}–${text(profile.preferred_age_max)}`
      : null],
    ['Maximální vzdálenost', profile.preferred_distance_km
      ? `${profile.preferred_distance_km} km`
      : null],
    ['Cíl seznámení', profile.relationship_goal],
    ['O mně', profile.about_me, true],
    ['Představa o vztahu', profile.ideal_relationship, true]
  ].forEach(([label, value, wide]) => appendDetail(label, value, wide));

  rawDataEntries(profile.raw_data).forEach(([label, value]) => {
    appendDetail(label, value, true);
  });

  detailDialog.showModal();
}

async function loadData() {
  refreshButton.disabled = true;
  dataMessage.className = 'data-message';
  dataMessage.textContent = 'Načítání údajů…';

  try {
    [profiles, leads] = await Promise.all([
      fetchRows('duonera_profiles'),
      fetchRows('duonera_leads')
    ]);
    profileCount.textContent = profiles.length;
    leadCount.textContent = leads.length;
    newProfileCount.textContent = profiles.filter(profile => {
      return String(profile.status || 'new').toLowerCase() === 'new';
    }).length;
    lastUpdated.textContent = `Aktualizováno ${formatDate(new Date().toISOString())}`;
    renderCurrentTable();
  } catch (error) {
    dataMessage.className = 'data-message error';
    dataMessage.textContent = error.message;
  } finally {
    refreshButton.disabled = false;
  }
}

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  loginMessage.textContent = '';
  loginButton.disabled = true;
  loginButton.textContent = 'Přihlašování…';

  const email = document.querySelector('#adminEmail').value.trim().toLowerCase();
  const password = document.querySelector('#adminPassword').value;

  if (email !== ADMIN_EMAIL) {
    loginMessage.textContent = 'Tento účet nemá oprávnění správce DUONERA.';
    loginButton.disabled = false;
    loginButton.textContent = 'Přihlásit se';
    return;
  }

  try {
    const signedIn = await signIn(email, password);
    saveSession(signedIn);
    showDashboard();
    await loadData();
    loginForm.reset();
    document.querySelector('#adminEmail').value = ADMIN_EMAIL;
  } catch (error) {
    clearSession();
    loginMessage.textContent = error.message;
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = 'Přihlásit se';
  }
});

logoutButton.addEventListener('click', () => {
  clearSession();
  profiles = [];
  leads = [];
  showLogin('Byli jste bezpečně odhlášeni.');
});

refreshButton.addEventListener('click', loadData);
searchInput.addEventListener('input', renderCurrentTable);

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    currentView = tab.dataset.view;
    document.querySelectorAll('.tab').forEach(item => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    searchInput.value = '';
    renderCurrentTable();
  });
});

document.querySelector('#closeDialog').addEventListener('click', () => detailDialog.close());
detailDialog.addEventListener('click', event => {
  if (event.target === detailDialog) detailDialog.close();
});

(async function initialize() {
  if (await requireValidSession()) {
    showDashboard();
    await loadData();
  } else {
    showLogin();
  }
})();
