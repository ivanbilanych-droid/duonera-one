import {
  PROFILE_PHOTO_BUCKET,
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
} from './supabase-client.js?v=5';

const ADMIN_EMAIL = 'info@duonera.cz';
const SESSION_KEY = 'duonera-admin-session';
const DISCOVERY_PHOTO_BUCKET = 'duonera-discovery-photos';

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
const matchCount = document.querySelector('#matchCount');
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
let matches = [];
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

async function fetchRpc(name, payload = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${encodeURIComponent(name)}`, {
    method: 'POST',
    headers: {
      ...authHeaders(session.access_token),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (response.status === 401) {
    const refreshed = await refreshSession(session.refresh_token);
    saveSession(refreshed);
    return fetchRpc(name, payload);
  }

  if (!response.ok) {
    throw new Error(await readError(response, 'Data se nepodařilo načíst.'));
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
    row.status,
    row.first_name,
    row.first_email,
    row.second_name,
    row.second_email
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
    status.textContent = profile.is_discoverable
      ? 'ZVEŘEJNĚN'
      : profile.is_approved
        ? 'SCHVÁLEN'
        : text(profile.status || 'new');
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

function renderMatches(rows) {
  tableHead.innerHTML = `
    <tr>
      <th>Vzájemná volba</th>
      <th>První člověk</th>
      <th>E-mail</th>
      <th>Druhý člověk</th>
      <th>E-mail</th>
      <th>Další krok</th>
    </tr>`;

  tableBody.replaceChildren();
  if (!rows.length) {
    tableBody.innerHTML = '<tr><td class="empty-row" colspan="6">Zatím nebyla nalezena žádná vzájemná volba.</td></tr>';
    return;
  }

  rows.forEach(match => {
    const row = document.createElement('tr');
    appendCell(row, formatDate(match.matched_at));
    appendCell(row, match.first_name, 'table-name');
    appendCell(row, match.first_email);
    appendCell(row, match.second_name, 'table-name');
    appendCell(row, match.second_email);
    const action = document.createElement('td');
    const link = document.createElement('a');
    const firstName = text(match.first_name);
    const secondName = text(match.second_name);
    const recipients = [match.first_email, match.second_email]
      .map(email => String(email || '').trim())
      .filter(Boolean)
      .join(',');
    const subject = 'Vzájemná volba DUONERA';
    const body = [
      `Dobrý den, ${firstName} a ${secondName},`,
      '',
      'v systému DUONERA vznikla vzájemná volba. Oba jste uvedli, že se chcete poznat.',
      '',
      'DUONERA vám nyní pomůže domluvit skutečné setkání. Odpovězte prosím na tento e-mail a napište:',
      '1. které dny a časy vám vyhovují,',
      '2. ve kterém městě se chcete setkat.',
      '',
      'Vaše kontaktní údaje zůstávají skryté. Každému účastníkovi píšeme samostatně a další krok potvrdíme až po dohodě s oběma.',
      '',
      'DUONERA',
      'info@duonera.cz',
      'www.duonera.cz'
    ].join('\r\n');
    link.className = 'detail-button';
    link.href = `mailto:${encodeURIComponent(ADMIN_EMAIL)}?bcc=${encodeURIComponent(recipients)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    link.textContent = 'Kontaktovat';
    link.title = `Napsat ${firstName} a ${secondName} bez odhalení jejich e-mailových adres`;
    action.appendChild(link);
    row.appendChild(action);
    tableBody.appendChild(row);
  });
}

function renderCurrentTable() {
  const needle = searchInput.value.trim().toLocaleLowerCase('cs');
  const source = currentView === 'profiles'
    ? profiles
    : currentView === 'leads'
      ? leads
      : matches;
  const filtered = needle
    ? source.filter(row => normalizedSearch(row).includes(needle))
    : source;

  if (currentView === 'profiles') renderProfiles(filtered);
  else if (currentView === 'leads') renderLeads(filtered);
  else renderMatches(filtered);

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

function encodedObjectPath(path) {
  return path
    .split('/')
    .map(segment => encodeURIComponent(segment))
    .join('/');
}

async function createSignedPhotoUrl(path) {
  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/sign/${encodeURIComponent(PROFILE_PHOTO_BUCKET)}/${encodedObjectPath(path)}`,
    {
      method: 'POST',
      headers: {
        ...authHeaders(session.access_token),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ expiresIn: 3600 })
    }
  );

  if (!response.ok) {
    throw new Error(await readError(response, 'Fotografii se nepodařilo otevřít.'));
  }

  const data = await response.json();
  if (!data.signedURL) throw new Error('Úložiště nevrátilo odkaz na fotografii.');
  if (/^https?:\/\//i.test(data.signedURL)) return data.signedURL;
  return `${SUPABASE_URL}/storage/v1${data.signedURL}`;
}

function adminPhotoExtension(file) {
  const byType = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
  };
  return byType[file.type] || 'jpg';
}

async function uploadAdminPhoto(path, file) {
  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${encodeURIComponent(PROFILE_PHOTO_BUCKET)}/${encodedObjectPath(path)}`,
    {
      method: 'POST',
      headers: {
        ...authHeaders(session.access_token),
        'Content-Type': file.type,
        'x-upsert': 'false'
      },
      body: file
    }
  );

  if (!response.ok) {
    throw new Error(await readError(response, 'Fotografii se nepodařilo uložit.'));
  }
}

async function updateProfilePhotoPaths(profileId, paths) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/duonera_profiles?id=eq.${encodeURIComponent(profileId)}`,
    {
      method: 'PATCH',
      headers: {
        ...authHeaders(session.access_token),
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({ photo_paths: paths })
    }
  );

  if (!response.ok) {
    throw new Error(await readError(response, 'Fotografie se nepodařilo připojit k profilu.'));
  }
}

async function updateProfile(profileId, payload) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/duonera_profiles?id=eq.${encodeURIComponent(profileId)}`,
    {
      method: 'PATCH',
      headers: {
        ...authHeaders(session.access_token),
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(payload)
    }
  );
  if (!response.ok) {
    throw new Error(await readError(response, 'Profil se nepodařilo aktualizovat.'));
  }
}

function discoveryPhotoExtension(path, contentType) {
  const match = String(path).match(/\.([a-z0-9]+)$/i);
  if (match) return match[1].toLowerCase() === 'jpeg' ? 'jpg' : match[1].toLowerCase();
  if (contentType === 'image/png') return 'png';
  if (contentType === 'image/webp') return 'webp';
  return 'jpg';
}

async function uploadDiscoveryPhoto(path, blob) {
  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${encodeURIComponent(DISCOVERY_PHOTO_BUCKET)}/${encodedObjectPath(path)}`,
    {
      method: 'POST',
      headers: {
        ...authHeaders(session.access_token),
        'Content-Type': blob.type || 'image/jpeg',
        'x-upsert': 'true'
      },
      body: blob
    }
  );
  if (!response.ok) {
    throw new Error(await readError(response, 'Veřejný náhled fotografie se nepodařilo uložit.'));
  }
}

async function deleteDiscoveryPhoto(path) {
  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${encodeURIComponent(DISCOVERY_PHOTO_BUCKET)}/${encodedObjectPath(path)}`,
    {
      method: 'DELETE',
      headers: authHeaders(session.access_token)
    }
  );
  if (!response.ok && response.status !== 404) {
    throw new Error(await readError(response, 'Veřejný náhled fotografie se nepodařilo odstranit.'));
  }
}

async function publishProfile(profile) {
  const privatePaths = Array.isArray(profile.photo_paths) ? profile.photo_paths.slice(0, 3) : [];
  if (!profile.consent_discovery) {
    throw new Error('Klient nedal výslovný souhlas se zobrazením profilu.');
  }
  if (!privatePaths.length) {
    throw new Error('Profil musí mít alespoň jednu fotografii.');
  }

  const signedUrls = await Promise.all(privatePaths.map(createSignedPhotoUrl));
  const publicPaths = [];
  for (let index = 0; index < signedUrls.length; index += 1) {
    const response = await fetch(signedUrls[index]);
    if (!response.ok) throw new Error('Soukromou fotografii se nepodařilo připravit ke zveřejnění.');
    const blob = await response.blob();
    const extension = discoveryPhotoExtension(privatePaths[index], blob.type);
    const publicPath = `${profile.id}/${String(index + 1).padStart(2, '0')}.${extension}`;
    await uploadDiscoveryPhoto(publicPath, blob);
    publicPaths.push(publicPath);
  }

  await updateProfile(profile.id, {
    is_approved: true,
    is_discoverable: true,
    public_photo_paths: publicPaths
  });
  profile.is_approved = true;
  profile.is_discoverable = true;
  profile.public_photo_paths = publicPaths;
}

async function hideProfile(profile) {
  const publicPaths = Array.isArray(profile.public_photo_paths) ? profile.public_photo_paths : [];
  await Promise.all(publicPaths.map(deleteDiscoveryPhoto));
  await updateProfile(profile.id, {
    is_discoverable: false,
    public_photo_paths: []
  });
  profile.is_discoverable = false;
  profile.public_photo_paths = [];
}

function appendPublicationControls(profile) {
  const section = document.createElement('div');
  section.className = 'detail-item wide publication-section';
  const heading = document.createElement('span');
  heading.textContent = 'Zobrazení v omezeném výběru';
  const status = document.createElement('p');
  status.className = 'publication-status';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = profile.is_discoverable ? 'button button-quiet' : 'button button-gold';
  button.textContent = profile.is_discoverable ? 'Skrýt profil' : 'Schválit a zveřejnit';
  button.disabled = !profile.is_discoverable && !profile.consent_discovery;
  status.textContent = profile.is_discoverable
    ? 'Profil je viditelný na hlavní stránce a v omezeném výběru.'
    : profile.consent_discovery
      ? 'Klient souhlasil se zobrazením. Profil zatím není veřejný.'
      : 'Profil nelze zveřejnit: chybí výslovný souhlas klienta.';

  button.addEventListener('click', async () => {
    button.disabled = true;
    status.textContent = profile.is_discoverable ? 'Skrývání profilu…' : 'Kontrola a zveřejnění profilu…';
    try {
      if (profile.is_discoverable) await hideProfile(profile);
      else await publishProfile(profile);
      button.textContent = profile.is_discoverable ? 'Skrýt profil' : 'Schválit a zveřejnit';
      button.className = profile.is_discoverable ? 'button button-quiet' : 'button button-gold';
      status.textContent = profile.is_discoverable
        ? 'Profil je viditelný v omezeném výběru.'
        : 'Profil byl skryt a veřejné kopie fotografií byly odstraněny.';
      renderCurrentTable();
    } catch (error) {
      status.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  });

  section.append(heading, status, button);
  detailContent.appendChild(section);
}

async function assignPremiumCandidate(memberUserId, candidateProfileId, position, selectionNote) {
  const query = new URLSearchParams({
    on_conflict: 'member_user_id,position'
  });
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/duonera_premium_selections?${query}`,
    {
      method: 'POST',
      headers: {
        ...authHeaders(session.access_token),
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal'
      },
      body: JSON.stringify({
        member_user_id: memberUserId,
        candidate_profile_id: candidateProfileId,
        position,
        selection_note: selectionNote || null,
        active: true
      })
    }
  );
  if (!response.ok) {
    throw new Error(await readError(response, 'Prémiové doporučení se nepodařilo uložit.'));
  }
}

function appendPremiumControls(candidateProfile) {
  const section = document.createElement('div');
  section.className = 'detail-item wide premium-admin-section';
  const heading = document.createElement('span');
  heading.textContent = 'Přidat do prémiové trojice';
  const memberSelect = document.createElement('select');
  const emptyOption = document.createElement('option');
  emptyOption.value = '';
  emptyOption.textContent = 'Vyberte klienta';
  memberSelect.appendChild(emptyOption);
  profiles
    .filter(profile => profile.user_id && profile.id !== candidateProfile.id)
    .sort((a, b) => String(a.first_name || '').localeCompare(String(b.first_name || ''), 'cs'))
    .forEach(profile => {
      const option = document.createElement('option');
      option.value = profile.user_id;
      option.textContent = `${text(profile.first_name)} — ${text(profile.email)}`;
      memberSelect.appendChild(option);
    });
  const positionSelect = document.createElement('select');
  [1, 2, 3].forEach(position => {
    const option = document.createElement('option');
    option.value = String(position);
    option.textContent = `Pozice ${position}`;
    positionSelect.appendChild(option);
  });
  const note = document.createElement('textarea');
  note.rows = 3;
  note.maxLength = 400;
  note.placeholder = 'Proč je tento člověk vhodný právě pro vybraného klienta?';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'button button-outline';
  button.textContent = 'Uložit do prémiové trojice';
  const status = document.createElement('p');
  status.className = 'upload-status';
  if (!candidateProfile.is_approved) {
    status.textContent = 'Nejdříve kandidáta schvalte.';
  }

  button.addEventListener('click', async () => {
    if (!candidateProfile.is_approved) {
      status.textContent = 'Nejdříve kandidáta schvalte.';
      return;
    }
    if (!memberSelect.value) {
      status.textContent = 'Vyberte klienta.';
      return;
    }
    button.disabled = true;
    status.textContent = 'Ukládání doporučení…';
    try {
      await assignPremiumCandidate(
        memberSelect.value,
        candidateProfile.id,
        Number(positionSelect.value),
        note.value.trim()
      );
      status.textContent = 'Kandidát byl uložen do prémiové trojice klienta.';
    } catch (error) {
      status.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  });

  section.append(heading, memberSelect, positionSelect, note, button, status);
  detailContent.appendChild(section);
}

async function renderStoredPhotos(gallery, paths) {
  gallery.replaceChildren();
  if (!paths.length) {
    const empty = document.createElement('p');
    empty.className = 'photo-empty';
    empty.textContent = 'Fotografie nebyly u tohoto profilu uloženy.';
    gallery.appendChild(empty);
    return;
  }

  const loading = document.createElement('p');
  loading.className = 'photo-empty';
  loading.textContent = 'Načítání fotografií…';
  gallery.appendChild(loading);

  try {
    const urls = await Promise.all(paths.map(createSignedPhotoUrl));
    gallery.replaceChildren();
    urls.forEach((url, index) => {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.ariaLabel = `Otevřít fotografii ${index + 1}`;
      const image = document.createElement('img');
      image.src = url;
      image.alt = `Fotografie profilu ${index + 1}`;
      image.loading = 'lazy';
      link.appendChild(image);
      gallery.appendChild(link);
    });
  } catch (error) {
    gallery.replaceChildren();
    const message = document.createElement('p');
    message.className = 'photo-error';
    message.textContent = error.message;
    gallery.appendChild(message);
  }
}

async function appendPhotos(profile) {
  const paths = Array.isArray(profile.photo_paths) ? [...profile.photo_paths] : [];
  const section = document.createElement('div');
  section.className = 'detail-item wide photo-section';
  const heading = document.createElement('span');
  heading.textContent = 'Fotografie';
  const gallery = document.createElement('div');
  gallery.className = 'admin-photo-grid';
  section.append(heading, gallery);
  detailContent.appendChild(section);
  await renderStoredPhotos(gallery, paths);

  if (paths.length >= 3) return;

  const controls = document.createElement('div');
  controls.className = 'admin-photo-upload';
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/jpeg,image/png,image/webp';
  input.multiple = true;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'button button-outline';
  button.textContent = 'Přidat fotografie';
  button.disabled = true;
  const status = document.createElement('p');
  status.className = 'upload-status';
  controls.append(input, button, status);
  section.appendChild(controls);

  input.addEventListener('change', () => {
    const files = [...input.files];
    const total = files.reduce((sum, file) => sum + file.size, 0);
    const validTypes = files.every(file => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type));
    const valid = files.length > 0
      && files.length <= 3 - paths.length
      && total <= 10 * 1024 * 1024
      && validTypes;
    button.disabled = !valid;
    status.textContent = valid
      ? `Vybráno fotografií: ${files.length}`
      : 'Vyberte JPG, PNG nebo WEBP. Profil může mít nejvýše 3 fotografie a nový výběr nejvýše 10 MB.';
  });

  button.addEventListener('click', async () => {
    const files = [...input.files];
    if (!files.length || button.disabled) return;
    button.disabled = true;
    button.textContent = 'Ukládání…';
    status.textContent = '';

    try {
      const newPaths = [];
      const uploadId = Date.now();
      for (let index = 0; index < files.length; index += 1) {
        const path = `${profile.id}/admin-${uploadId}-${index + 1}.${adminPhotoExtension(files[index])}`;
        await uploadAdminPhoto(path, files[index]);
        newPaths.push(path);
      }
      paths.push(...newPaths);
      await updateProfilePhotoPaths(profile.id, paths);
      profile.photo_paths = [...paths];
      await renderStoredPhotos(gallery, paths);
      status.textContent = 'Fotografie byly bezpečně uloženy.';
      input.value = '';
      if (paths.length >= 3) controls.classList.add('complete');
    } catch (error) {
      status.textContent = error.message;
      button.disabled = false;
    } finally {
      button.textContent = 'Přidat fotografie';
    }
  });
}

function rawDataEntries(rawData) {
  if (!rawData || typeof rawData !== 'object' || Array.isArray(rawData)) return [];
  return Object.entries(rawData).filter(([, value]) => {
    if (Array.isArray(value)) return value.length;
    return value !== null && value !== undefined && value !== '';
  });
}

async function openProfile(profile) {
  detailTitle.textContent = `${text(profile.first_name)}, ${calculateAge(profile.birth_date)}`;
  detailContent.replaceChildren();
  detailDialog.showModal();
  await appendPhotos(profile);

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
    ['Souhlas se zobrazením', profile.consent_discovery],
    ['O mně', profile.about_me, true],
    ['Představa o vztahu', profile.ideal_relationship, true]
  ].forEach(([label, value, wide]) => appendDetail(label, value, wide));

  rawDataEntries(profile.raw_data).forEach(([label, value]) => {
    appendDetail(label, value, true);
  });
  appendPublicationControls(profile);
  appendPremiumControls(profile);
}

async function loadData() {
  refreshButton.disabled = true;
  dataMessage.className = 'data-message';
  dataMessage.textContent = 'Načítání údajů…';

  try {
    [profiles, leads, matches] = await Promise.all([
      fetchRows('duonera_profiles'),
      fetchRows('duonera_leads'),
      fetchRpc('duonera_admin_mutual_matches')
    ]);
    profileCount.textContent = profiles.length;
    leadCount.textContent = leads.length;
    newProfileCount.textContent = profiles.filter(profile => !profile.is_approved).length;
    matchCount.textContent = matches.length;
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
  matches = [];
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


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(error => {
      console.warn('DUONERA service worker registration failed', error);
    });
  });
}
