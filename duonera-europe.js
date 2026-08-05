import { createUuid, insertRow } from './supabase-client.js?v=5';

const cityDefaults={cs:'Praha',de:'Berlin',pl:'Warszawa',sk:'Bratislava',en:'Prague'};
const countryLocales={CZ:'cs',DE:'de',PL:'pl',SK:'sk',AT:'de',CH:'de'};
const copy={
  cs:{eyebrow:'SOUKROMÉ SEZNAMOVÁNÍ',titleOne:'Setkání nezačíná na obrazovce.',titleTwo:'Začíná člověkem.',lead:'DUONERA vybírá několik lidí blízko vás, kteří chtějí totéž: vážný vztah a skutečné setkání.',radius:'Vzdálenost',preparing:'SOUKROMÝ VÝBĚR',people:'vhodní lidé',hidden:'Nikdo vás nevidí veřejně',cta:'Spustit můj výběr',micro:'Zdarma · diskrétně · hotovo za 1 minutu',mutual:'VZÁJEMNÁ VOLBA',meeting:'SKUTEČNÁ SCHŮZKA',entry:'ZAČÍNÁME BLÍZKO VÁS',question:'Koho chcete potkat?',iAm:'Jsem',looking:'Hledám',woman:'Žena',man:'Muž',womanAcc:'Ženu',manAcc:'Muže',age:'Věk',city:'Město',continue:'Pokračovat',back:'Zpět',email:'E-mail',consent:'Souhlasím se zpracováním údajů pro registraci a soukromý výběr DUONERA.',privacyLink:'Ochrana soukromí',submit:'Vytvořit soukromý profil',privacy:'Vaše údaje nejsou veřejné.',sending:'Bezpečně ukládáme…',error:'Registraci se nepodařilo uložit. Zkontrolujte připojení a zkuste to znovu.'},
  de:{eyebrow:'PRIVATE PARTNERSUCHE',titleOne:'Eine Begegnung beginnt nicht auf dem Bildschirm.',titleTwo:'Sondern mit einem Menschen.',lead:'DUONERA wählt wenige Menschen in Ihrer Nähe aus, die dasselbe suchen: eine ernsthafte Beziehung und ein echtes Treffen.',radius:'Entfernung',preparing:'PRIVATE AUSWAHL',people:'passende Menschen',hidden:'Ihr Profil ist niemals öffentlich',cta:'Meine Auswahl starten',micro:'Kostenlos · diskret · in 1 Minute',mutual:'GEGENSEITIGE WAHL',meeting:'ECHTES TREFFEN',entry:'WIR STARTEN IN IHRER NÄHE',question:'Wen möchten Sie treffen?',iAm:'Ich bin',looking:'Ich suche',woman:'Frau',man:'Mann',womanAcc:'Eine Frau',manAcc:'Einen Mann',age:'Alter',city:'Stadt',continue:'Weiter',back:'Zurück',email:'E-Mail',consent:'Ich stimme der Datenverarbeitung für die Registrierung und private DUONERA-Auswahl zu.',privacyLink:'Datenschutz',submit:'Privates Profil erstellen',privacy:'Ihre Daten sind nicht öffentlich.',sending:'Wird sicher gespeichert…',error:'Die Registrierung konnte nicht gespeichert werden. Prüfen Sie Ihre Verbindung und versuchen Sie es erneut.'},
  pl:{eyebrow:'PRYWATNE ZNAJOMOŚCI',titleOne:'Spotkanie nie zaczyna się na ekranie.',titleTwo:'Zaczyna się od człowieka.',lead:'DUONERA wybiera kilka osób blisko Ciebie, które szukają tego samego: poważnego związku i prawdziwego spotkania.',radius:'Odległość',preparing:'PRYWATNY WYBÓR',people:'pasujące osoby',hidden:'Nikt nie widzi Cię publicznie',cta:'Uruchom mój wybór',micro:'Bezpłatnie · dyskretnie · 1 minuta',mutual:'WZAJEMNY WYBÓR',meeting:'PRAWDZIWE SPOTKANIE',entry:'ZACZYNAMY BLISKO CIEBIE',question:'Kogo chcesz poznać?',iAm:'Jestem',looking:'Szukam',woman:'Kobietą',man:'Mężczyzną',womanAcc:'Kobiety',manAcc:'Mężczyzny',age:'Wiek',city:'Miasto',continue:'Dalej',back:'Wstecz',email:'E-mail',consent:'Zgadzam się na przetwarzanie danych w celu rejestracji i prywatnego doboru DUONERA.',privacyLink:'Prywatność',submit:'Utwórz prywatny profil',privacy:'Twoje dane nie są publiczne.',sending:'Bezpiecznie zapisujemy…',error:'Nie udało się zapisać rejestracji. Sprawdź połączenie i spróbuj ponownie.'},
  sk:{eyebrow:'SÚKROMNÉ ZOZNAMOVANIE',titleOne:'Stretnutie sa nezačína na obrazovke.',titleTwo:'Začína človekom.',lead:'DUONERA vyberie niekoľko ľudí blízko vás, ktorí chcú to isté: vážny vzťah a skutočné stretnutie.',radius:'Vzdialenosť',preparing:'SÚKROMNÝ VÝBER',people:'vhodní ľudia',hidden:'Nikto vás nevidí verejne',cta:'Spustiť môj výber',micro:'Zadarmo · diskrétne · za 1 minútu',mutual:'VZÁJOMNÁ VOĽBA',meeting:'SKUTOČNÉ STRETNUTIE',entry:'ZAČÍNAME BLÍZKO VÁS',question:'Koho chcete stretnúť?',iAm:'Som',looking:'Hľadám',woman:'Žena',man:'Muž',womanAcc:'Ženu',manAcc:'Muža',age:'Vek',city:'Mesto',continue:'Pokračovať',back:'Späť',email:'E-mail',consent:'Súhlasím so spracovaním údajov pre registráciu a súkromný výber DUONERA.',privacyLink:'Ochrana súkromia',submit:'Vytvoriť súkromný profil',privacy:'Vaše údaje nie sú verejné.',sending:'Bezpečne ukladáme…',error:'Registráciu sa nepodarilo uložiť. Skontrolujte pripojenie a skúste to znova.'},
  en:{eyebrow:'PRIVATE SERIOUS DATING',titleOne:'A meeting does not begin on a screen.',titleTwo:'It starts with a person.',lead:'DUONERA selects a few people near you who want the same thing: a serious relationship and a real meeting.',radius:'Distance',preparing:'PRIVATE SELECTION',people:'suitable people',hidden:'Your profile is never public',cta:'Start my selection',micro:'Free · discreet · 1 minute',mutual:'MUTUAL CHOICE',meeting:'REAL MEETING',entry:'WE START NEAR YOU',question:'Who would you like to meet?',iAm:'I am',looking:'Looking for',woman:'Woman',man:'Man',womanAcc:'A woman',manAcc:'A man',age:'Age',city:'City',continue:'Continue',back:'Back',email:'Email',consent:'I agree to data processing for registration and private DUONERA selections.',privacyLink:'Privacy',submit:'Create private profile',privacy:'Your details are never public.',sending:'Saving securely…',error:'We could not save your registration. Check your connection and try again.'}
};

const params=new URLSearchParams(location.search);
const country=(params.get('country')||'').toUpperCase();
const languageHint=(params.get('lang')||countryLocales[country]||'cs').toLowerCase();
let current=Object.hasOwn(copy,languageHint)?languageHint:'cs';
let city=params.get('city')?.trim()||cityDefaults[current];
const cityWasProvided=Boolean(params.get('city')?.trim());
let distance=50;

const modal=document.querySelector('#registrationModal');
const form=document.querySelector('.register-form');
const toast=document.querySelector('.toast');
const languageButton=document.querySelector('.lang-pill');
const languageMenu=document.querySelector('.language-menu');

function updateCity(){
  document.querySelectorAll('[data-city]').forEach(element=>element.textContent=city);
  const cityInput=document.querySelector('[data-city-input]');
  if(cityInput) cityInput.value=city;
}

function applyLocale(next,manual=false){
  const previous=current;
  current=Object.hasOwn(copy,next)?next:'cs';
  if(manual&&!cityWasProvided&&city===cityDefaults[previous]) city=cityDefaults[current];
  const dict=copy[current];
  document.documentElement.lang=current;
  document.querySelectorAll('[data-i18n]').forEach(element=>{const value=dict[element.dataset.i18n];if(value) element.textContent=value});
  updateCity();
  languageButton.textContent=current.toUpperCase();
}

function updateDistance(value){
  distance=value;
  document.querySelectorAll('[data-radius]').forEach(element=>element.textContent=String(value));
  document.querySelector('[data-distance-one]').textContent=`+${Math.round(value*.34)} km`;
  document.querySelector('[data-distance-two]').textContent=`+${Math.round(value*.72)} km`;
  document.querySelectorAll('[data-distance]').forEach(button=>button.classList.toggle('active',Number(button.dataset.distance)===value));
}

function setFormStep(step){form.querySelectorAll('.form-step').forEach(element=>{element.hidden=element.dataset.step!==String(step)})}
function openRegistration(){modal.hidden=false;document.body.classList.add('modal-open');setFormStep(1);setTimeout(()=>modal.querySelector('.choice-row button.active')?.focus(),30)}
function closeRegistration(){modal.hidden=true;document.body.classList.remove('modal-open')}
function showError(message){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),5000)}

applyLocale(current);
updateDistance(distance);

document.querySelectorAll('[data-distance]').forEach(button=>button.addEventListener('click',()=>updateDistance(Number(button.dataset.distance))));
languageButton.addEventListener('click',()=>{const open=languageMenu.hidden;languageMenu.hidden=!open;languageButton.setAttribute('aria-expanded',String(open))});
languageMenu.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>{applyLocale(button.dataset.lang,true);languageMenu.hidden=true;languageButton.setAttribute('aria-expanded','false')}));
document.querySelectorAll('.open-registration').forEach(button=>button.addEventListener('click',openRegistration));
document.querySelectorAll('.close-registration').forEach(button=>button.addEventListener('click',closeRegistration));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!modal.hidden) closeRegistration()});

form.querySelectorAll('[data-toggle-name] button').forEach(button=>button.addEventListener('click',()=>{
  const group=button.closest('[data-toggle-name]');
  group.querySelector('input[type="hidden"]').value=button.dataset.value;
  group.querySelectorAll('button').forEach(item=>item.classList.toggle('active',item===button));
}));

form.querySelector('.next-form-step').addEventListener('click',()=>{
  const age=form.elements['Věk'];
  const cityField=form.elements['Město'];
  if(!age.reportValidity()||!cityField.reportValidity()) return;
  city=cityField.value.trim();
  updateCity();
  setFormStep(2);
  setTimeout(()=>form.elements.email.focus(),30);
});
form.querySelector('.form-back').addEventListener('click',()=>setFormStep(1));

form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!form.reportValidity()) return;
  const data=new FormData(form);
  if(data.get('_honey')) return;
  const submit=form.querySelector('.submit-registration');
  const submitText=submit.querySelector('[data-i18n="submit"]');
  const original=submitText.textContent;
  submit.disabled=true;
  submitText.textContent=copy[current].sending;
  const id=createUuid();
  const payload={id,gender:String(data.get('Jsem')||'').trim(),looking_for:String(data.get('Hledám')||'').trim(),age:Number(data.get('Věk')),city:String(data.get('Město')||'').trim(),email:String(data.get('email')||'').trim().toLowerCase(),consent_privacy:data.get('consent_privacy')==='true',source:'duonera.cz-orbit-home'};
  try{
    await insertRow('duonera_leads',payload,20000);
    try{
      localStorage.setItem('duonera-lead-id',id);
      localStorage.setItem('duonera-short-registration',JSON.stringify(Object.fromEntries(data.entries())));
      localStorage.setItem('duonera-entry-context',JSON.stringify({country,lang:current,city:payload.city,distance,utm_source:params.get('utm_source')||'',utm_campaign:params.get('utm_campaign')||''}));
    }catch(error){}
    if(typeof window.fbq==='function') window.fbq('track','Lead',{content_name:'orbit_short_registration'});
    const url=new URL('ucet.html',location.href);
    url.searchParams.set('mode','register');
    url.searchParams.set('email',payload.email);
    location.assign(url);
  }catch(error){
    console.error(error);
    submit.disabled=false;
    submitText.textContent=original;
    showError(copy[current].error);
  }
});

if('serviceWorker'in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/service-worker.js?v=31').catch(()=>{}))}
