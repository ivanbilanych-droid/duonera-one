import {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
} from './supabase-client.js?v=5';

const MEMBER_SESSION_KEY = 'duonera-member-session';
const SUPABASE_AUTH_STORAGE_KEY = 'duonera-supabase-auth';
const AUTH_REDIRECT_ERROR_KEY = 'duonera-auth-redirect-error';

const supabaseAuthClient = window.supabase?.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storageKey: SUPABASE_AUTH_STORAGE_KEY,
      persistSession: true,
      autoRefreshToken: true,
      // Let the SDK accept Supabase magic-link callbacks. The manual parser
      // below remains as a fallback for every callback format.
      detectSessionInUrl: true,
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

export function takeAuthRedirectError() {
  const message = sessionStorage.getItem(AUTH_REDIRECT_ERROR_KEY) || '';
  sessionStorage.removeItem(AUTH_REDIRECT_ERROR_KEY);
  return message;
}

async function readSupabaseSession() {
  if (!supabaseAuthClient) return null;
  try {
    const { data, error } = await supabaseAuthClient.auth.getSession();
    if (error) throw error;
    if (data?.session?.access_token) {
      saveMemberSession(data.session);
      return data.session;
    }
  } catch {
    // The local session fallback remains available below.
  }
  return null;
}

async function waitForSupabaseSession(timeout = 2500) {
  const current = await readSupabaseSession();
  if (current || !supabaseAuthClient) return current;

  return new Promise(resolve => {
    let settled = false;
    let timer = null;
    let subscription = null;
    const finish = session => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      subscription?.unsubscribe();
      if (session?.access_token) saveMemberSession(session);
      resolve(session || null);
    };

    const result = supabaseAuthClient.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token) finish(session);
    });
    subscription = result?.data?.subscription || null;
    timer = setTimeout(() => finish(null), timeout);
  });
}

export async function consumeAuthRedirect() {
  const url = new URL(location.href);
  const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''));
  const searchParams = url.searchParams;
  const redirectError =
    searchParams.get('error_description') ||
    hashParams.get('error_description') ||
    searchParams.get('error') ||
    hashParams.get('error') ||
    '';
  let session = null;
  let handled = false;

  if (redirectError) {
    sessionStorage.setItem(AUTH_REDIRECT_ERROR_KEY, redirectError);
  }

  if (hashParams.get('access_token')) {
    session = {
      access_token: hashParams.get('access_token'),
      refresh_token: hashParams.get('refresh_token'),
      expires_in: Number(hashParams.get('expires_in') || 3600),
      expires_at: Number(hashParams.get('expires_at') || 0),
      token_type: hashParams.get('token_type') || 'bearer'
    };
    saveMemberSession(session);
    if (supabaseAuthClient && session.refresh_token) {
      await supabaseAuthClient.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token
      }).catch(() => {});
    }
    handled = true;
  }

  const code = searchParams.get('code');
  if (!session && code && supabaseAuthClient) {
    const { data, error } = await supabaseAuthClient.auth.exchangeCodeForSession(code);
    if (!error && data?.session?.access_token) {
      session = data.session;
      saveMemberSession(session);
      handled = true;
    }
  }

  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  if (!session && tokenHash && type && supabaseAuthClient) {
    const { data, error } = await supabaseAuthClient.auth.verifyOtp({
      token_hash: tokenHash,
      type
    });
    if (!error && data?.session?.access_token) {
      session = data.session;
      saveMemberSession(session);
      handled = true;
    }
  }

  if (!session && !redirectError) {
    session = await waitForSupabaseSession();
    handled = Boolean(session);
  }

  if (handled || searchParams.has('error') || hashParams.has('error')) {
    searchParams.delete('code');
    searchParams.delete('token_hash');
    searchParams.delete('type');
    searchParams.delete('error');
    searchParams.delete('error_code');
    searchParams.delete('error_description');
    history.replaceState(
      {},
      document.title,
      `${url.pathname}${searchParams.toString() ? `?${searchParams}` : ''}`
    );
  }

  return session || getMemberSession();
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
  // Accept every callback format used by Supabase before deciding that
  // the member is signed out.
  await consumeAuthRedirect();

  await readSupabaseSession();

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
