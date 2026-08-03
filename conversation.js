import { createUuid, insertRow } from './supabase-client.js?v=5';

const app = document.querySelector('.app');
const screens = [...document.querySelectorAll('.screen')];
const bars = [...document.querySelectorAll('.progress span')];
const back = document.querySelector('.back');
const count = document.querySelector('.step-count');
const toast = document.querySelector('.toast');
const answers = {};
let step = 0;

const labels = {
  cs:{login:'Můj účet',begin:'Začít',note:'Bez platby. Bez veřejného profilu.',q1:'Co je pro vás teď nejdůležitější?',a1:'Najít vztah s budoucností',a2:'Potkat člověka se stejným životním rytmem',a3:'Začít znovu po velké životní změně',a4:'Přestat ztrácet čas v aplikacích',next:'Pokračovat',q2:'Koho hledáte?',iam:'Jsem',seek:'Hledám',man:'Muž',woman:'Žena',q3:'Kde má začít vaše skutečné seznámení?',age:'Věk',city:'Město',q4:'Kam vám můžeme poslat první soukromý výběr?',email:'E-mail',consent:'Souhlasím se zpracováním údajů pro registraci a soukromý výběr DUONERA.',submit:'Vstoupit do DUONERA',done:'Váš soukromý vstup je připraven.',doneText:'Teď vytvoříte svůj profil. Nebude veřejný a kontakt se otevře až při vzájemné volbě.',open:'Pokračovat do profilu',back:'Zpět',saving:'Ukládáme…',error:'Nepodařilo se uložit údaje. Zkuste to znovu.'},
  en:{login:'My account',begin:'Begin',note:'No payment. No public profile.',q1:'What matters most to you right now?',a1:'A relationship with a future',a2:'Someone with a similar rhythm of life',a3:'A new beginning after a major change',a4:'No more wasted time in dating apps',next:'Continue',q2:'Who are you looking for?',iam:'I am',seek:'Looking for',man:'Man',woman:'Woman',q3:'Where should your real introduction begin?',age:'Age',city:'City',q4:'Where can we send your first private selection?',email:'Email',consent:'I agree to data processing for registration and private DUONERA selections.',submit:'Enter DUONERA',done:'Your private entry is ready.',doneText:'Now create your profile. It will not be public, and contact opens only after mutual choice.',open:'Continue to profile',back:'Back',saving:'Saving…',error:'We could not save your details. Please try again.'},
  de:{login:'Mein Konto',begin:'Starten',note:'Keine Zahlung. Kein öffentliches Profil.',q1:'Was ist Ihnen jetzt am wichtigsten?',a1:'Eine Beziehung mit Zukunft',a2:'Ein Mensch mit ähnlichem Lebensrhythmus',a3:'Ein Neuanfang nach einer großen Veränderung',a4:'Keine Zeit mehr in Dating-Apps verlieren',next:'Weiter',q2:'Wen suchen Sie?',iam:'Ich bin',seek:'Ich suche',man:'Mann',woman:'Frau',q3:'Wo soll Ihre echte Begegnung beginnen?',age:'Alter',city:'Stadt',q4:'Wohin dürfen wir Ihre erste private Auswahl senden?',email:'E-Mail',consent:'Ich stimme der Datenverarbeitung für Registrierung und private DUONERA-Auswahl zu.',submit:'DUONERA betreten',done:'Ihr privater Zugang ist bereit.',doneText:'Jetzt erstellen Sie Ihr Profil. Es ist nicht öffentlich und Kontakt öffnet sich nur bei gegenseitiger Wahl.',open:'Zum Profil',back:'Zurück',saving:'Wird gespeichert…',error:'Die Daten konnten nicht gespeichert werden.'},
  uk:{login:'Мій акаунт',begin:'Почати',note:'Без оплати. Без публічної анкети.',q1:'Що для вас зараз найважливіше?',a1:'Стосунки з майбутнім',a2:'Людина зі схожим ритмом життя',a3:'Новий початок після великої зміни',a4:'Більше не втрачати час у застосунках',next:'Продовжити',q2:'Кого ви шукаєте?',iam:'Я',seek:'Шукаю',man:'Чоловік',woman:'Жінка',q3:'Де має початися ваше справжнє знайомство?',age:'Вік',city:'Місто',q4:'Куди надіслати вашу першу приватну добірку?',email:'E-mail',consent:'Я погоджуюся на обробку даних для реєстрації та приватної добірки DUONERA.',submit:'Увійти в DUONERA',done:'Ваш приватний вхід готовий.',doneText:'Тепер створіть анкету. Вона не буде публічною, а контакт відкриється лише після взаємного вибору.',open:'Перейти до анкети',back:'Назад',saving:'Зберігаємо…',error:'Не вдалося зберегти дані.'},
  ru:{login:'Мой аккаунт',begin:'Начать',note:'Без оплаты. Без публичной анкеты.',q1:'Что для вас сейчас важнее всего?',a1:'Отношения с будущим',a2:'Человек с похожим ритмом жизни',a3:'Новое начало после большой перемены',a4:'Больше не терять время в приложениях',next:'Продолжить',q2:'Кого вы ищете?',iam:'Я',seek:'Ищу',man:'Мужчина',woman:'Женщина',q3:'Где должно начаться ваше настоящее знакомство?',age:'Возраст',city:'Город',q4:'Куда отправить вашу первую приватную подборку?',email:'E-mail',consent:'Я согласен на обработку данных для регистрации и приватной подборки DUONERA.',submit:'Войти в DUONERA',done:'Ваш приватный вход готов.',doneText:'Теперь создайте анкету. Она не будет публичной, а контакт откроется только после взаимного выбора.',open:'Перейти к анкете',back:'Назад',saving:'Сохраняем…',error:'Не удалось сохранить данные.'}
};

let lang = 'cs';
try { lang = localStorage.getItem('duonera-lang') || 'cs'; } catch(e) {}
if(!labels[lang]) lang='cs';

function applyLanguage(){
  const t=labels[lang];
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-t]').forEach(el=>{ const v=t[el.dataset.t]; if(v) el.textContent=v; });
  document.querySelectorAll('[data-lang]').forEach(btn=>btn.classList.toggle('active',btn.dataset.lang===lang));
}

document.querySelectorAll('[data-lang]').forEach(btn=>btn.addEventListener('click',()=>{
  lang=btn.dataset.lang;
  try{localStorage.setItem('duonera-lang',lang);}catch(e){}
  applyLanguage();
}));

function show(n){
  step=Math.max(0,Math.min(n,screens.length-1));
  screens.forEach((s,i)=>s.classList.toggle('active',i===step));
  bars.forEach((b,i)=>b.classList.toggle('done',i<step));
  app.dataset.step=String(step);
  back.hidden=step===0||step===screens.length-1;
  count.textContent=step===0?'':`${Math.min(step,4)} / 4`;
}

document.querySelectorAll('[data-next]').forEach(btn=>btn.addEventListener('click',()=>show(step+1)));
back.addEventListener('click',()=>show(step-1));

document.querySelectorAll('.choice').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected'));
  btn.classList.add('selected');
  answers.intent=btn.dataset.value;
  document.querySelector('[data-intent-next]').disabled=false;
}));

document.querySelectorAll('.segment').forEach(group=>group.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{
  group.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));
  btn.classList.add('selected');
  answers[group.dataset.name]=btn.dataset.value;
  document.querySelector('[data-gender-next]').disabled=!(answers.gender&&answers.looking_for);
})));

const locationNext=document.querySelector('[data-location-next]');
const age=document.querySelector('[name="age"]');
const city=document.querySelector('[name="city"]');
function validateLocation(){ locationNext.disabled=!(age.value&&city.value.trim()); }
age.addEventListener('input',validateLocation);city.addEventListener('input',validateLocation);

const form=document.querySelector('.email-form');
form.addEventListener('submit',async e=>{
  e.preventDefault();
  if(!form.reportValidity()) return;
  const t=labels[lang];
  const submit=form.querySelector('button[type="submit"]');
  const original=submit.textContent;
  submit.disabled=true;submit.textContent=t.saving;
  const email=form.email.value.trim().toLowerCase();
  const leadId=createUuid();
  const payload={id:leadId,gender:answers.gender||'',looking_for:answers.looking_for||'',age:Number(age.value),city:city.value.trim(),email,consent_privacy:form.consent.checked,source:'duonera-conversation'};
  try{
    await insertRow('duonera_leads',payload,20000);
    try{
      localStorage.setItem('duonera-lead-id',leadId);
      localStorage.setItem('duonera-short-registration',JSON.stringify({...payload,intent:answers.intent||''}));
    }catch(err){}
    const link=document.querySelector('.final-link');
    link.href=`ucet.html?mode=register&email=${encodeURIComponent(email)}`;
    show(5);
  }catch(err){
    console.error(err);submit.disabled=false;submit.textContent=original;toast.textContent=t.error;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),4500);
  }
});

applyLanguage();show(0);
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('/service-worker.js').catch(()=>{}));
