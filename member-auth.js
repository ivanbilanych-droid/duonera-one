import {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
} from './supabase-client.js?v=5';

const MEMBER_SESSION_KEY = 'duonera-member-session';
const SUPABASE_AUTH_STORAGE_KEY = 'duonera-supabase-auth';

const supabaseAuthClient = window.supabase?.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storageKey: SUPABASE_AUTH_STORAGE_KEY,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      flowType: 'implicit'
    }
  }
);

function authHeaders(accessToken, json = false) {
  const headers = {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    Accept: 'application/json'
  };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  if (json) headers['Content-Type'] = 'application/json';
  return headers;
}

async function readError(response, fallback) {
  try {
    const data = await response.json();
    return data.msg || data.message || data.error_description || data.error || fallback;
  } catch {
    return fallback;
  }
}

export function getMemberSession() {
  try {
    return JSON.parse(localStorage.getItem(MEMBER_SESSION_KEY) || 'null');
  } catch {
    return null;
  }
}

export function saveMemberSession(session) {
  if (!session) return;
  const expiresIn = Number(session.expires_in || 3600);
  const expiresAt = Number(session.expires_at || Math.floor(Date.now() / 1000) + expiresIn);
  localStorage.setItem(MEMBER_SESSION_KEY, JSON.stringify({ ...session, expires_at: expiresAt }));
}

export function clearMemberSession() {
  localStorage.removeItem(MEMBER_SESSION_KEY);
}

export function consumeAuthRedirect() {
  if (!location.hash.includes('access_token=')) return null;
  const params = new URLSearchParams(location.hash.slice(1));
  const session = {
    access_token: params.get('access_token'),
    refresh_token: params.get('refresh_token'),
    expires_in: Number(params.get('expires_in') || 3600),
    token_type: params.get('token_type') || 'bearer'
  };
  if (!session.access_token) return null;
  saveMemberSession(session);
  history.replaceState({}, document.title, `${location.pathname}${location.search}`);
  return getMemberSession();
}

export async function requestEmailOtp(email, redirectTo) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (supabaseAuthClient) {
    const { error } = await supabaseAuthClient.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true,
        data: { source: 'duonera.cz' }
      }
    });
    if (error) throw error;
    return;
  }

  const endpoint = new URL(`${SUPABASE_URL}/auth/v1/otp`);
  endpoint.searchParams.set('redirect_to', redirectTo);
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: authHeaders('', true),
    body: JSON.stringify({
      email: normalizedEmail,
      create_user: true,
      data: { source: 'duonera.cz' }
    })
  });
  if (!response.ok) {
    throw new Error(await readError(response, 'Přihlašovací kód se nepodařilo odeslat.'));
  }
}

export async function verifyEmailOtp(email, token) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/verify`, {
    method: 'POST',
    headers: authHeaders('', true),
    body: JSON.stringify({
      email: String(email || '').trim().toLowerCase(),
      token: String(token || '').replace(/\D/g, '').slice(0, 6),
      type: 'email'
    })
  });
  if (!response.ok) {
    throw new Error(await readError(response, 'Kód není platný nebo již vypršel.'));
  }
  const session = await response.json();
  if (!session?.access_token) {
    throw new Error('Přihlášení se nepodařilo dokončit.');
  }
  saveMemberSession(session);
  return getMemberSession();
}

async function refreshMemberSession(refreshToken) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: authHeaders('', true),
    body: JSON.stringify({ refresh_token: refreshToken })
  });
  if (!response.ok) throw new Error('Platnost přihlášení vypršela.');
  const session = await response.json();
  saveMemberSession(session);
  return getMemberSession();
}

export async function getAuthenticatedMember(accessToken) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: authHeaders(accessToken)
  });
  if (!response.ok) return null;
  return response.json();
}

export async function requireMemberSession() {
  // Magic-link callbacks return the tokens in the URL hash. Save them
  // before asking the Supabase client for an existing browser session.
  consumeAuthRedirect();

  if (supabaseAuthClient) {
    try {
      const { data, error } = await supabaseAuthClient.auth.getSession();
      if (error) throw error;
      if (data?.session?.access_token) {
        saveMemberSession(data.session);
      }
    } catch {
      // The legacy session fallback below still supports existing members.
    }
  }

  let session = getMemberSession();
  if (!session?.access_token) return null;

  const expiresSoon = Number(session.expires_at || 0) <= Math.floor(Date.now() / 1000) + 30;
  if (expiresSoon && session.refresh_token) {
    try {
      session = await refreshMemberSession(session.refresh_token);
    } catch {
      clearMemberSession();
      return null;
    }
  }

  let user = await getAuthenticatedMember(session.access_token);
  if (!user && session.refresh_token) {
    try {
      session = await refreshMemberSession(session.refresh_token);
      user = await getAuthenticatedMember(session.access_token);
    } catch {
      clearMemberSession();
      return null;
    }
  }
  if (!user) {
    clearMemberSession();
    return null;
  }
  return { session, user };
}

export async function memberRest(path, options = {}) {
  const auth = await requireMemberSession();
  if (!auth) throw new Error('Přihlášení je nutné.');
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      ...authHeaders(auth.session.access_token, Boolean(options.body)),
      ...(options.headers || {})
    }
  });
  if (!response.ok) {
    throw new Error(await readError(response, 'Požadavek se nepodařilo dokončit.'));
  }
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function callMemberRpc(name, payload = {}) {
  return memberRest(`rpc/${encodeURIComponent(name)}`, {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(payload)
  });
}

export async function signOutMember() {
  if (supabaseAuthClient) {
    await supabaseAuthClient.auth.signOut().catch(() => {});
  }
  const session = getMemberSession();
  if (session?.access_token) {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: authHeaders(session.access_token)
    }).catch(() => {});
  }
  clearMemberSession();
}
