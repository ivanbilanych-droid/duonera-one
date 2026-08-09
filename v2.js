import { createUuid, insertRow } from './supabase-client.js?v=5';
import { registerMember } from './member-auth.js?v=19';
import { compressProfilePhoto, savePendingRegistrationPhoto } from './registration-photo.js?v=2';

const dialog=document.querySelector('.register-dialog');
const form=document.querySelector('.register-form');
const toast=document.querySelector('.toast');
const language=document.querySelector('[data-language]');
const params=new URLSearchParams(location.search);
const country=String(params.get('country')||'').toUpperCase();
const countryDefaults={CZ:{city:'Praha',country:'Česko'},SK:{city:'Bratislava',country:'Slovensko'},DE:{city:'Berlin',country:'Deutschland'},AT:{city:'Wien',country:'Österreich'},PL:{city:'Warszawa',country:'Polska'},UA:{city:'Kyiv',country:'Україна'}};
const locale={cs:{city:'Praha',country:'Česko',language:'Čeština'},de:{city:'Berlin',country:'Deutschland',language:'Deutsch'},it:{city:'Roma',country:'Italia',language:'Italiano'},pl:{city:'Warszawa',country:'Polska',language:'Polski'},sk:{city:'Bratislava',country:'Slovensko',language:'Slovenčina'},uk:{city:'Kyiv',country:'Україна',language:'Українська'},ru:{city:'Praha',country:'Česko',language:'Русский'},en:{city:'Prague',country:'Czechia',language:'English'}};
const text={
cs:{login:'Přihlásit se',start:'Začít',navHow:'Jak to funguje',navSafety:'Bezpečnost',eyebrow:'SOUKROMÉ SEZNÁMENÍ PRO LIDI, KTEŘÍ CHTĚJÍ VÍC',headline:'Smysluplná seznámení',headlineAccent:'pro lidi, kteří chtějí víc',lead:'DUONERA propojuje lidi podle hodnot, životních cílů a skutečné kompatibility. Žádné nekonečné listování — jen několik kvalitních možností a kontakt po vzájemném zájmu.',cta:'Začít registraci',verified:'Schválené profily',private:'Soukromí na prvním místě',mutualOnly:'Kontakt jen po vzájemném zájmu',formEyebrow:'REGISTRACE · KROK 1 Z 5',formTitle:'Začneme vaším účtem.',formIntro:'Po ověření e-mailu pokračujete ve stejné registraci a dokončíte profil.',submit:'Pokračovat v registraci',formFoot:'Jedna registrace · váš profil není veřejný · od 18 let',successEyebrow:'REGISTRACE POKRAČUJE',success:'První krok je hotový,',successText:'Potvrďte e-mail. Potom se automaticky vrátíte k dokončení stejné registrace.',openAccount:'Pokračovat v registraci',invalid:'Doplňte označené údaje.',photoInvalid:'Vyberte fotografii JPG, PNG nebo WEBP do 12 MB.',submitting:'Vytvářím účet…',accountExists:'Tento e-mail už má účet. Přihlaste se.',error:'Registraci se nepodařilo dokončit. Zkuste to znovu.'},
en:{login:'Sign in',start:'Start',navHow:'How it works',navSafety:'Safety',eyebrow:'PRIVATE MATCHMAKING FOR PEOPLE WHO WANT MORE',headline:'Meaningful introductions',headlineAccent:'for people who want more',lead:'DUONERA connects people through values, life goals and real compatibility. No endless swiping — just a few quality possibilities and contact after mutual interest.',cta:'Start registration',verified:'Reviewed profiles',private:'Privacy first',mutualOnly:'Contact only after mutual interest',formEyebrow:'REGISTRATION · STEP 1 OF 5',formTitle:'Let’s start with your account.',formIntro:'After confirming your email you continue the same registration and complete your profile.',submit:'Continue registration',formFoot:'One registration · your profile is not public · 18+',successEyebrow:'REGISTRATION CONTINUES',success:'The first step is done,',successText:'Confirm your email and you will return to finish the same registration.',openAccount:'Continue registration',invalid:'Complete the highlighted details.',photoInvalid:'Choose a JPG, PNG or WEBP photo up to 12 MB.',submitting:'Creating account…',accountExists:'This email already has an account. Sign in.',error:'Registration could not be completed. Please try again.'}
};
let active='cs';
function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(window.__duoneraToast);window.__duoneraToast=setTimeout(()=>toast.classList.remove('show'),3600)}
function applyLanguage(code){active=text[code]?code:'cs';document.documentElement.lang=active;const copy=text[active];document.querySelectorAll('[data-i18n]').forEach(node=>{const value=copy[node.dataset.i18n];if(value)node.textContent=value});const cityInput=form.elements.city;if(cityInput&&!cityInput.value)cityInput.value=params.get('city')||countryDefaults[country]?.city||locale[active]?.city||'Praha';language.value=active;try{localStorage.setItem('duonera-lang',active)}catch{}}
function initialLanguage(){const query=params.get('lang');if(text[query])return query;try{const saved=localStorage.getItem('duonera-lang');if(text[saved])return saved}catch{}return navigator.language?.toLowerCase().startsWith('en')?'en':'cs'}
language?.addEventListener('change',e=>applyLanguage(e.target.value));applyLanguage(initialLanguage());

document.querySelectorAll('[data-open-register]').forEach(button=>button.addEventListener('click',()=>dialog.showModal()));
document.querySelector('[data-close-register]')?.addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});

const photoInput=form.elements.photo;
const photoPreview=form.querySelector('[data-photo-preview]');
const photoPlaceholder=form.querySelector('[data-photo-placeholder]');
let preparedPhoto=null;
let photoUrl='';
let photoPreparation=Promise.resolve();
photoInput.addEventListener('change',()=>{photoPreparation=(async()=>{preparedPhoto=null;if(photoUrl)URL.revokeObjectURL(photoUrl);photoPreview.hidden=true;photoPlaceholder.hidden=false;const file=photoInput.files?.[0];if(!file)return;try{preparedPhoto=await compressProfilePhoto(file);photoUrl=URL.createObjectURL(preparedPhoto);photoPreview.src=photoUrl;photoPreview.hidden=false;photoPlaceholder.hidden=true}catch{photoInput.value='';showToast(text[active].photoInvalid)}})()});

function markInvalid(){form.querySelectorAll('.invalid').forEach(node=>node.classList.remove('invalid'));const invalid=[...form.elements].filter(node=>node.willValidate&&!node.checkValidity());invalid.forEach(node=>(node.closest('fieldset')||node).classList.add('invalid'));invalid[0]?.focus();return invalid.length===0}
function gender(value){return value==='woman'?'Žena':'Muž'}
function seeking(value){return value==='woman'?'Ženu':'Muže'}

form.addEventListener('submit',async event=>{
 event.preventDefault();await photoPreparation;
 if(!markInvalid()){showToast(text[active].invalid);return}
 if(!preparedPhoto){showToast(text[active].photoInvalid);return}
 const data=new FormData(form);const id=createUuid();const email=String(data.get('email')).trim().toLowerCase();
 const profile={id,first_name:String(data.get('first_name')).trim(),age:Number(data.get('age')),gender:gender(data.get('gender')),looking_for:seeking(data.get('looking_for')),city:String(data.get('city')).trim(),country:countryDefaults[country]?.country||locale[active]?.country||'Česko',languages:[locale[active]?.language||'Čeština'],email,preferred_distance_km:Number(data.get('distance')||50),consent_privacy:true,landing_language:active,source:'duonera.cz/registration',registration_stage:'account_created'};
 const button=form.querySelector('.submit'),label=button.querySelector('span'),original=label.textContent;
 try{button.disabled=true;label.textContent=text[active].submitting;await savePendingRegistrationPhoto(email,preparedPhoto);const redirect=`${location.origin}/profil.html?registration=continue`;const registration=await registerMember(email,String(data.get('password')||''),redirect,profile);try{await insertRow('duonera_leads',{id,gender:profile.gender,looking_for:profile.looking_for,age:profile.age,city:profile.city,email:profile.email,consent_privacy:true,source:profile.source},20000)}catch(error){console.warn('Lead save skipped',error)}localStorage.setItem('duonera-short-registration',JSON.stringify(profile));localStorage.setItem('duonera-lead-id',id);document.querySelector('[data-success-name]').textContent=profile.first_name;document.querySelector('[data-account-after-registration]').href=`profil.html?registration=continue&email=${encodeURIComponent(email)}`;dialog.close();document.querySelector('.success').hidden=false;if(registration?.user?.id&&typeof gtag==='function')gtag('event','sign_up',{method:'email_password'});}catch(error){console.error(error);showToast(error?.code==='account_exists'?text[active].accountExists:text[active].error)}finally{button.disabled=false;label.textContent=original}
});

const tracking=document.querySelector('.tracking-consent');
try{if(!localStorage.getItem('duoneraConsentChoice'))tracking.hidden=false}catch{}
document.querySelector('[data-tracking-reject]')?.addEventListener('click',()=>{try{localStorage.setItem('duoneraConsentChoice','necessary')}catch{}tracking.hidden=true});
document.querySelector('[data-tracking-accept]')?.addEventListener('click',()=>{try{localStorage.setItem('duoneraConsentChoice','granted');localStorage.setItem('duoneraAnalyticsConsent','granted');localStorage.setItem('duoneraMarketingConsent','granted')}catch{}window.duoneraLoadMetaPixel?.();tracking.hidden=true});
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('/service-worker.js').catch(()=>{}));
