export const SUPABASE_URL = 'https://lhoicaivkkyofirmtbsr.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_D0P1PoRmG-6-SCIYGqJydw_km1D_OD1';
export const PROFILE_PHOTO_BUCKET = 'duonera-profile-photos';

export function createUuid() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, character => {
    const random = Math.floor(Math.random() * 16);
    const value = character === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

export async function insertRow(table, payload) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${encodeURIComponent(table)}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase insert failed (${response.status}): ${details}`);
  }
}

export async function uploadPrivateFile(bucket, path, file) {
  const encodedPath = path
    .split('/')
    .map(segment => encodeURIComponent(segment))
    .join('/');
  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${encodeURIComponent(bucket)}/${encodedPath}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      'Content-Type': file.type,
      'x-upsert': 'false'
    },
    body: file
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase photo upload failed (${response.status}): ${details}`);
  }

  return path;
}
