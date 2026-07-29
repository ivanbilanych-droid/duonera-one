import {
  PROFILE_PHOTO_BUCKET,
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
} from './supabase-client.js?v=5';
import {
  callMemberRpc,
  clearMemberSession,
  memberRest,
  requestEmailOtp,
  requireMemberSession,
  signOutMember
} from './member-auth.js?v=6';

const DISCOVERY_BUCKET = 'duonera-discovery-photos';
const translations = {
  cs:{
    home:'Hlavní stránka',logout:'Odhlásit',loginLabel:'SOUKROMÝ PŘÍSTUP',loginTitle:'Váš osobní prostor DUONERA.',loginText:'Zadejte e-mail. Pošleme vám bezpečný šestimístný přihlašovací kód — bez hesla.',loginTrust1:'✓ Uvidíte vlastní profil a fotografie',loginTrust2:'✓ Omezený výběr ověřených lidí',loginTrust3:'✓ Kontakty zůstávají skryté',email:'E-mail',sendCode:'Poslat přihlašovací kód',otpCode:'Šestimístný kód z e-mailu',verifyCode:'Potvrdit kód a vstoupit',loginNote:'Kód platí pouze krátkou dobu a lze ho použít jen pro váš účet.',accountLabel:'MŮJ ÚČET',accountTitle:'Vítejte v DUONERA.',createProfile:'Vytvořit můj profil',ownLabel:'MOJE ANKETA',ownTitle:'Takto vás DUONERA vidí.',notCompleted:'Není vyplněna',emptyOwnTitle:'Ještě nemáte úplnou anketu.',emptyOwnText:'Po vyplnění zde uvidíte vlastní údaje a všechny uložené fotografie.',premiumLabel:'PRÉMIOVÁ SLUŽBA DUONERA',premiumTitle:'Tři nejlepší kandidáti pro vás.',premiumText:'DUONERA ručně připraví tři nejsilnější shody podle celé ankety. Nejde o další katalog, ale o osobní doporučení.',premiumEmpty:'Prémiová trojice zatím není připravena.',discoveryLabel:'OMEZENÝ VÝBĚR',discoveryTitle:'Skuteční lidé, které můžete poznat.',discoveryText:'Žádné nekonečné listování. Ukazujeme pouze omezený počet schválených profilů bez kontaktních údajů.',mutualTitle:'Máte vzájemnou sympatii.',mutualText:'DUONERA vás bude kontaktovat a pomůže domluvit skutečné setkání.',loading:'Načítání profilů…',footer:'Soukromí. Omezený výběr. Skutečné setkání.',linkSent:'Kód jsme poslali. Otevřete e-mail a zadejte šest číslic.',loginError:'Kód se nepodařilo odeslat. Zkuste to znovu.',codeError:'Kód není platný nebo již vypršel. Pošlete si nový kód.',loadError:'Účet se nepodařilo načíst. Obnovte stránku.',profilePending:'Čeká na kontrolu',profileApproved:'Schválený profil',profileHidden:'Profil není ve výběru',age:'Věk',location:'Město',seeking:'Hledám',languages:'Jazyky',occupation:'Povolání',traits:'Povaha',interests:'Zájmy',about:'O mně',like:'Tento člověk se mi líbí',selected:'Vybráno',mutual:'Vzájemná volba',completeFirst:'Nejdříve dokončete vlastní profil.',noProfiles:'Momentálně nejsou k dispozici žádné schválené profily.',premiumReason:'Proč DUONERA doporučuje',accountReady:'Váš osobní účet je připraven.'
  },
  en:{
    home:'Home',logout:'Sign out',loginLabel:'PRIVATE ACCESS',loginTitle:'Your personal DUONERA space.',loginText:'Enter your email. We will send a secure six-digit sign-in code — no password.',loginTrust1:'✓ See your own profile and photos',loginTrust2:'✓ A limited selection of verified people',loginTrust3:'✓ Contact details stay hidden',email:'Email',sendCode:'Send sign-in code',otpCode:'Six-digit code from the email',verifyCode:'Confirm code and sign in',loginNote:'The code is valid for a short time and works only for your account.',accountLabel:'MY ACCOUNT',accountTitle:'Welcome to DUONERA.',createProfile:'Create my profile',ownLabel:'MY PROFILE',ownTitle:'This is how DUONERA sees you.',notCompleted:'Not completed',emptyOwnTitle:'You have not completed your profile yet.',emptyOwnText:'Once completed, your details and saved photos will appear here.',premiumLabel:'DUONERA PREMIUM SERVICE',premiumTitle:'Your three best candidates.',premiumText:'DUONERA manually prepares the three strongest matches from your full profile. This is personal guidance, not another catalogue.',premiumEmpty:'Your premium three are not ready yet.',discoveryLabel:'LIMITED SELECTION',discoveryTitle:'Real people you can meet.',discoveryText:'No endless browsing. We show only a limited number of approved profiles without contact details.',mutualTitle:'You have a mutual choice.',mutualText:'DUONERA will contact you and help arrange a real meeting.',loading:'Loading profiles…',footer:'Privacy. Limited selection. A real meeting.',linkSent:'We sent the code. Open your email and enter the six digits.',loginError:'The code could not be sent. Please try again.',codeError:'The code is invalid or has expired. Request a new code.',loadError:'Your account could not be loaded. Refresh the page.',profilePending:'Awaiting review',profileApproved:'Approved profile',profileHidden:'Profile is not in discovery',age:'Age',location:'Location',seeking:'Looking for',languages:'Languages',occupation:'Occupation',traits:'Traits',interests:'Interests',about:'About me',like:'I would like to meet this person',selected:'Selected',mutual:'Mutual choice',completeFirst:'Complete your own profile first.',noProfiles:'No approved profiles are available at the moment.',premiumReason:'Why DUONERA recommends',accountReady:'Your personal account is ready.'
  },
  de:{
    home:'Startseite',logout:'Abmelden',loginLabel:'PRIVATER ZUGANG',loginTitle:'Ihr persönlicher DUONERA-Bereich.',loginText:'Geben Sie Ihre E-Mail ein. Wir senden Ihnen einen sicheren sechsstelligen Anmeldecode — ohne Passwort.',loginTrust1:'✓ Eigenes Profil und Fotos sehen',loginTrust2:'✓ Begrenzte Auswahl geprüfter Menschen',loginTrust3:'✓ Kontaktdaten bleiben verborgen',email:'E-Mail',sendCode:'Anmeldecode senden',otpCode:'Sechsstelliger Code aus der E-Mail',verifyCode:'Code bestätigen und anmelden',loginNote:'Der Code ist nur kurze Zeit gültig und funktioniert ausschließlich für Ihr Konto.',accountLabel:'MEIN KONTO',accountTitle:'Willkommen bei DUONERA.',createProfile:'Mein Profil erstellen',ownLabel:'MEIN PROFIL',ownTitle:'So sieht DUONERA Sie.',notCompleted:'Nicht ausgefüllt',emptyOwnTitle:'Sie haben noch kein vollständiges Profil.',emptyOwnText:'Nach dem Ausfüllen sehen Sie hier Ihre Angaben und alle gespeicherten Fotos.',premiumLabel:'DUONERA PREMIUM-SERVICE',premiumTitle:'Ihre drei besten Kandidaten.',premiumText:'DUONERA stellt anhand Ihres vollständigen Profils persönlich die drei stärksten Übereinstimmungen zusammen. Kein weiterer Katalog, sondern eine persönliche Empfehlung.',premiumEmpty:'Ihre Premium-Dreierauswahl ist noch nicht vorbereitet.',discoveryLabel:'BEGRENZTE AUSWAHL',discoveryTitle:'Echte Menschen, die Sie kennenlernen können.',discoveryText:'Kein endloses Wischen. Wir zeigen nur eine begrenzte Zahl geprüfter Profile ohne Kontaktdaten.',mutualTitle:'Sie haben sich gegenseitig ausgewählt.',mutualText:'DUONERA kontaktiert Sie und hilft, ein echtes Treffen zu organisieren.',loading:'Profile werden geladen…',footer:'Privatsphäre. Begrenzte Auswahl. Ein echtes Treffen.',linkSent:'Wir haben den Code gesendet. Öffnen Sie Ihre E-Mail und geben Sie die sechs Ziffern ein.',loginError:'Der Code konnte nicht gesendet werden. Versuchen Sie es erneut.',codeError:'Der Code ist ungültig oder abgelaufen. Fordern Sie einen neuen Code an.',loadError:'Ihr Konto konnte nicht geladen werden. Aktualisieren Sie die Seite.',profilePending:'Wartet auf Prüfung',profileApproved:'Geprüftes Profil',profileHidden:'Profil ist nicht in der Auswahl',age:'Alter',location:'Ort',seeking:'Ich suche',languages:'Sprachen',occupation:'Beruf',traits:'Eigenschaften',interests:'Interessen',about:'Über mich',like:'Diese Person gefällt mir',selected:'Ausgewählt',mutual:'Gegenseitige Wahl',completeFirst:'Vervollständigen Sie zuerst Ihr eigenes Profil.',noProfiles:'Zurzeit sind keine geprüften Profile verfügbar.',premiumReason:'Warum DUONERA empfiehlt',accountReady:'Ihr persönliches Konto ist bereit.'
  },
  uk:{
    home:'Головна',logout:'Вийти',loginLabel:'ПРИВАТНИЙ ДОСТУП',loginTitle:'Ваш особистий простір DUONERA.',loginText:'Введіть e-mail. Ми надішлемо безпечний шестизначний код для входу — без пароля.',loginTrust1:'✓ Власна анкета та фотографії',loginTrust2:'✓ Обмежена добірка перевірених людей',loginTrust3:'✓ Контактні дані приховані',email:'E-mail',sendCode:'Надіслати код для входу',otpCode:'Шестизначний код з e-mail',verifyCode:'Підтвердити код і увійти',loginNote:'Код діє недовго і призначений лише для вашого облікового запису.',accountLabel:'МІЙ КАБІНЕТ',accountTitle:'Ласкаво просимо до DUONERA.',createProfile:'Створити мою анкету',ownLabel:'МОЯ АНКЕТА',ownTitle:'Так вас бачить DUONERA.',notCompleted:'Не заповнена',emptyOwnTitle:'Ви ще не заповнили повну анкету.',emptyOwnText:'Після заповнення тут будуть ваші дані та всі збережені фотографії.',premiumLabel:'ПРЕМІАЛЬНА ПОСЛУГА DUONERA',premiumTitle:'Три найкращі кандидати для вас.',premiumText:'DUONERA особисто готує три найсильніші збіги на основі повної анкети. Це персональна рекомендація, а не ще один каталог.',premiumEmpty:'Преміальна трійка ще не підготовлена.',discoveryLabel:'ОБМЕЖЕНА ДОБІРКА',discoveryTitle:'Реальні люди, з якими можна познайомитися.',discoveryText:'Без нескінченного перегляду. Лише обмежена кількість схвалених анкет без контактних даних.',mutualTitle:'У вас взаємний вибір.',mutualText:'DUONERA зв’яжеться з вами та допоможе організувати справжню зустріч.',loading:'Завантажуємо анкети…',footer:'Приватність. Обмежений вибір. Справжня зустріч.',linkSent:'Ми надіслали код. Відкрийте e-mail і введіть шість цифр.',loginError:'Не вдалося надіслати код. Спробуйте ще раз.',codeError:'Код недійсний або вже минув. Надішліть собі новий код.',loadError:'Не вдалося завантажити кабінет. Оновіть сторінку.',profilePending:'Очікує перевірки',profileApproved:'Схвалена анкета',profileHidden:'Анкета не бере участі в добірці',age:'Вік',location:'Місто',seeking:'Шукаю',languages:'Мови',occupation:'Професія',traits:'Характер',interests:'Інтереси',about:'Про мене',like:'Ця людина мені подобається',selected:'Обрано',mutual:'Взаємний вибір',completeFirst:'Спочатку заповніть власну анкету.',noProfiles:'Наразі немає доступних схвалених анкет.',premiumReason:'Чому DUONERA рекомендує',accountReady:'Ваш особистий кабінет готовий.'
  },
  ru:{
    home:'Главная',logout:'Выйти',loginLabel:'ЗАКРЫТЫЙ ДОСТУП',loginTitle:'Ваше личное пространство DUONERA.',loginText:'Введите e-mail. Мы отправим безопасный шестизначный код для входа — без пароля.',loginTrust1:'✓ Собственная анкета и фотографии',loginTrust2:'✓ Ограниченная подборка проверенных людей',loginTrust3:'✓ Контактные данные скрыты',email:'E-mail',sendCode:'Отправить код для входа',otpCode:'Шестизначный код из письма',verifyCode:'Подтвердить код и войти',loginNote:'Код действует недолго и предназначен только для вашего аккаунта.',accountLabel:'МОЙ КАБИНЕТ',accountTitle:'Добро пожаловать в DUONERA.',createProfile:'Создать мою анкету',ownLabel:'МОЯ АНКЕТА',ownTitle:'Так вас видит DUONERA.',notCompleted:'Не заполнена',emptyOwnTitle:'Вы ещё не заполнили полную анкету.',emptyOwnText:'После заполнения здесь появятся ваши данные и все сохранённые фотографии.',premiumLabel:'ПРЕМИАЛЬНАЯ УСЛУГА DUONERA',premiumTitle:'Три лучших кандидата для вас.',premiumText:'DUONERA лично готовит три самых сильных совпадения по полной анкете. Это персональная рекомендация, а не ещё один каталог.',premiumEmpty:'Премиальная тройка пока не подготовлена.',discoveryLabel:'ОГРАНИЧЕННАЯ ПОДБОРКА',discoveryTitle:'Реальные люди, с которыми можно познакомиться.',discoveryText:'Без бесконечного просмотра. Только ограниченное количество одобренных анкет без контактных данных.',mutualTitle:'У вас взаимный выбор.',mutualText:'DUONERA свяжется с вами и поможет организовать настоящую встречу.',loading:'Загружаем анкеты…',footer:'Приватность. Ограниченный выбор. Настоящая встреча.',linkSent:'Мы отправили код. Откройте письмо и введите шесть цифр.',loginError:'Не удалось отправить код. Попробуйте ещё раз.',codeError:'Код недействителен или уже истёк. Отправьте себе новый код.',loadError:'Не удалось загрузить кабинет. Обновите страницу.',profilePending:'Ожидает проверки',profileApproved:'Одобренная анкета',profileHidden:'Анкета не участвует в подборке',age:'Возраст',location:'Город',seeking:'Ищу',languages:'Языки',occupation:'Профессия',traits:'Характер',interests:'Интересы',about:'Обо мне',like:'Этот человек мне нравится',selected:'Выбрано',mutual:'Взаимный выбор',completeFirst:'Сначала заполните собственную анкету.',noProfiles:'Сейчас нет доступных одобренных анкет.',premiumReason:'Почему DUONERA рекомендует',accountReady:'Ваш личный кабинет готов.'
  }
};

const magicLinkTranslations = {
  cs: {
    loginText: 'Zadejte e-mail. Pošleme vám bezpečný přihlašovací odkaz — bez hesla.',
    sendCode: 'Poslat přihlašovací odkaz',
    loginNote: 'Odkaz platí pouze krátkou dobu a lze ho použít jen pro váš účet.',
    linkSent: 'Odkaz jsme poslali. Otevřete e-mail a klikněte na „Sign in“.'
  },
  en: {
    loginText: 'Enter your email. We will send you a secure sign-in link — no password.',
    sendCode: 'Send sign-in link',
    loginNote: 'The link is valid for a short time and works only for your account.',
    linkSent: 'We sent the link. Open your email and click “Sign in”.'
  },
  de: {
    loginText: 'Geben Sie Ihre E-Mail ein. Wir senden Ihnen einen sicheren Anmeldelink — ohne Passwort.',
    sendCode: 'Anmeldelink senden',
    loginNote: 'Der Link ist nur kurze Zeit gültig und funktioniert ausschließlich für Ihr Konto.',
    linkSent: 'Wir haben den Link gesendet. Öffnen Sie Ihre E-Mail und klicken Sie auf „Sign in“.'
  },
  uk: {
    loginText: 'Введіть e-mail. Ми надішлемо безпечне посилання для входу — без пароля.',
    sendCode: 'Надіслати посилання для входу',
    loginNote: 'Посилання діє недовго і призначене лише для вашого облікового запису.',
    linkSent: 'Ми надіслали посилання. Відкрийте e-mail і натисніть «Sign in».'
  },
  ru: {
    loginText: 'Введите e-mail. Мы отправим безопасную ссылку для входа — без пароля.',
    sendCode: 'Отправить ссылку для входа',
    loginNote: 'Ссылка действует недолго и предназначена только для вашего аккаунта.',
    linkSent: 'Мы отправили ссылку. Откройте письмо и нажмите «Sign in».'
  }
};

Object.entries(magicLinkTranslations).forEach(([lang, values]) => {
  Object.assign(translations[lang], values);
});

const loginView = document.querySelector('#loginView');
const dashboardView = document.querySelector('#dashboardView');
const loginForm = document.querySelector('#loginForm');
const loginButton = document.querySelector('#loginButton');
const loginMessage = document.querySelector('#loginMessage');
const memberEmail = document.querySelector('#memberEmail');
const logoutButton = document.querySelector('#logoutButton');
const dashboardMessage = document.querySelector('#dashboardMessage');
const memberEmailLabel = document.querySelector('#memberEmailLabel');
const createProfileButton = document.querySelector('#createProfileButton');
const profileState = document.querySelector('#profileState');
const ownProfileCard = document.querySelector('#ownProfileCard');
const discoveryGrid = document.querySelector('#discoveryGrid');
const premiumGrid = document.querySelector('#premiumGrid');
const mutualNotice = document.querySelector('#mutualNotice');
let currentLang = localStorage.getItem('duonera-lang') || 'cs';
let currentProfile = null;
let selectedProfiles = new Map();
let loadedDiscovery = [];
let loadedPremium = [];
let activeAuth = null;

function t(key) {
  return translations[currentLang]?.[key] || translations.cs[key] || key;
}

function applyLanguage(lang) {
  currentLang = translations[lang] ? lang : 'cs';
  document.documentElement.lang = currentLang === 'uk' ? 'uk' : currentLang;
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const value = t(element.dataset.i18n);
    if (value) element.textContent = value;
  });
  document.querySelectorAll('[data-lang]').forEach(button => {
    button.classList.toggle('active', button.dataset.lang === currentLang);
  });
  localStorage.setItem('duonera-lang', currentLang);
  if (!dashboardView.hidden) renderAll();
}

function encodedPath(path) {
  return String(path).split('/').map(encodeURIComponent).join('/');
}

function publicPhotoUrl(path) {
  return `${SUPABASE_URL}/storage/v1/object/public/${encodeURIComponent(DISCOVERY_BUCKET)}/${encodedPath(path)}`;
}

async function signedOwnPhotoUrl(path, accessToken) {
  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/sign/${encodeURIComponent(PROFILE_PHOTO_BUCKET)}/${encodedPath(path)}`,
    {
      method: 'POST',
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ expiresIn: 3600 })
    }
  );
  if (!response.ok) return '';
  const data = await response.json();
  if (!data.signedURL) return '';
  return /^https?:\/\//i.test(data.signedURL)
    ? data.signedURL
    : `${SUPABASE_URL}/storage/v1${data.signedURL}`;
}

function valueText(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(', ');
  return value || '—';
}

function ownDetail(label, value) {
  const item = document.createElement('div');
  const title = document.createElement('span');
  const text = document.createElement('p');
  title.textContent = label;
  text.textContent = valueText(value);
  item.append(title, text);
  return item;
}

async function renderOwnProfile(auth) {
  if (!currentProfile) {
    profileState.textContent = t('notCompleted');
    createProfileButton.hidden = false;
    ownProfileCard.innerHTML = `<div class="empty-member-state"><h3>${t('emptyOwnTitle')}</h3><p>${t('emptyOwnText')}</p></div>`;
    return;
  }

  createProfileButton.hidden = true;
  profileState.textContent = currentProfile.is_approved
    ? (currentProfile.is_discoverable ? t('profileApproved') : t('profileHidden'))
    : t('profilePending');
  ownProfileCard.replaceChildren();
  const layout = document.createElement('div');
  layout.className = 'own-profile-layout';
  const gallery = document.createElement('div');
  gallery.className = 'own-photo-grid';
  const paths = Array.isArray(currentProfile.photo_paths) ? currentProfile.photo_paths : [];
  const urls = (await Promise.all(paths.map(path => signedOwnPhotoUrl(path, auth.session.access_token)))).filter(Boolean);
  if (urls.length) {
    urls.forEach((url, index) => {
      const image = document.createElement('img');
      image.src = url;
      image.alt = `${currentProfile.first_name || 'DUONERA'} — ${index + 1}`;
      gallery.appendChild(image);
    });
  } else {
    gallery.innerHTML = `<div class="empty-member-state"><p>${t('emptyOwnText')}</p></div>`;
  }

  const info = document.createElement('div');
  info.className = 'own-profile-info';
  const heading = document.createElement('h3');
  heading.textContent = `${currentProfile.first_name || 'DUONERA'}, ${calculateAge(currentProfile.birth_date)}`;
  const location = document.createElement('p');
  location.className = 'location';
  location.textContent = [currentProfile.city, currentProfile.country].filter(Boolean).join(', ');
  const details = document.createElement('div');
  details.className = 'own-details';
  [
    [t('seeking'), currentProfile.looking_for],
    [t('languages'), currentProfile.languages],
    [t('occupation'), currentProfile.occupation],
    [t('traits'), currentProfile.traits],
    [t('interests'), currentProfile.interests],
    [t('about'), currentProfile.about_me]
  ].forEach(([label, value]) => details.appendChild(ownDetail(label, value)));
  info.append(heading, location, details);
  layout.append(gallery, info);
  ownProfileCard.appendChild(layout);
}

function calculateAge(birthDate) {
  if (!birthDate) return '—';
  const birth = new Date(`${birthDate}T00:00:00`);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const month = now.getMonth() - birth.getMonth();
  if (month < 0 || (month === 0 && now.getDate() < birth.getDate())) age -= 1;
  return age;
}

function profileCard(profile, premium = false) {
  const card = document.createElement('article');
  card.className = 'member-profile-card';
  const photo = document.createElement('div');
  photo.className = 'member-profile-photo';
  const photoPath = Array.isArray(profile.public_photo_paths) ? profile.public_photo_paths[0] : '';
  if (photoPath) photo.style.backgroundImage = `url("${publicPhotoUrl(photoPath)}")`;
  const body = document.createElement('div');
  body.className = 'member-profile-body';
  const title = document.createElement('h3');
  title.textContent = `${profile.first_name || 'DUONERA'}, ${profile.age || '—'}`;
  const location = document.createElement('p');
  location.className = 'location';
  location.textContent = [profile.city, profile.country].filter(Boolean).join(', ');
  const about = document.createElement('p');
  about.className = 'profile-about';
  about.textContent = profile.about_me || profile.relationship_goal || '—';
  const tags = document.createElement('div');
  tags.className = 'profile-tags';
  [...(profile.traits || []), ...(profile.interests || [])].slice(0, 4).forEach(tag => {
    const item = document.createElement('span');
    item.textContent = tag;
    tags.appendChild(item);
  });
  body.append(title, location);
  if (premium && profile.selection_note) {
    const reason = document.createElement('p');
    reason.className = 'profile-about';
    reason.textContent = `${t('premiumReason')}: ${profile.selection_note}`;
    body.appendChild(reason);
  } else {
    body.appendChild(about);
  }
  body.appendChild(tags);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn btn-gold';
  const choice = selectedProfiles.get(profile.id || profile.profile_id);
  if (choice?.is_mutual) {
    button.textContent = t('mutual');
    button.classList.add('mutual');
  } else if (choice) {
    button.textContent = t('selected');
    button.classList.add('selected');
  } else {
    button.textContent = t('like');
  }
  button.disabled = !currentProfile;
  if (!currentProfile) button.title = t('completeFirst');
  button.addEventListener('click', () => toggleChoice(profile.id || profile.profile_id, button));
  body.appendChild(button);
  card.append(photo, body);
  return card;
}

async function toggleChoice(profileId, button) {
  if (!currentProfile) return;
  button.disabled = true;
  try {
    if (selectedProfiles.has(profileId)) {
      await callMemberRpc('duonera_remove_choice', { target_profile_id: profileId });
      selectedProfiles.delete(profileId);
      button.textContent = t('like');
      button.classList.remove('selected', 'mutual');
    } else {
      const result = await callMemberRpc('duonera_choose_profile', { target_profile_id: profileId });
      const choice = { is_mutual: Boolean(result?.mutual) };
      selectedProfiles.set(profileId, choice);
      button.textContent = choice.is_mutual ? t('mutual') : t('selected');
      button.classList.add(choice.is_mutual ? 'mutual' : 'selected');
      if (choice.is_mutual) mutualNotice.hidden = false;
    }
  } catch (error) {
    dashboardMessage.className = 'member-message dashboard-message error';
    dashboardMessage.textContent = error.message;
  } finally {
    button.disabled = false;
  }
}

async function fetchDiscoveryProfiles() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/duonera_discovery_profiles`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: '{}'
  });
  if (!response.ok) throw new Error(t('loadError'));
  return response.json();
}

function renderDiscovery(profiles) {
  discoveryGrid.replaceChildren();
  const visible = profiles.filter(profile => profile.id !== currentProfile?.id);
  if (!visible.length) {
    discoveryGrid.innerHTML = `<div class="empty-member-state"><p>${t('noProfiles')}</p></div>`;
    return;
  }
  visible.forEach(profile => discoveryGrid.appendChild(profileCard(profile)));
}

function renderPremium(profiles) {
  premiumGrid.replaceChildren();
  if (!profiles.length) {
    premiumGrid.innerHTML = `<div class="empty-member-state"><p>${t('premiumEmpty')}</p></div>`;
    return;
  }
  profiles.forEach(profile => premiumGrid.appendChild(profileCard(profile, true)));
}

async function loadDashboard(auth) {
  dashboardMessage.textContent = t('loading');
  dashboardMessage.className = 'member-message dashboard-message';
  memberEmailLabel.textContent = auth.user.email || '';
  try {
    await callMemberRpc('duonera_claim_registration');
    const [ownRows, discovery, choices, premium] = await Promise.all([
      memberRest(`duonera_profiles?select=*&user_id=eq.${encodeURIComponent(auth.user.id)}&limit=1`),
      fetchDiscoveryProfiles(),
      callMemberRpc('duonera_my_choices'),
      callMemberRpc('duonera_my_premium_selection')
    ]);
    currentProfile = ownRows?.[0] || null;
    loadedDiscovery = discovery || [];
    loadedPremium = premium || [];
    selectedProfiles = new Map((choices || []).map(choice => [choice.chosen_profile_id, choice]));
    mutualNotice.hidden = !(choices || []).some(choice => choice.is_mutual);
    await renderOwnProfile(auth);
    renderDiscovery(loadedDiscovery);
    renderPremium(loadedPremium);
    dashboardMessage.textContent = t('accountReady');
  } catch (error) {
    dashboardMessage.className = 'member-message dashboard-message error';
    dashboardMessage.textContent = error.message || t('loadError');
  }
}

function renderAll() {
  if (!activeAuth) return;
  renderOwnProfile(activeAuth);
  renderDiscovery(loadedDiscovery);
  renderPremium(loadedPremium);
  mutualNotice.hidden = ![...selectedProfiles.values()].some(choice => choice.is_mutual);
}

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  loginButton.disabled = true;
  loginMessage.className = 'member-message';
  loginMessage.textContent = '';
  try {
    const email = memberEmail.value.trim().toLowerCase();
    await requestEmailOtp(email, `${location.origin}/ucet.html`);
    loginMessage.textContent = t('linkSent');
  } catch {
    loginMessage.className = 'member-message error';
    loginMessage.textContent = t('loginError');
  } finally {
    loginButton.disabled = false;
  }
});

logoutButton.addEventListener('click', async () => {
  await signOutMember();
  activeAuth = null;
  currentProfile = null;
  loadedDiscovery = [];
  loadedPremium = [];
  selectedProfiles.clear();
  dashboardView.hidden = true;
  logoutButton.hidden = true;
  loginView.hidden = false;
});

document.querySelectorAll('[data-lang]').forEach(button => {
  button.addEventListener('click', () => applyLanguage(button.dataset.lang));
});

document.querySelector('#year').textContent = new Date().getFullYear();
applyLanguage(currentLang);

let savedRegistration = {};
try {
  savedRegistration = JSON.parse(localStorage.getItem('duonera-short-registration') || '{}');
} catch {
  savedRegistration = {};
}
if (savedRegistration.email) memberEmail.value = savedRegistration.email;

const auth = await requireMemberSession();
if (auth) {
  activeAuth = auth;
  loginView.hidden = true;
  dashboardView.hidden = false;
  logoutButton.hidden = false;
  await loadDashboard(auth);
} else {
  loginView.hidden = false;
  dashboardView.hidden = true;
}
