import { createUuid, insertRow } from './supabase-client.js?v=5';

const copy = {
  cs:{
    account:'Můj účet',eyebrow:'SOUKROMÉ SEZNAMOVÁNÍ PRO VÁŽNÝ VZTAH',title:'Méně profilů. Větší šance potkat správného člověka.',lead:'DUONERA vám ukáže jen několik lidí, kteří odpovídají vašemu životu, hodnotám a představě o vztahu.',cta:'Vytvořit profil zdarma',heroNote:'Bez platby. Bez veřejného profilu. Bez automatického předplatného.',p1:'Profil vidí pouze vybraní lidé',p2:'Žádné nekonečné swipování',p3:'Cílem je skutečné setkání',previewTitle:'Vaše soukromá подборka',previewCount:'3 vhodní lidé',previewText:'Skutečné profily se zobrazí až po soukromé registraci.',howLabel:'JAK TO FUNGUJE',howTitle:'Tři jednoduché kroky ke skutečné schůzce.',s1:'Vytvoříte soukromý profil',s1t:'Řeknete nám, kdo jste, jak žijete a koho chcete potkat.',s2:'Dostanete malý výběr',s2t:'Ne stovky lidí. Jen několik profilů, které dávají smysl.',s3:'Vyberete se navzájem',s3t:'Kontakt se otevře až při vzájemném zájmu a potom přijde skutečné setkání.',joinLabel:'REGISTRACE ZDARMA',joinTitle:'Začněte během jedné minuty.',joinText:'Vyplňte pouze základní údaje. Podrobný profil doplníte později.',formIAm:'Jsem',formSeek:'Hledám',man:'Muž',woman:'Žena',seekWoman:'Ženu',seekMan:'Muže',age:'Věk',city:'Město',email:'E-mail',submit:'Vytvořit profil zdarma',consent:'Souhlasím se zpracováním údajů pro registraci a soukromý výběr DUONERA.',privacy:'Ochrana soukromí',terms:'Podmínky služby',sending:'Ukládáme registraci…',error:'Registraci se nepodařilo uložit. Zkuste to znovu.'
  },
  en:{
    account:'My account',eyebrow:'PRIVATE DATING FOR A SERIOUS RELATIONSHIP',title:'Fewer profiles. A better chance of meeting the right person.',lead:'DUONERA shows you only a few people who fit your lifestyle, values and idea of a relationship.',cta:'Create a free profile',heroNote:'No payment. No public profile. No automatic subscription.',p1:'Only selected people see your profile',p2:'No endless swiping',p3:'The goal is a real meeting',previewTitle:'Your private selection',previewCount:'3 suitable people',previewText:'Real profiles appear only after private registration.',howLabel:'HOW IT WORKS',howTitle:'Three simple steps to a real date.',s1:'Create a private profile',s1t:'Tell us who you are, how you live and who you want to meet.',s2:'Receive a small selection',s2t:'Not hundreds of people. Only a few profiles that make sense.',s3:'Choose each other',s3t:'Contact opens only when interest is mutual, followed by a real meeting.',joinLabel:'FREE REGISTRATION',joinTitle:'Start in one minute.',joinText:'Enter only the basics. Complete your detailed profile later.',formIAm:'I am',formSeek:'Looking for',man:'Man',woman:'Woman',seekWoman:'Woman',seekMan:'Man',age:'Age',city:'City',email:'Email',submit:'Create a free profile',consent:'I agree to data processing for registration and private DUONERA selections.',privacy:'Privacy',terms:'Terms',sending:'Saving registration…',error:'We could not save your registration. Please try again.'
  },
  de:{
    account:'Mein Konto',eyebrow:'PRIVATE PARTNERSUCHE FÜR EINE ERNSTE BEZIEHUNG',title:'Weniger Profile. Eine bessere Chance auf den richtigen Menschen.',lead:'DUONERA zeigt Ihnen nur wenige Menschen, die zu Ihrem Leben, Ihren Werten und Ihrer Beziehungsvorstellung passen.',cta:'Kostenloses Profil erstellen',heroNote:'Keine Zahlung. Kein öffentliches Profil. Kein automatisches Abo.',p1:'Nur ausgewählte Personen sehen Ihr Profil',p2:'Kein endloses Swipen',p3:'Das Ziel ist ein echtes Treffen',previewTitle:'Ihre private Auswahl',previewCount:'3 passende Menschen',previewText:'Echte Profile erscheinen erst nach der privaten Registrierung.',howLabel:'SO FUNKTIONIERT ES',howTitle:'Drei einfache Schritte zu einem echten Treffen.',s1:'Privates Profil erstellen',s1t:'Sagen Sie uns, wer Sie sind, wie Sie leben und wen Sie kennenlernen möchten.',s2:'Kleine Auswahl erhalten',s2t:'Keine Hunderte von Menschen. Nur wenige passende Profile.',s3:'Einander auswählen',s3t:'Der Kontakt öffnet sich erst bei gegenseitigem Interesse. Danach folgt das Treffen.',joinLabel:'KOSTENLOSE REGISTRIERUNG',joinTitle:'Starten Sie in einer Minute.',joinText:'Zunächst nur die Grundlagen. Das ausführliche Profil folgt später.',formIAm:'Ich bin',formSeek:'Ich suche',man:'Mann',woman:'Frau',seekWoman:'Frau',seekMan:'Mann',age:'Alter',city:'Stadt',email:'E-Mail',submit:'Kostenloses Profil erstellen',consent:'Ich stimme der Datenverarbeitung für Registrierung und private DUONERA-Auswahl zu.',privacy:'Datenschutz',terms:'Bedingungen',sending:'Registrierung wird gespeichert…',error:'Die Registrierung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.'
  },
  uk:{
    account:'Мій акаунт',eyebrow:'ПРИВАТНІ ЗНАЙОМСТВА ДЛЯ СЕРЙОЗНИХ СТОСУНКІВ',title:'Менше анкет. Більше шансів зустріти правильну людину.',lead:'DUONERA показує лише кількох людей, які відповідають вашому способу життя, цінностям і уявленню про стосунки.',cta:'Створити анкету безкоштовно',heroNote:'Без оплати. Без публічної анкети. Без автоматичної підписки.',p1:'Анкету бачать лише вибрані люди',p2:'Без нескінченного свайпання',p3:'Мета — справжня зустріч',previewTitle:'Ваша приватна добірка',previewCount:'3 відповідні людини',previewText:'Справжні анкети з’являться після приватної реєстрації.',howLabel:'ЯК ЦЕ ПРАЦЮЄ',howTitle:'Три прості кроки до справжньої зустрічі.',s1:'Створіть приватну анкету',s1t:'Розкажіть, хто ви, як живете і кого хочете зустріти.',s2:'Отримайте невелику добірку',s2t:'Не сотні людей. Лише кілька анкет, які справді підходять.',s3:'Оберіть одне одного',s3t:'Контакт відкривається лише при взаємному інтересі. Потім — зустріч.',joinLabel:'БЕЗКОШТОВНА РЕЄСТРАЦІЯ',joinTitle:'Почніть за одну хвилину.',joinText:'Вкажіть лише основні дані. Детальну анкету заповните пізніше.',formIAm:'Я',formSeek:'Шукаю',man:'Чоловік',woman:'Жінка',seekWoman:'Жінку',seekMan:'Чоловіка',age:'Вік',city:'Місто',email:'E-mail',submit:'Створити анкету безкоштовно',consent:'Я погоджуюся на обробку даних для реєстрації та приватної добірки DUONERA.',privacy:'Захист даних',terms:'Умови',sending:'Зберігаємо реєстрацію…',error:'Не вдалося зберегти реєстрацію. Спробуйте ще раз.'
  },
  ru:{
    account:'Мой аккаунт',eyebrow:'ПРИВАТНЫЕ ЗНАКОМСТВА ДЛЯ СЕРЬЁЗНЫХ ОТНОШЕНИЙ',title:'Меньше анкет. Больше шансов встретить подходящего человека.',lead:'DUONERA показывает только нескольких людей, которые подходят вашему образу жизни, ценностям и представлению об отношениях.',cta:'Создать анкету бесплатно',heroNote:'Без оплаты. Без публичной анкеты. Без автоматической подписки.',p1:'Анкету видят только выбранные люди',p2:'Без бесконечного листания',p3:'Цель — настоящая встреча',previewTitle:'Ваша приватная подборка',previewCount:'3 подходящих человека',previewText:'Настоящие анкеты появятся после приватной регистрации.',howLabel:'КАК ЭТО РАБОТАЕТ',howTitle:'Три простых шага до настоящей встречи.',s1:'Создайте приватную анкету',s1t:'Расскажите, кто вы, как живёте и кого хотите встретить.',s2:'Получите небольшую подборку',s2t:'Не сотни людей. Только несколько анкет, которые действительно подходят.',s3:'Выберите друг друга',s3t:'Контакт открывается только при взаимном интересе. Затем — встреча.',joinLabel:'БЕСПЛАТНАЯ РЕГИСТРАЦИЯ',joinTitle:'Начните за одну минуту.',joinText:'Укажите только основные данные. Подробную анкету заполните позже.',formIAm:'Я',formSeek:'Ищу',man:'Мужчина',woman:'Женщина',seekWoman:'Женщину',seekMan:'Мужчину',age:'Возраст',city:'Город',email:'E-mail',submit:'Создать анкету бесплатно',consent:'Я согласен на обработку данных для регистрации и приватной подборки DUONERA.',privacy:'Защита данных',terms:'Условия',sending:'Сохраняем регистрацию…',error:'Не удалось сохранить регистрацию. Попробуйте ещё раз.'
  }
};

const aliases={cs:'cs',cz:'cs',en:'en',de:'de',uk:'uk',ua:'uk',ru:'ru'};
const fallback=copy.cs;
let current='cs';
try{current=aliases[localStorage.getItem('duonera-lang')]||'cs';}catch(error){}
const query=aliases[new URLSearchParams(location.search).get('lang')?.toLowerCase()];
if(query) current=query;

function applyLanguage(lang){
  current=copy[lang]?lang:'cs';
  const dict=copy[current]||fallback;
  document.documentElement.lang=current==='uk'?'uk':current;
  document.querySelectorAll('[data-copy]').forEach(node=>{
    const value=dict[node.dataset.copy]||fallback[node.dataset.copy];
    if(value) node.textContent=value;
  });
  document.querySelectorAll('[data-lang]').forEach(button=>button.classList.toggle('active',button.dataset.lang===current));
  try{localStorage.setItem('duonera-lang',current);}catch(error){}
}

document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>applyLanguage(button.dataset.lang)));
applyLanguage(current);
document.getElementById('year').textContent=new Date().getFullYear();

const form=document.querySelector('.register-form');
const toast=document.querySelector('.toast');
form?.querySelectorAll('[data-toggle-name] button').forEach(button=>button.addEventListener('click',()=>{
  const group=button.closest('[data-toggle-name]');
  const name=group.dataset.toggleName;
  const value=button.dataset.value;
  form.querySelector(`input[name="${name}"]`).value=value;
  group.querySelectorAll('button').forEach(item=>item.classList.toggle('active',item===button));
}));

form?.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!form.reportValidity()) return;
  const data=new FormData(form);
  if(data.get('_honey')) return;
  const dict=copy[current]||fallback;
  const button=form.querySelector('button[type="submit"]');
  const original=button.textContent;
  button.disabled=true;
  button.textContent=dict.sending;
  const id=createUuid();
  const payload={
    id,
    gender:String(data.get('Jsem')||'').trim(),
    looking_for:String(data.get('Hledám')||'').trim(),
    age:Number(data.get('Věk')),
    city:String(data.get('Město')||'').trim(),
    email:String(data.get('email')||'').trim().toLowerCase(),
    consent_privacy:data.get('consent_privacy')==='true',
    source:'duonera.cz-mobile-home'
  };
  try{
    await insertRow('duonera_leads',payload,20000);
    try{
      localStorage.setItem('duonera-lead-id',id);
      localStorage.setItem('duonera-short-registration',JSON.stringify(Object.fromEntries(data.entries())));
    }catch(error){}
    const url=new URL('ucet.html',location.href);
    url.searchParams.set('mode','register');
    url.searchParams.set('email',payload.email);
    location.assign(url);
  }catch(error){
    console.error(error);
    button.disabled=false;
    button.textContent=original;
    toast.textContent=dict.error;
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'),5000);
  }
});

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/service-worker.js').catch(()=>{}));}
