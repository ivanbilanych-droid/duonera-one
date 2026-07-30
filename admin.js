import {
  callMemberRpc,
  requireMemberSession,
  signOutMember
} from './member-auth.js?v=15';

const ADMIN_EMAILS = new Set([
  'info@duonera.cz',
  'ib.luxes@gmail.com'
]);

const lockView = document.getElementById('adminLock');
const lockText = document.getElementById('adminLockText');
const loginLink = document.getElementById('adminLoginLink');
const dashboard = document.getElementById('adminDashboard');
const logoutButton = document.getElementById('adminLogout');
const refreshButton = document.getElementById('adminRefresh');
const message = document.getElementById('adminMessage');
const profileList = document.getElementById('adminProfiles');
const leadList = document.getElementById('adminLeads');
const profileFilter = document.getElementById('profileFilter');

let dashboardData = { summary: {}, profiles: [], leads: [] };

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function isAdmin(email) {
  return ADMIN_EMAILS.has(normalizeEmail(email));
}

function safeDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('cs-CZ', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function ageFromBirthDate(value) {
  if (!value) return '—';
  const birth = new Date(`${value}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return '—';
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const month = now.getMonth() - birth.getMonth();
  if (month < 0 || (month === 0 && now.getDate() < birth.getDate())) age -= 1;
  return age;
}

function setMessage(text = '', error = false) {
  message.textContent = text;
  message.classList.toggle('error', error);
}

function detail(label, value) {
  const wrap = document.createElement('div');
  wrap.className = 'admin-item-detail';
  const title = document.createElement('small');
  const content = document.createElement('span');
  title.textContent = label;
  content.textContent = value || '—';
  wrap.append(title, content);
  return wrap;
}

function statusInfo(profile) {
  if (profile.is_approved && profile.is_discoverable) return { text: 'Schválený a viditelný', className: 'approved' };
  if (profile.is_approved) return { text: 'Schválený, skrytý', className: 'approved' };
  return { text: 'Čeká na kontrolu', className: 'pending' };
}

async function changeProfile(profileId, approved, discoverable, buttons) {
  buttons.forEach(button => { button.disabled = true; });
  setMessage('Ukládám změnu…');
  try {
    await callMemberRpc('duonera_admin_set_profile_state', {
      target_profile_id: profileId,
      approved,
      discoverable
    });
    await loadDashboard();
    setMessage('Profil byl aktualizován.');
  } catch (error) {
    setMessage(error.message || 'Změnu se nepodařilo uložit.', true);
  } finally {
    buttons.forEach(button => { button.disabled = false; });
  }
}

function profileCard(profile) {
  const card = document.createElement('article');
  card.className = 'admin-item';

  const main = document.createElement('div');
  main.className = 'admin-item-main';
  const name = document.createElement('strong');
  name.textContent = `${profile.first_name || 'Bez jména'}, ${ageFromBirthDate(profile.birth_date)}`;
  const status = document.createElement('span');
  const state = statusInfo(profile);
  status.className = `admin-item-status ${state.className}`;
  status.textContent = state.text;
  main.append(name, status);

  const contact = detail('Kontakt', profile.email);
  const location = detail('Město / koho hledá', [profile.city, profile.looking_for].filter(Boolean).join(' · '));
  const created = detail('Odesláno', safeDate(profile.created_at));

  const actions = document.createElement('div');
  actions.className = 'admin-item-actions';
  const approve = document.createElement('button');
  approve.type = 'button';
  approve.className = 'primary';
  approve.textContent = 'Schválit';
  const hide = document.createElement('button');
  hide.type = 'button';
  hide.textContent = 'Skrýt';
  const buttons = [approve, hide];
  approve.addEventListener('click', () => changeProfile(profile.id, true, true, buttons));
  hide.addEventListener('click', () => changeProfile(profile.id, Boolean(profile.is_approved), false, buttons));
  actions.append(approve, hide);

  card.append(main, contact, location, created, actions);
  return card;
}

function leadCard(lead) {
  const card = document.createElement('article');
  card.className = 'admin-item';
  const main = document.createElement('div');
  main.className = 'admin-item-main';
  const email = document.createElement('strong');
  email.textContent = lead.email || 'Bez e-mailu';
  const source = document.createElement('small');
  source.textContent = lead.source || 'duonera.cz';
  main.append(email, source);
  card.append(
    main,
    detail('Jsem / hledám', [lead.gender, lead.looking_for].filter(Boolean).join(' → ')),
    detail('Věk / město', [lead.age, lead.city].filter(value => value !== null && value !== undefined && value !== '').join(' · ')),
    detail('Registrováno', safeDate(lead.created_at))
  );
  return card;
}

function renderProfiles() {
  profileList.replaceChildren();
  const filter = profileFilter.value;
  const profiles = (dashboardData.profiles || []).filter(profile => {
    if (filter === 'pending') return !profile.is_approved;
    if (filter === 'approved') return profile.is_approved && profile.is_discoverable;
    if (filter === 'hidden') return profile.is_approved && !profile.is_discoverable;
    return true;
  });
  if (!profiles.length) {
    profileList.innerHTML = '<div class="admin-empty">V této skupině zatím nejsou žádné ankety.</div>';
    return;
  }
  profiles.forEach(profile => profileList.appendChild(profileCard(profile)));
}

function renderLeads() {
  leadList.replaceChildren();
  const leads = dashboardData.leads || [];
  if (!leads.length) {
    leadList.innerHTML = '<div class="admin-empty">Zatím nejsou žádné nové registrace.</div>';
    return;
  }
  leads.forEach(lead => leadList.appendChild(leadCard(lead)));
}

function renderSummary() {
  const summary = dashboardData.summary || {};
  document.getElementById('statLeads').textContent = summary.leads_total || 0;
  document.getElementById('statProfiles').textContent = summary.profiles_total || 0;
  document.getElementById('statPending').textContent = summary.pending_profiles || 0;
  document.getElementById('statApproved').textContent = summary.approved_profiles || 0;
}

async function loadDashboard() {
  refreshButton.disabled = true;
  setMessage('Načítám aktuální data…');
  try {
    const data = await callMemberRpc('duonera_admin_dashboard');
    dashboardData = data || { summary: {}, profiles: [], leads: [] };
    renderSummary();
    renderProfiles();
    renderLeads();
    setMessage(`Aktualizováno: ${new Intl.DateTimeFormat('cs-CZ', { timeStyle: 'short' }).format(new Date())}`);
  } catch (error) {
    console.error(error);
    setMessage('Přístup k administraci databáze ještě není aktivní.', true);
  } finally {
    refreshButton.disabled = false;
  }
}

document.querySelectorAll('[data-admin-tab]').forEach(button => {
  button.addEventListener('click', () => {
    const target = button.dataset.adminTab;
    document.querySelectorAll('[data-admin-tab]').forEach(item => item.classList.toggle('active', item === button));
    document.querySelectorAll('[data-admin-panel]').forEach(panel => {
      const active = panel.dataset.adminPanel === target;
      panel.hidden = !active;
      panel.classList.toggle('active', active);
    });
  });
});

profileFilter.addEventListener('change', renderProfiles);
refreshButton.addEventListener('click', loadDashboard);
logoutButton.addEventListener('click', async () => {
  await signOutMember();
  location.assign('ucet.html');
});

async function startAdmin() {
  const auth = await requireMemberSession();
  if (!auth) {
    lockText.textContent = 'Nejdříve se přihlaste do svého účtu DUONERA.';
    loginLink.hidden = false;
    return;
  }
  if (!isAdmin(auth.user.email)) {
    lockText.textContent = 'Tento účet nemá oprávnění správce.';
    return;
  }

  lockView.hidden = true;
  dashboard.hidden = false;
  logoutButton.hidden = false;
  document.getElementById('adminUser').textContent = auth.user.email;
  await loadDashboard();
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/service-worker.js').catch(() => {}));
}

startAdmin();
