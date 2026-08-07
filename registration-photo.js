import {
  createUuid,
  PROFILE_PHOTO_BUCKET,
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_URL,
  uploadPrivateFile
} from './supabase-client.js?v=5';

const DATABASE_NAME = 'duonera-registration';
const STORE_NAME = 'pending-files';
const PHOTO_KEY = 'profile-photo';
const MAX_SOURCE_BYTES = 12 * 1024 * 1024;

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Photo storage is unavailable.'));
  });
}

async function databaseRequest(mode, callback) {
  const database = await openDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, mode);
      const request = callback(transaction.objectStore(STORE_NAME));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Photo storage failed.'));
    });
  } finally {
    database.close();
  }
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('The selected photo could not be opened.'));
    };
    image.src = url;
  });
}

export async function compressProfilePhoto(file) {
  if (!file || !String(file.type || '').startsWith('image/') || file.size > MAX_SOURCE_BYTES) {
    throw new Error('invalid_photo');
  }
  const image = await loadImage(file);
  const longest = Math.max(image.naturalWidth, image.naturalHeight);
  const scale = Math.min(1, 1600 / longest);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext('2d', { alpha: false });
  context.fillStyle = '#f4f0e8';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.86));
  if (!blob) throw new Error('invalid_photo');
  return blob;
}

export async function savePendingRegistrationPhoto(email, photo) {
  const blob = photo instanceof Blob && photo.type === 'image/jpeg'
    ? photo
    : await compressProfilePhoto(photo);
  await databaseRequest('readwrite', store => store.put({
    email: String(email || '').trim().toLowerCase(),
    blob,
    saved_at: Date.now()
  }, PHOTO_KEY));
  return blob;
}

async function readPendingRegistrationPhoto() {
  return databaseRequest('readonly', store => store.get(PHOTO_KEY));
}

async function removePendingRegistrationPhoto() {
  return databaseRequest('readwrite', store => store.delete(PHOTO_KEY));
}

export async function uploadMemberPhoto(auth, photo) {
  const blob = photo instanceof Blob && photo.type === 'image/jpeg'
    ? photo
    : await compressProfilePhoto(photo);
  const path = `${auth.user.id}/profile-${Date.now()}-${createUuid()}.jpg`;
  await uploadPrivateFile(PROFILE_PHOTO_BUCKET, path, blob, auth.session.access_token);
  return path;
}

export async function uploadPendingRegistrationPhoto(auth) {
  let pending = null;
  try {
    pending = await readPendingRegistrationPhoto();
  } catch {
    return '';
  }
  if (!pending?.blob) return '';
  const email = String(auth.user?.email || '').trim().toLowerCase();
  if (pending.email && pending.email !== email) return '';
  const path = await uploadMemberPhoto(auth, pending.blob);
  await removePendingRegistrationPhoto();
  return path;
}

export async function listMemberPhotoPaths(auth) {
  let response;
  try {
    response = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${encodeURIComponent(PROFILE_PHOTO_BUCKET)}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${auth.session.access_token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prefix: `${auth.user.id}/`,
        limit: 20,
        offset: 0,
        sortBy: { column: 'created_at', order: 'asc' }
      })
    });
  } catch {
    return [];
  }
  if (!response.ok) return [];
  const rows = await response.json();
  return (Array.isArray(rows) ? rows : [])
    .map(row => String(row.name || ''))
    .filter(name => /\.(jpe?g|png|webp)$/i.test(name))
    .map(name => `${auth.user.id}/${name}`);
}
