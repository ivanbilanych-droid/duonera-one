import { createUuid, insertRow } from './supabase-client.js?v=5';
import { callMemberRpc, memberRest } from './member-auth.js?v=19';
import {
  listMemberPhotoPaths,
  uploadPendingRegistrationPhoto
} from './registration-photo.js?v=1';

function savedRegistration(email = '') {
  try {
    const saved = JSON.parse(localStorage.getItem('duonera-short-registration') || 'null');
    if (!saved) return {};
    const savedEmail = String(saved.email || '').trim().toLowerCase();
    const memberEmail = String(email || '').trim().toLowerCase();
    return !savedEmail || !memberEmail || savedEmail === memberEmail ? saved : {};
  } catch {
    return {};
  }
}

function birthDateFromAge(age) {
  const numericAge = Math.min(120, Math.max(18, Number(age) || 18));
  const date = new Date();
  date.setFullYear(date.getFullYear() - numericAge);
  return date.toISOString().slice(0, 10);
}

function fallbackName(email) {
  const localPart = String(email || '').split('@')[0].replace(/[._-]+/g, ' ').trim();
  if (!localPart) return 'DUONERA';
  return localPart
    .split(/\s+/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
    .slice(0, 40);
}

function hasRegistrationDetails(registration) {
  return Boolean(
    registration.first_name ||
    registration.city ||
    registration.gender ||
    registration.looking_for
  );
}

async function ownRows(auth, table) {
  return memberRest(
    `${table}?select=*&user_id=eq.${encodeURIComponent(auth.user.id)}&order=created_at.desc&limit=1`
  );
}

async function ensureLead(auth, registration) {
  let lead = (await ownRows(auth, 'duonera_leads'))?.[0] || null;
  if (lead) return lead;

  const email = String(auth.user.email || registration.email || '').trim().toLowerCase();
  if (!email || !hasRegistrationDetails(registration)) return null;

  const leadId = (() => {
    try {
      return localStorage.getItem('duonera-lead-id') || createUuid();
    } catch {
      return createUuid();
    }
  })();

  try {
    await insertRow('duonera_leads', {
      id: leadId,
      gender: String(registration.gender || ''),
      looking_for: String(registration.looking_for || ''),
      age: Number(registration.age || 18),
      city: String(registration.city || '').trim(),
      email,
      consent_privacy: true,
      source: String(registration.source || 'duonera.cz/account-recovery')
    });
  } catch (error) {
    console.warn('DUONERA lead recovery will continue with an existing record', error);
  }

  await callMemberRpc('duonera_claim_registration').catch(() => {});
  lead = (await ownRows(auth, 'duonera_leads'))?.[0] || null;
  return lead;
}

function profilePayload(auth, lead, registration, photoPaths) {
  const email = String(auth.user.email || lead.email || registration.email || '').trim().toLowerCase();
  const age = Number(registration.age || lead.age || 18);
  return {
    id: createUuid(),
    user_id: auth.user.id,
    lead_id: lead.id,
    status: 'new',
    first_name: String(registration.first_name || fallbackName(email)).trim().slice(0, 40),
    birth_date: birthDateFromAge(age),
    gender: String(registration.gender || lead.gender || ''),
    looking_for: String(registration.looking_for || lead.looking_for || ''),
    country: String(registration.country || 'Česko'),
    city: String(registration.city || lead.city || '').trim(),
    email,
    languages: Array.isArray(registration.languages) ? registration.languages.filter(Boolean) : [],
    height_cm: null,
    occupation: '',
    education: '',
    relationship_status: '',
    children: '',
    pets: '',
    smoking: '',
    alcohol: '',
    traits: [],
    interests: [],
    about_me: '',
    ideal_relationship: '',
    preferred_age_min: null,
    preferred_age_max: null,
    preferred_distance_km: [25, 50, 100].includes(Number(registration.preferred_distance_km))
      ? Number(registration.preferred_distance_km)
      : 50,
    relationship_goal: 'Vážný vztah',
    consent_privacy: true,
    consent_discovery: true,
    consent_contact: false,
    is_approved: false,
    is_discoverable: false,
    source: 'duonera.cz/short-registration',
    photo_paths: photoPaths,
    public_photo_paths: [],
    raw_data: { starter_profile: true, registration_age: age }
  };
}

export async function ensureMemberProfile(auth) {
  if (!auth?.session?.access_token || !auth?.user?.id) return null;

  await callMemberRpc('duonera_claim_registration').catch(() => {});
  const current = (await ownRows(auth, 'duonera_profiles'))?.[0] || null;
  if (current) return current;

  const saved = savedRegistration(auth.user.email);
  const registration = { ...(auth.user.user_metadata || {}), ...saved };
  if (!hasRegistrationDetails(registration)) return null;

  const lead = await ensureLead(auth, registration);
  if (!lead?.id) return null;

  let photoPaths = await listMemberPhotoPaths(auth);
  if (!photoPaths.length) {
    const uploaded = await uploadPendingRegistrationPhoto(auth);
    if (uploaded) photoPaths = [uploaded];
  }

  const payload = profilePayload(auth, lead, registration, photoPaths.slice(0, 3));
  try {
    await insertRow('duonera_profiles', payload, 20000, auth.session.access_token);
    return payload;
  } catch (error) {
    const recovered = (await ownRows(auth, 'duonera_profiles'))?.[0] || null;
    if (recovered) return recovered;
    throw error;
  }
}
