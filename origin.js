import { createUuid, insertRow } from './supabase-client.js?v=5';

const copy = {
  cs: {
    navIdea:'Myšlenka', navHow:'Jak to funguje', navPrivacy:'Soukromí', account:'Můj účet',
    eyebrow:'SEZNÁMENÍ BEZ NEKONEČNÉHO VÝBĚRU', title:'Ne další seznamka. Jeden člověk, kterého stojí za to potkat.',
    lead:'DUONERA nevytváří veřejný katalog lidí. Vytvoří vám malý soukromý výběr podle toho, jak žijete, co hledáte a co je pro vás důležité.',
    cta:'Vytvořit soukromý profil', howCta:'Jak to funguje', p1:'Profil není veřejný', p2:'Žádné nekonečné swipování', p3:'Cíl je skutečné setkání',
    pearl:'Méně možností. Větší pozornost.', pearlSmall:'PRINCIP DUONERA',
    one:'1', oneText:'soukromý profil', three:'3', threeText:'pečlivé výběry', meet:'1', meetText:'vzájemná volba',
    ideaLabel:'JINÝ PRINCIP', ideaTitle:'Internet vás učí vybírat stále dál. DUONERA vás vede k rozhodnutí.',
    ideaText:'Nechceme, abyste strávili večer prohlížením stovek profilů. Chceme vám ukázat několik lidí, vysvětlit, proč mohou dávat smysl, a otevřít kontakt pouze při vzájemném zájmu.',
    howLabel:'TŘI KROKY', howTitle:'Od soukromého profilu k opravdovému setkání.',
    s1:'Řeknete, kdo jste', s1t:'Ne jen věk a město. Zajímá nás váš rytmus života, hodnoty a představa o vztahu.',
    s2:'Dostanete malý výběr', s2t:'Žádný veřejný katalog. Jen několik lidí, kteří odpovídají vašim důležitým podmínkám.',
    s3:'Rozhodnutí musí být vzájemné', s3t:'Kontakt se otevře až tehdy, když si vyberete navzájem. Potom přichází skutečná schůzka.',
    joinLabel:'ZAČNĚTE BEZ PLATBY', joinTitle:'První krok trvá méně než minutu.', joinText:'Vyplníte jen základ. Podrobný profil doplníte později a sami rozhodnete, zda pokračovat.',
    formIAm:'Jsem', formSeek:'Hledám', man:'Muž', woman:'Žena', seekWoman:'Ženu', seekMan:'Muže', age:'Věk', city:'Město', email:'E-mail', submit:'Začít soukromě',
    consent:'Souhlasím se zpracováním údajů pro registraci a soukromý výběr DUONERA.',
    privacyLabel:'SOUKROMÍ NENÍ DOPLNĚK', privacyTitle:'Vaše údaje nejsou veřejné zboží.', privacyText:'Nezveřejňujeme e-mail, telefon, příjmení ani přesné datum narození. Profil se ukazuje pouze v soukromém výběru.',
    footer:'Jeden správný člověk je víc než tisíc profilů.', privacy:'Ochrana soukromí', terms:'Podmínky služby', sending:'Ukládáme…', error:'Registraci se nepodařilo uložit. Zkuste to prosím znovu.'
  },
  en: {
    navIdea:'The idea', navHow:'How it works', navPrivacy:'Privacy', account:'My account', eyebrow:'DATING WITHOUT ENDLESS CHOICE', title:'Not another dating app. One person worth meeting.', lead:'DUONERA does not build a public catalogue of people. It creates a small private selection based on how you live, what you seek and what matters to you.', cta:'Create a private profile', howCta:'How it works', p1:'Your profile is not public', p2:'No endless swiping', p3:'The goal is a real meeting', pearl:'Fewer options. More attention.', pearlSmall:'THE DUONERA PRINCIPLE', one:'1', oneText:'private profile', three:'3', threeText:'careful selections', meet:'1', meetText:'mutual choice', ideaLabel:'A DIFFERENT PRINCIPLE', ideaTitle:'The internet teaches you to keep choosing. DUONERA leads you to a decision.', ideaText:'We do not want you spending the evening browsing hundreds of profiles. We want to show a few people, explain why they may fit, and open contact only when interest is mutual.', howLabel:'THREE STEPS', howTitle:'From a private profile to a real meeting.', s1:'Tell us who you are', s1t:'Not only age and city. We care about your lifestyle, values and vision of a relationship.', s2:'Receive a small selection', s2t:'No public catalogue. Only a few people matching your important conditions.', s3:'The decision must be mutual', s3t:'Contact opens only when you choose each other. Then comes the real meeting.', joinLabel:'START WITHOUT PAYMENT', joinTitle:'The first step takes less than a minute.', joinText:'Enter only the basics. Complete your detailed profile later and decide whether to continue.', formIAm:'I am', formSeek:'Looking for', man:'Man', woman:'Woman', seekWoman:'Woman', seekMan:'Man', age:'Age', city:'City', email:'Email', submit:'Start privately', consent:'I agree to data processing for registration and private DUONERA selections.', privacyLabel:'PRIVACY IS NOT AN EXTRA', privacyTitle:'Your data is not a public product.', privacyText:'We do not publish your email, phone, surname or exact birth date. Your profile appears only in a private selection.', footer:'One right person matters more than a thousand profiles.', privacy:'Privacy', terms:'Terms', sending:'Saving…', error:'We could not save your registration. Please try again.'
  },
  de: {
    navIdea:'Die Idee', navHow:'So funktioniert es', navPrivacy:'Privatsphäre', account:'Mein Konto', eyebrow:'PARTNERSUCHE OHNE ENDLOSE AUSWAHL', title:'Keine weitere Dating-App. Ein Mensch, den es sich zu treffen lohnt.', lead:'DUONERA erstellt keinen öffentlichen Katalog. Sie erhalten eine kleine private Auswahl passend zu Ihrem Leben, Ihren Wünschen und Ihren Werten.', cta:'Privates Profil erstellen', howCta:'So funktioniert es', p1:'Ihr Profil ist nicht öffentlich', p2:'Kein endloses Swipen', p3:'Das Ziel ist ein echtes Treffen', pearl:'Weniger Auswahl. Mehr Aufmerksamkeit.', pearlSmall:'DAS DUONERA-PRINZIP', one:'1', oneText:'privates Profil', three:'3', threeText:'sorgfältige Vorschläge', meet:'1', meetText:'gegenseitige Wahl', ideaLabel:'EIN ANDERES PRINZIP', ideaTitle:'Das Internet lehrt Sie, immer weiterzusuchen. DUONERA führt zu einer Entscheidung.', ideaText:'Sie sollen nicht den Abend mit Hunderten Profilen verbringen. Wir zeigen wenige Menschen, erklären die mögliche Verbindung und öffnen den Kontakt nur bei gegenseitigem Interesse.', howLabel:'DREI SCHRITTE', howTitle:'Vom privaten Profil zum echten Treffen.', s1:'Erzählen Sie, wer Sie sind', s1t:'Nicht nur Alter und Stadt. Lebensstil, Werte und Beziehungsvorstellungen zählen.', s2:'Erhalten Sie eine kleine Auswahl', s2t:'Kein öffentlicher Katalog. Nur wenige Menschen, die zu Ihren wichtigen Bedingungen passen.', s3:'Die Entscheidung muss gegenseitig sein', s3t:'Der Kontakt öffnet sich erst, wenn Sie einander wählen. Danach folgt das echte Treffen.', joinLabel:'KOSTENLOS STARTEN', joinTitle:'Der erste Schritt dauert weniger als eine Minute.', joinText:'Zunächst nur die Grundlagen. Das ausführliche Profil folgt später und Sie entscheiden selbst.', formIAm:'Ich bin', formSeek:'Ich suche', man:'Mann', woman:'Frau', seekWoman:'Frau', seekMan:'Mann', age:'Alter', city:'Stadt', email:'E-Mail', submit:'Privat starten', consent:'Ich stimme der Datenverarbeitung für Registrierung und private DUONERA-Auswahl zu.', privacyLabel:'PRIVATSPHÄRE IST KEIN EXTRA', privacyTitle:'Ihre Daten sind kein öffentliches Produkt.', privacyText:'E-Mail, Telefon, Nachname und genaues Geburtsdatum werden nicht veröffentlicht. Ihr Profil erscheint nur in einer privaten Auswahl.', footer:'Ein richtiger Mensch ist mehr wert als tausend Profile.', privacy:'Datenschutz', terms:'Bedingungen', sending:'Wird gespeichert…', error:'Die Registrierung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.'
  },
  uk: {
    navIdea:'Ідея', navHow:'Як це працює', navPrivacy:'Приватність', account:'Мій акаунт', eyebrow:'ЗНАЙОМСТВА БЕЗ НЕСКІНЧЕННОГО ВИБОРУ', title:'Не ще один застосунок. Одна людина, яку варто зустріти.', lead:'DUONERA не створює публічний каталог людей. Вона формує невелику приватну добірку відповідно до вашого життя, цінностей і намірів.', cta:'Створити приватну анкету', howCta:'Як це працює', p1:'Анкета не публічна', p2:'Без нескінченного свайпання', p3:'Мета — справжня зустріч', pearl:'Менше варіантів. Більше уваги.', pearlSmall:'ПРИНЦИП DUONERA', one:'1', oneText:'приватна анкета', three:'3', threeText:'ретельні добірки', meet:'1', meetText:'взаємний вибір', ideaLabel:'ІНШИЙ ПРИНЦИП', ideaTitle:'Інтернет вчить обирати далі. DUONERA веде до рішення.', ideaText:'Ми не хочемо, щоб ви переглядали сотні анкет. Ми показуємо кількох людей, пояснюємо можливу сумісність і відкриваємо контакт лише при взаємному інтересі.', howLabel:'ТРИ КРОКИ', howTitle:'Від приватної анкети до справжньої зустрічі.', s1:'Розкажіть, хто ви', s1t:'Не лише вік і місто. Важливі ваш стиль життя, цінності та бачення стосунків.', s2:'Отримайте невелику добірку', s2t:'Без публічного каталогу. Лише кілька людей, які відповідають вашим важливим умовам.', s3:'Рішення має бути взаємним', s3t:'Контакт відкривається лише після взаємного вибору. Потім — справжня зустріч.', joinLabel:'ПОЧНІТЬ БЕЗ ОПЛАТИ', joinTitle:'Перший крок займає менше хвилини.', joinText:'Спочатку лише основа. Детальну анкету заповните пізніше й самі вирішите, чи продовжувати.', formIAm:'Я', formSeek:'Шукаю', man:'Чоловік', woman:'Жінка', seekWoman:'Жінку', seekMan:'Чоловіка', age:'Вік', city:'Місто', email:'E-mail', submit:'Почати приватно', consent:'Я погоджуюся на обробку даних для реєстрації та приватної добірки DUONERA.', privacyLabel:'ПРИВАТНІСТЬ — НЕ ДОДАТОК', privacyTitle:'Ваші дані — не публічний товар.', privacyText:'Ми не публікуємо e-mail, телефон, прізвище та точну дату народження. Анкета з’являється лише у приватній добірці.', footer:'Одна правильна людина важливіша за тисячу анкет.', privacy:'Захист даних', terms:'Умови', sending:'Зберігаємо…', error:'Не вдалося зберегти реєстрацію. Спробуйте ще раз.'
  },
  ru: {
    navIdea:'Идея', navHow:'Как это работает', navPrivacy:'Приватность', account:'Мой аккаунт', eyebrow:'ЗНАКОМСТВА БЕЗ БЕСКОНЕЧНОГО ВЫБОРА', title:'Не ещё один сайт знакомств. Один человек, которого стоит встретить.', lead:'DUONERA не создаёт публичный каталог людей. Она формирует небольшую приватную подборку с учётом вашего образа жизни, ценностей и серьёзности намерений.', cta:'Создать приватную анкету', howCta:'Как это работает', p1:'Анкета не публичная', p2:'Без бесконечного листания', p3:'Цель — настоящая встреча', pearl:'Меньше вариантов. Больше внимания.', pearlSmall:'ПРИНЦИП DUONERA', one:'1', oneText:'приватная анкета', three:'3', threeText:'точных подбора', meet:'1', meetText:'взаимный выбор', ideaLabel:'ДРУГОЙ ПРИНЦИП', ideaTitle:'Интернет учит выбирать дальше. DUONERA ведёт к решению.', ideaText:'Мы не хотим, чтобы вы проводили вечер за просмотром сотен анкет. Мы покажем нескольких людей, объясним возможную совместимость и откроем контакт только при взаимном интересе.', howLabel:'ТРИ ШАГА', howTitle:'От приватной анкеты до настоящей встречи.', s1:'Расскажите, кто вы', s1t:'Не только возраст и город. Важны ваш ритм жизни, ценности и представление об отношениях.', s2:'Получите небольшую подборку', s2t:'Никакого публичного каталога. Только несколько людей, которые соответствуют важным для вас условиям.', s3:'Решение должно быть взаимным', s3t:'Контакт открывается только после взаимного выбора. Затем — настоящая встреча.', joinLabel:'НАЧНИТЕ БЕЗ ОПЛАТЫ', joinTitle:'Первый шаг займёт меньше минуты.', joinText:'Сначала только основа. Подробную анкету заполните позже и сами решите, продолжать ли.', formIAm:'Я', formSeek:'Ищу', man:'Мужчина', woman:'Женщина', seekWoman:'Женщину', seekMan:'Мужчину', age:'Возраст', city:'Город', email:'E-mail', submit:'Начать приватно', consent:'Я согласен на обработку данных для регистрации и приватной подборки DUONERA.', privacyLabel:'ПРИВАТНОСТЬ — НЕ ДОПОЛНЕНИЕ', privacyTitle:'Ваши данные — не публичный товар.', privacyText:'Мы не публикуем e-mail, телефон, фамилию и точную дату рождения. Анкета появляется только в приватной подборке.', footer:'Один правильный человек важнее тысячи анкет.', privacy:'Защита данных', terms:'Условия', sending:'Сохраняем…', error:'Не удалось сохранить регистрацию. Попробуйте ещё раз.'
  }
};

const fallback = copy.cs;
const langButtons = [...document.querySelectorAll('[data-lang]')];
function setLanguage(lang){
  const dict = copy[lang] || fallback;
  document.documentElement.lang = lang === 'uk' ? 'uk' : lang;
  document.querySelectorAll('[data-copy]').forEach(node => {
    const value = dict[node.dataset.copy] || fallback[node.dataset.copy];
    if(value) node.textContent = value;
  });
  langButtons.forEach(button => button.classList.toggle('active', button.dataset.lang === lang));
  try{ localStorage.setItem('duonera-lang',lang); }catch(error){}
}
const aliases = {cs:'cs',cz:'cs',en:'en',de:'de',uk:'uk',ua:'uk',ru:'ru'};
const queryLang = aliases[new URLSearchParams(location.search).get('lang')?.toLowerCase()];
let storedLang = 'cs';
try{ storedLang = aliases[localStorage.getItem('duonera-lang')] || 'cs'; }catch(error){}
setLanguage(queryLang || storedLang);
langButtons.forEach(button => button.addEventListener('click',()=>setLanguage(button.dataset.lang)));

const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
menuButton?.addEventListener('click',()=>{
  const open = mobileMenu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded',String(open));
  mobileMenu.setAttribute('aria-hidden',String(!open));
});
mobileMenu?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
  mobileMenu.classList.remove('open');
  menuButton?.setAttribute('aria-expanded','false');
  mobileMenu.setAttribute('aria-hidden','true');
}));

document.getElementById('year').textContent = new Date().getFullYear();

const form = document.querySelector('.register-form');
const toast = document.querySelector('.toast');
function setToggle(name,value){
  const input = form.querySelector(`input[name="${name}"]`);
  if(input) input.value = value;
  form.querySelectorAll(`[data-toggle-name="${name}"] button`).forEach(button=>button.classList.toggle('active',button.dataset.value === value));
}
form?.querySelectorAll('[data-toggle-name] button').forEach(button=>button.addEventListener('click',()=>{
  const group = button.closest('[data-toggle-name]');
  setToggle(group.dataset.toggleName,button.dataset.value);
}));

form?.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!form.reportValidity()) return;
  const data = new FormData(form);
  if(data.get('_honey')) return;
  const lang = document.documentElement.lang === 'uk' ? 'uk' : document.documentElement.lang;
  const dict = copy[lang] || fallback;
  const button = form.querySelector('button[type="submit"]');
  const original = button.textContent;
  button.disabled = true;
  button.textContent = dict.sending;
  const leadId = createUuid();
  const payload = {
    id:leadId,
    gender:String(data.get('Jsem') || '').trim(),
    looking_for:String(data.get('Hledám') || '').trim(),
    age:Number(data.get('Věk')),
    city:String(data.get('Město') || '').trim(),
    email:String(data.get('email') || '').trim().toLowerCase(),
    consent_privacy:data.get('consent_privacy') === 'true',
    source:'duonera.cz-origin'
  };
  try{
    await insertRow('duonera_leads',payload,20000);
    try{
      localStorage.setItem('duonera-lead-id',leadId);
      localStorage.setItem('duonera-short-registration',JSON.stringify(Object.fromEntries(data.entries())));
    }catch(error){}
    const accountUrl = new URL('ucet.html',location.href);
    accountUrl.searchParams.set('mode','register');
    accountUrl.searchParams.set('email',payload.email);
    location.assign(accountUrl);
  }catch(error){
    console.error(error);
    button.disabled = false;
    button.textContent = original;
    toast.textContent = dict.error;
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'),5000);
  }
});

if('serviceWorker' in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register('/service-worker.js').catch(()=>{}));
}
