import { createUuid, insertRow } from './supabase-client.js?v=5';

const cityDefaults={cs:'Praha',de:'Berlin',pl:'Warszawa',sk:'Bratislava',en:'Prague'};
const countryLocales={CZ:'cs',DE:'de',PL:'pl',SK:'sk'};
const copy={
  cs:{photoArea:'a okolí',eyebrow:'VÁŽNÉ SEZNÁMENÍ NAPŘÍČ EVROPOU',titleOne:'Někdo nablízku.',titleTwo:'Něco skutečného.',lead:'Soukromě propojujeme lidi, kteří hledají vážný vztah — ve vašem městě a po celé Evropě.',nearLabel:'lidí poblíž',privateLabel:'soukromý profil',mutualLabel:'vzájemné ano',cta:'Ukázat lidi poblíž',micro:'Zdarma · bez veřejného profilu · přibližně 1 minuta',step:'Začínáme u vás',section:'Nejdřív vaše město. Potom celá Evropa.',sectionText:'Vy určíte vzdálenost. DUONERA vybere jen lidi, se kterými má setkání smysl.',entry:'VÁŠ SOUKROMÝ VSTUP',question:'Koho chcete potkat?',iAm:'Jsem',looking:'Hledám',woman:'Žena',man:'Muž',womanAcc:'Ženu',manAcc:'Muže',age:'Věk',city:'Město',continue:'Pokračovat',back:'Zpět',email:'E-mail',consent:'Souhlasím se zpracováním údajů pro registraci a soukromý výběr DUONERA.',privacyLink:'Ochrana soukromí',submit:'Vytvořit soukromý profil',privacy:'Vaše údaje nejsou veřejné.',sending:'Bezpečně ukládáme…',error:'Registraci se nepodařilo uložit. Zkontrolujte připojení a zkuste to znovu.'},
  de:{photoArea:'und Umgebung',eyebrow:'ERNSTE PARTNERSUCHE IN GANZ EUROPA',titleOne:'Jemand in Ihrer Nähe.',titleTwo:'Etwas Echtes.',lead:'Wir bringen Menschen zusammen, die eine ernsthafte Beziehung suchen — in Ihrer Stadt und in ganz Europa.',nearLabel:'Menschen in der Nähe',privateLabel:'privates Profil',mutualLabel:'gegenseitiges Ja',cta:'Menschen in der Nähe finden',micro:'Kostenlos · kein öffentliches Profil · etwa 1 Minute',step:'Wir starten bei Ihnen',section:'Zuerst Ihre Stadt. Dann ganz Europa.',sectionText:'Sie bestimmen die Entfernung. DUONERA zeigt nur Menschen, bei denen ein Treffen Sinn ergibt.',entry:'IHR PRIVATER EINSTIEG',question:'Wen möchten Sie treffen?',iAm:'Ich bin',looking:'Ich suche',woman:'Frau',man:'Mann',womanAcc:'Eine Frau',manAcc:'Einen Mann',age:'Alter',city:'Stadt',continue:'Weiter',back:'Zurück',email:'E-Mail',consent:'Ich stimme der Datenverarbeitung für die Registrierung und private DUONERA-Auswahl zu.',privacyLink:'Datenschutz',submit:'Privates Profil erstellen',privacy:'Ihre Daten sind nicht öffentlich.',sending:'Wird sicher gespeichert…',error:'Die Registrierung konnte nicht gespeichert werden. Prüfen Sie Ihre Verbindung und versuchen Sie es erneut.'},
  pl:{photoArea:'i okolice',eyebrow:'POWAŻNE ZNAJOMOŚCI W CAŁEJ EUROPIE',titleOne:'Ktoś blisko.',titleTwo:'Coś prawdziwego.',lead:'Prywatnie łączymy osoby szukające poważnego związku — w Twoim mieście i w całej Europie.',nearLabel:'osób w pobliżu',privateLabel:'prywatny profil',mutualLabel:'wzajemne tak',cta:'Pokaż osoby w pobliżu',micro:'Bezpłatnie · bez publicznego profilu · około 1 minuty',step:'Zaczynamy blisko Ciebie',section:'Najpierw Twoje miasto. Potem cała Europa.',sectionText:'Ty wybierasz odległość. DUONERA pokazuje tylko osoby, z którymi spotkanie ma sens.',entry:'TWÓJ PRYWATNY WSTĘP',question:'Kogo chcesz poznać?',iAm:'Jestem',looking:'Szukam',woman:'Kobietą',man:'Mężczyzną',womanAcc:'Kobiety',manAcc:'Mężczyzny',age:'Wiek',city:'Miasto',continue:'Dalej',back:'Wstecz',email:'E-mail',consent:'Zgadzam się na przetwarzanie danych w celu rejestracji i prywatnego doboru DUONERA.',privacyLink:'Prywatność',submit:'Utwórz prywatny profil',privacy:'Twoje dane nie są publiczne.',sending:'Bezpiecznie zapisujemy…',error:'Nie udało się zapisać rejestracji. Sprawdź połączenie i spróbuj ponownie.'},
  sk:{photoArea:'a okolie',eyebrow:'VÁŽNE ZOZNÁMENIE V CELEJ EURÓPE',titleOne:'Niekto nablízku.',titleTwo:'Niečo skutočné.',lead:'Súkromne spájame ľudí, ktorí hľadajú vážny vzťah — vo vašom meste a v celej Európe.',nearLabel:'ľudí nablízku',privateLabel:'súkromný profil',mutualLabel:'vzájomné áno',cta:'Ukázať ľudí nablízku',micro:'Zadarmo · bez verejného profilu · približne 1 minúta',step:'Začíname pri vás',section:'Najprv vaše mesto. Potom celá Európa.',sectionText:'Vy určíte vzdialenosť. DUONERA vyberie len ľudí, s ktorými má stretnutie zmysel.',entry:'VÁŠ SÚKROMNÝ VSTUP',question:'Koho chcete stretnúť?',iAm:'Som',looking:'Hľadám',woman:'Žena',man:'Muž',womanAcc:'Ženu',manAcc:'Muža',age:'Vek',city:'Mesto',continue:'Pokračovať',back:'Späť',email:'E-mail',consent:'Súhlasím so spracovaním údajov pre registráciu a súkromný výber DUONERA.',privacyLink:'Ochrana súkromia',submit:'Vytvoriť súkromný profil',privacy:'Vaše údaje nie sú verejné.',sending:'Bezpečne ukladáme…',error:'Registráciu sa nepodarilo uložiť. Skontrolujte pripojenie a skúste to znova.'},
  en:{photoArea:'and nearby',eyebrow:'SERIOUS DATING ACROSS EUROPE',titleOne:'Someone nearby.',titleTwo:'Something real.',lead:'We privately connect people looking for a serious relationship — in your city and across Europe.',nearLabel:'people nearby',privateLabel:'private profile',mutualLabel:'mutual yes',cta:'See people nearby',micro:'Free · no public profile · about 1 minute',step:'We start near you',section:'Your city first. Then all of Europe.',sectionText:'You choose the distance. DUONERA shows only people worth meeting.',entry:'YOUR PRIVATE ENTRY',question:'Who would you like to meet?',iAm:'I am',looking:'Looking for',woman:'Woman',man:'Man',womanAcc:'A woman',manAcc:'A man',age:'Age',city:'City',continue:'Continue',back:'Back',email:'Email',consent:'I agree to data processing for registration and private DUONERA selections.',privacyLink:'Privacy',submit:'Create private profile',privacy:'Your details are never public.',sending:'Saving securely…',error:'We could not save your registration. Check your connection and try again.'}
};

const params=new URLSearchParams(location.search);
const country=(params.get('country')||'').toUpperCase();
const languageHint=(params.get('lang')||countryLocales[country]||navigator.language.split('-')[0]||'en').toLowerCase();
let current=Object.hasOwn(copy,languageHint)?languageHint:'en';
let city=params.get('city')?.trim()||cityDefaults[current];
const cityWasProvided=Boolean(params.get('city')?.trim());

const modal=document.querySelector('#registrationModal');
const form=document.querySelector('.register-form');
const toast=document.querySelector('.toast');
const languageButton=document.querySelector('.language-button');
const languageMenu=document.querySelector('.language-menu');

function applyLocale(next,manual=false){
  const previous=current;
  current=Object.hasOwn(copy,next)?next:'en';
  const dict=copy[current];
  document.documentElement.lang=current;
  document.querySelectorAll('[data-i18n]').forEach(element=>{
    const key=element.dataset.i18n;
    if(dict[key]) element.textContent=dict[key];
  });
  if(manual&&!cityWasProvided&&city===cityDefaults[previous]) city=cityDefaults[current];
  document.querySelectorAll('[data-city]').forEach(element=>element.textContent=city);
  const cityInput=document.querySelector('[data-city-input]');
  if(cityInput) cityInput.value=city;
  languageButton.textContent=current.toUpperCase();
  languageButton.setAttribute('aria-label',dict.language||'Language');
}

function setFormStep(step){
  form.querySelectorAll('.form-step').forEach(element=>{element.hidden=element.dataset.step!==String(step)});
}

function openRegistration(){
  modal.hidden=false;
  document.body.classList.add('modal-open');
  setFormStep(1);
  setTimeout(()=>modal.querySelector('.choice-row button.active')?.focus(),30);
}

function closeRegistration(){
  modal.hidden=true;
  document.body.classList.remove('modal-open');
}

function showError(message){
  toast.textContent=message;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),5000);
}

applyLocale(current);

languageButton.addEventListener('click',()=>{
  const willOpen=languageMenu.hidden;
  languageMenu.hidden=!willOpen;
  languageButton.setAttribute('aria-expanded',String(willOpen));
});

languageMenu.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>{
  applyLocale(button.dataset.lang,true);
  languageMenu.hidden=true;
  languageButton.setAttribute('aria-expanded','false');
}));

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
  document.querySelectorAll('[data-city]').forEach(element=>element.textContent=city);
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
  const original=submit.querySelector('[data-i18n="submit"]').textContent;
  submit.disabled=true;
  submit.querySelector('[data-i18n="submit"]').textContent=copy[current].sending;
  const id=createUuid();
  const payload={
    id,
    gender:String(data.get('Jsem')||'').trim(),
    looking_for:String(data.get('Hledám')||'').trim(),
    age:Number(data.get('Věk')),
    city:String(data.get('Město')||'').trim(),
    email:String(data.get('email')||'').trim().toLowerCase(),
    consent_privacy:data.get('consent_privacy')==='true',
    source:'duonera.cz-europe-home'
  };
  try{
    await insertRow('duonera_leads',payload,20000);
    try{
      localStorage.setItem('duonera-lead-id',id);
      localStorage.setItem('duonera-short-registration',JSON.stringify(Object.fromEntries(data.entries())));
      localStorage.setItem('duonera-entry-context',JSON.stringify({country,lang:current,city:payload.city,utm_source:params.get('utm_source')||'',utm_campaign:params.get('utm_campaign')||''}));
    }catch(error){}
    if(typeof window.fbq==='function') window.fbq('track','Lead',{content_name:'europe_short_registration'});
    const url=new URL('ucet.html',location.href);
    url.searchParams.set('mode','register');
    url.searchParams.set('email',payload.email);
    location.assign(url);
  }catch(error){
    console.error(error);
    submit.disabled=false;
    submit.querySelector('[data-i18n="submit"]').textContent=original;
    showError(copy[current].error);
  }
});

if('serviceWorker'in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/service-worker.js?v=26').catch(()=>{}))}
