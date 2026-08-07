import {
  createUuid,
  insertRow,
  PROFILE_PHOTO_BUCKET,
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
} from './supabase-client.js?v=5';
import {
  callMemberRpc,
  clearMemberSession,
  memberRest,
  registerMember,
  requestPasswordReset,
  requireMemberSession,
  signInMember,
  signOutMember,
  takeAuthRedirectError,
  updateMemberPassword
} from './member-auth.js?v=17';

const DISCOVERY_BUCKET = 'duonera-discovery-photos';
const translations = {
  cs:{
    home:'Hlavní stránka',logout:'Odhlásit',loginLabel:'SOUKROMÝ PŘÍSTUP',loginTitle:'Váš osobní prostor DUONERA.',loginText:'Zadejte e-mail. Pošleme vám bezpečný šestimístný přihlašovací kód — bez hesla.',loginTrust1:'✓ Uvidíte vlastní profil a fotografie',loginTrust2:'✓ Omezený výběr ověřených lidí',loginTrust3:'✓ Kontakty zůstávají skryté',email:'E-mail',sendCode:'Poslat přihlašovací kód',otpCode:'Šestimístný kód z e-mailu',verifyCode:'Potvrdit kód a vstoupit',loginNote:'Kód platí pouze krátkou dobu a lze ho použít jen pro váš účet.',accountLabel:'MŮJ ÚČET',accountTitle:'Vítejte v DUONERA.',createProfile:'Vytvořit můj profil',ownLabel:'MOJE ANKETA',ownTitle:'Takto vás DUONERA vidí.',notCompleted:'Není vyplněna',emptyOwnTitle:'Ještě nemáte úplnou anketu.',emptyOwnText:'Po vyplnění zde uvidíte vlastní údaje a všechny uložené fotografie.',premiumLabel:'PRÉMIOVÁ SLUŽBA DUONERA',premiumTitle:'Tři nejlepší kandidáti pro vás.',premiumText:'DUONERA ručně připraví tři nejsilnější shody podle celé ankety. Nejde o další katalog, ale o osobní doporučení.',premiumEmpty:'Prémiová trojice zatím není připravena.',discoveryLabel:'OMEZENÝ VÝBĚR',discoveryTitle:'Skuteční lidé, které můžete poznat.',discoveryText:'Žádné nekonečné listování. Ukazujeme pouze omezený počet schválených profilů bez kontaktních údajů.',mutualTitle:'Máte vzájemnou sympatii.',mutualText:'DUONERA vás bude kontaktovat a pomůže domluvit skutečné setkání.',loading:'Načítání profilů…',footer:'Soukromí. Omezený výběr. Skutečné setkání.',linkSent:'Kód jsme poslali. Otevřete e-mail a zadejte šest číslic.',loginError:'Kód se nepodařilo odeslat. Zkuste to znovu.',codeError:'Kód není platný nebo již vypršel. Pošlete si nový kód.',loadError:'Účet se nepodařilo načíst. Obnovte stránku.',profilePending:'Čeká na kontrolu',profileApproved:'Schválený profil',profileHidden:'Profil není ve výběru',age:'Věk',location:'Město',seeking:'Hledám',languages:'Jazyky',occupation:'Povolání',traits:'Povaha',interests:'Zájmy',about:'O mně',like:'Tento člověk se mi líbí',selected:'Vybráno',mutual:'Vzájemná volba',completeFirst:'Nejdříve dokončete vlastní profil.',noProfiles:'Momentálně nejsou k dispozici žádné schválené profily.',premiumReason:'Proč DUONERA doporučuje',accountReady:'Děkujeme. DUONERA vás osobně kontaktuje a pomůže vám vytvořit ověřený profil.'
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

Object.assign(translations.cs,{profileActive:'Profil je aktivní',profilePending:'Profil je aktivní',profileApproved:'Profil je aktivní',profileHidden:'Profil je aktivní',accountReady:'Profil je aktivní. Systém pro vás průběžně hledá vhodné lidi.',installApp:'Nainstalovat',installIos:'V Safari zvolte Sdílet a Přidat na plochu.',discoveryText:'Žádné nekonečné listování. Systém ukazuje jen malý soukromý výběr vhodných lidí.'});
Object.assign(translations.en,{profileActive:'Profile active',profilePending:'Profile active',profileApproved:'Profile active',profileHidden:'Profile active',accountReady:'Your profile is active. The system is looking for suitable people nearby.',installApp:'Install app',installIos:'In Safari, choose Share and Add to Home Screen.',discoveryText:'No endless browsing. The system shows only a small private selection of suitable people.'});
Object.assign(translations.de,{profileActive:'Profil aktiv',profilePending:'Profil aktiv',profileApproved:'Profil aktiv',profileHidden:'Profil aktiv',accountReady:'Ihr Profil ist aktiv. Das System sucht laufend nach passenden Menschen in Ihrer Nähe.',installApp:'App installieren',installIos:'Wählen Sie in Safari Teilen und Zum Home-Bildschirm.',discoveryText:'Kein endloses Wischen. Das System zeigt nur eine kleine private Auswahl passender Menschen.'});
Object.assign(translations.uk,{profileActive:'Анкета активна',profilePending:'Анкета активна',profileApproved:'Анкета активна',profileHidden:'Анкета активна',accountReady:'Ваша анкета активна. Система шукає відповідних людей поруч.',installApp:'Встановити',installIos:'У Safari виберіть «Поділитися» та «На початковий екран».',discoveryText:'Без нескінченного перегляду. Система показує лише невелику приватну добірку відповідних людей.'});
Object.assign(translations.ru,{profileActive:'Анкета активна',profilePending:'Анкета активна',profileApproved:'Анкета активна',profileHidden:'Анкета активна',accountReady:'Ваша анкета активна. Система ищет подходящих людей поблизости.',installApp:'Установить',installIos:'В Safari нажмите «Поделиться» и «На экран Домой».',discoveryText:'Без бесконечного просмотра. Система показывает только небольшую закрытую подборку подходящих людей.'});

translations.it={...translations.en,home:'Pagina principale',logout:'Esci',loginLabel:'ACCESSO PRIVATO',loginTitle:'Il tuo spazio personale DUONERA.',loginText:'Accedi con e-mail e password.',loginTrust1:'✓ Il tuo profilo e le tue foto',loginTrust2:'✓ Una selezione privata di persone vicine',loginTrust3:'✓ I contatti restano nascosti',signInTab:'Accedi',registerTab:'Registrati',password:'Password',repeatPassword:'Ripeti la password',signIn:'Accedi',forgotPassword:'Password dimenticata?',createAccount:'Crea account',accountLabel:'IL MIO ACCOUNT',accountTitle:'Benvenuto in DUONERA.',createProfile:'Crea il mio profilo',ownLabel:'IL MIO PROFILO',ownTitle:'Così ti vede DUONERA.',notCompleted:'Non completato',profileActive:'Profilo attivo',premiumLabel:'SERVIZIO PREMIUM DUONERA',premiumTitle:'Le tre persone migliori per te.',premiumText:'Una selezione personale e limitata, non un altro catalogo.',premiumEmpty:'La tua selezione non è ancora pronta.',discoveryLabel:'SELEZIONE LIMITATA',discoveryTitle:'Persone reali che puoi conoscere.',discoveryText:'Niente scorrimento infinito. Solo una piccola selezione privata di persone adatte.',mutualTitle:'Avete una scelta reciproca.',mutualText:'DUONERA vi aiuterà a organizzare un incontro reale.',loading:'Caricamento…',footer:'Privacy. Selezione limitata. Un incontro reale.',age:'Età',location:'Città',seeking:'Cerco',languages:'Lingue',occupation:'Professione',traits:'Carattere',interests:'Interessi',about:'Su di me',like:'Vorrei conoscere questa persona',selected:'Selezionato',mutual:'Scelta reciproca',noProfiles:'Al momento non ci sono profili adatti.',accountReady:'Il tuo profilo è attivo. Il sistema cerca persone adatte nelle vicinanze.',installApp:'Installa app',installIos:'In Safari scegli Condividi e Aggiungi alla schermata Home.'};
translations.pl={...translations.en,home:'Strona główna',logout:'Wyloguj',loginLabel:'PRYWATNY DOSTĘP',loginTitle:'Twoja osobista przestrzeń DUONERA.',loginText:'Zaloguj się e-mailem i hasłem.',loginTrust1:'✓ Twój profil i zdjęcia',loginTrust2:'✓ Prywatny wybór osób w pobliżu',loginTrust3:'✓ Dane kontaktowe są ukryte',signInTab:'Logowanie',registerTab:'Rejestracja',password:'Hasło',repeatPassword:'Powtórz hasło',signIn:'Zaloguj się',forgotPassword:'Nie pamiętasz hasła?',createAccount:'Utwórz konto',accountLabel:'MOJE KONTO',accountTitle:'Witamy w DUONERA.',createProfile:'Utwórz mój profil',ownLabel:'MÓJ PROFIL',ownTitle:'Tak widzi Cię DUONERA.',notCompleted:'Nieukończony',profileActive:'Profil aktywny',premiumLabel:'USŁUGA PREMIUM DUONERA',premiumTitle:'Trzy najlepsze osoby dla Ciebie.',premiumText:'Osobisty, ograniczony wybór — nie kolejny katalog.',premiumEmpty:'Twój wybór nie jest jeszcze gotowy.',discoveryLabel:'OGRANICZONY WYBÓR',discoveryTitle:'Prawdziwe osoby, które możesz poznać.',discoveryText:'Bez nieskończonego przewijania. Tylko mały prywatny wybór odpowiednich osób.',mutualTitle:'Macie wzajemny wybór.',mutualText:'DUONERA pomoże zorganizować prawdziwe spotkanie.',loading:'Ładowanie…',footer:'Prywatność. Ograniczony wybór. Prawdziwe spotkanie.',age:'Wiek',location:'Miasto',seeking:'Szukam',languages:'Języki',occupation:'Zawód',traits:'Charakter',interests:'Zainteresowania',about:'O mnie',like:'Chcę poznać tę osobę',selected:'Wybrano',mutual:'Wzajemny wybór',noProfiles:'Obecnie nie ma odpowiednich profili.',accountReady:'Twój profil jest aktywny. System szuka odpowiednich osób w pobliżu.',installApp:'Zainstaluj',installIos:'W Safari wybierz Udostępnij i Dodaj do ekranu początkowego.'};
translations.sk={...translations.cs,home:'Hlavná stránka',logout:'Odhlásiť',loginLabel:'SÚKROMNÝ PRÍSTUP',loginTitle:'Váš osobný priestor DUONERA.',loginText:'Prihláste sa e-mailom a heslom.',loginTrust1:'✓ Váš profil a fotografie',loginTrust2:'✓ Súkromný výber ľudí nablízku',loginTrust3:'✓ Kontakty zostávajú skryté',signInTab:'Prihlásenie',registerTab:'Registrácia',password:'Heslo',repeatPassword:'Zopakujte heslo',signIn:'Prihlásiť sa',forgotPassword:'Zabudli ste heslo?',createAccount:'Vytvoriť účet',accountLabel:'MÔJ ÚČET',accountTitle:'Vitajte v DUONERA.',createProfile:'Vytvoriť môj profil',ownLabel:'MÔJ PROFIL',ownTitle:'Takto vás vidí DUONERA.',notCompleted:'Nie je vyplnený',profileActive:'Profil je aktívny',premiumLabel:'PRÉMIOVÁ SLUŽBA DUONERA',premiumTitle:'Traja najlepší ľudia pre vás.',premiumText:'Osobný obmedzený výber, nie ďalší katalóg.',premiumEmpty:'Váš výber ešte nie je pripravený.',discoveryLabel:'OBMEDZENÝ VÝBER',discoveryTitle:'Skutoční ľudia, ktorých môžete spoznať.',discoveryText:'Žiadne nekonečné listovanie. Iba malý súkromný výber vhodných ľudí.',mutualTitle:'Máte vzájomnú voľbu.',mutualText:'DUONERA vám pomôže zorganizovať skutočné stretnutie.',loading:'Načítavam…',footer:'Súkromie. Obmedzený výber. Skutočné stretnutie.',age:'Vek',location:'Mesto',seeking:'Hľadám',languages:'Jazyky',occupation:'Povolanie',traits:'Povaha',interests:'Záujmy',about:'O mne',like:'Chcem spoznať túto osobu',selected:'Vybrané',mutual:'Vzájomná voľba',noProfiles:'Momentálne nie sú vhodné profily.',accountReady:'Váš profil je aktívny. Systém hľadá vhodných ľudí nablízku.',installApp:'Nainštalovať',installIos:'V Safari vyberte Zdieľať a Pridať na plochu.'};

Object.assign(translations.cs, {
  loginText:'Zadejte e-mail. Pošleme vám bezpečný přihlašovací odkaz — bez hesla.',
  sendCode:'Poslat přihlašovací odkaz',
  loginNote:'Odkaz platí pouze krátkou dobu a lze ho použít jen pro váš účet.',
  linkSent:'Odkaz jsme poslali. Otevřete e-mail a klikněte na přihlášení.',
  loginError:'Přihlašovací odkaz se nepodařilo odeslat. Zkuste to znovu.',
  loginRateLimit:'Odkaz byl nedávno odeslán. Počkejte 60 sekund a zkontrolujte Doručenou poštu i Spam.',
  loginServiceError:'E-mailová služba je dočasně nedostupná. Zkuste to za několik minut.'
});
Object.assign(translations.en, {
  loginText:'Enter your email. We will send you a secure sign-in link — no password.',
  sendCode:'Send sign-in link',
  loginNote:'The link is valid for a short time and works only for your account.',
  linkSent:'We sent the link. Open your email and click Sign in.',
  loginError:'The sign-in link could not be sent. Please try again.',
  loginRateLimit:'A link was sent recently. Wait 60 seconds and check your inbox and spam folder.',
  loginServiceError:'The email service is temporarily unavailable. Please try again in a few minutes.'
});
Object.assign(translations.de, {
  loginText:'Geben Sie Ihre E-Mail ein. Wir senden Ihnen einen sicheren Anmeldelink — ohne Passwort.',
  sendCode:'Anmeldelink senden',
  loginNote:'Der Link ist nur kurze Zeit gültig und funktioniert ausschließlich für Ihr Konto.',
  linkSent:'Wir haben den Link gesendet. Öffnen Sie Ihre E-Mail und klicken Sie auf Anmelden.',
  loginError:'Der Anmeldelink konnte nicht gesendet werden. Versuchen Sie es erneut.',
  loginRateLimit:'Ein Link wurde kürzlich gesendet. Warten Sie 60 Sekunden und prüfen Sie Posteingang und Spam.',
  loginServiceError:'Der E-Mail-Dienst ist vorübergehend nicht verfügbar. Versuchen Sie es in einigen Minuten erneut.'
});
Object.assign(translations.uk, {
  loginText:'Введіть e-mail. Ми надішлемо безпечне посилання для входу — без пароля.',
  sendCode:'Надіслати посилання для входу',
  loginNote:'Посилання діє недовго і призначене лише для вашого облікового запису.',
  linkSent:'Ми надіслали посилання. Відкрийте e-mail і натисніть «Увійти».',
  loginError:'Не вдалося надіслати посилання. Спробуйте ще раз.',
  loginRateLimit:'Посилання нещодавно надіслано. Зачекайте 60 секунд і перевірте Вхідні та Спам.',
  loginServiceError:'Поштова служба тимчасово недоступна. Спробуйте ще раз за кілька хвилин.'
});
Object.assign(translations.ru, {
  loginText:'Введите e-mail. Мы отправим безопасную ссылку для входа — без пароля.',
  sendCode:'Отправить ссылку для входа',
  loginNote:'Ссылка действует недолго и предназначена только для вашего аккаунта.',
  linkSent:'Мы отправили ссылку. Откройте письмо и нажмите «Войти».',
  loginError:'Не удалось отправить ссылку. Попробуйте ещё раз.',
  loginRateLimit:'Ссылка уже недавно отправлена. Подождите 60 секунд и проверьте папки «Входящие» и «Спам».',
  loginServiceError:'Почтовая служба временно недоступна. Попробуйте ещё раз через несколько минут.'
});


Object.assign(translations.cs, {
  loginText:'Přihlaste se e-mailem a heslem. Nový účet potvrdíte e-mailem pouze jednou.',
  signInTab:'Přihlášení', registerTab:'Registrace', password:'Heslo',
  repeatPassword:'Zopakujte heslo', signIn:'Přihlásit se',
  forgotPassword:'Zapomněli jste heslo?', createAccount:'Vytvořit účet',
  registerNote:'Pošleme vám e-mail. Kliknutím jednou potvrdíte svou adresu.',
  passwordNote:'Při registraci potvrdíte e-mail pouze jednou. Potom se přihlašujete e-mailem a heslem.',
  confirmationSent:'Děkujeme. Otevřete potvrzovací e-mail od DUONERA a klikněte na odkaz. Poté vás osobně kontaktujeme a pomůžeme vám vytvořit ověřený profil.',
  resetSent:'Poslali jsme vám e-mail pro nastavení nového hesla.',
  newPasswordTitle:'Nastavit nové heslo', newPassword:'Nové heslo',
  savePassword:'Uložit heslo a vstoupit', passwordSaved:'Heslo je uloženo.',
  passwordMismatch:'Hesla se neshodují.', passwordShort:'Heslo musí mít alespoň 8 znaků.',
  wrongLogin:'E-mail nebo heslo není správné.', emailNotConfirmed:'Nejdříve potvrďte e-mail.',
  alreadyRegistered:'Tento e-mail už má účet. Přihlaste se nebo použijte „Zapomněli jste heslo?“.',
  authServiceError:'Přihlášení se nepodařilo. Zkuste to prosím znovu.'
});
Object.assign(translations.en, {
  loginText:'Sign in with email and password. A new account is confirmed by email only once.',
  signInTab:'Sign in', registerTab:'Register', password:'Password',
  repeatPassword:'Repeat password', signIn:'Sign in', forgotPassword:'Forgot password?',
  createAccount:'Create account', registerNote:'We will email you. Click once to confirm your address.',
  passwordNote:'Confirm your email once when registering. Then sign in with email and password.',
  confirmationSent:'Thank you. Open the DUONERA confirmation email and click the link. We will then contact you personally and help create your verified profile.',
  resetSent:'We sent an email to set a new password.', newPasswordTitle:'Set a new password',
  newPassword:'New password', savePassword:'Save password and enter', passwordSaved:'Password saved.',
  passwordMismatch:'Passwords do not match.', passwordShort:'Password must contain at least 8 characters.',
  wrongLogin:'The email or password is incorrect.', emailNotConfirmed:'Confirm your email first.',
  alreadyRegistered:'This email already has an account. Sign in or use “Forgot password?”.',
  authServiceError:'Sign-in failed. Please try again.'
});
Object.assign(translations.de, {
  loginText:'Melden Sie sich mit E-Mail und Passwort an. Ein neues Konto bestätigen Sie nur einmal per E-Mail.',
  signInTab:'Anmelden', registerTab:'Registrieren', password:'Passwort',
  repeatPassword:'Passwort wiederholen', signIn:'Anmelden', forgotPassword:'Passwort vergessen?',
  createAccount:'Konto erstellen', registerNote:'Wir senden eine E-Mail. Bestätigen Sie Ihre Adresse mit einem Klick.',
  passwordNote:'Bei der Registrierung bestätigen Sie Ihre E-Mail einmal. Danach melden Sie sich mit E-Mail und Passwort an.',
  confirmationSent:'Vielen Dank. Öffnen Sie die DUONERA-Bestätigungs-E-Mail und klicken Sie auf den Link. Danach kontaktieren wir Sie persönlich und helfen bei Ihrem verifizierten Profil.',
  resetSent:'Wir haben eine E-Mail zum Festlegen eines neuen Passworts gesendet.',
  newPasswordTitle:'Neues Passwort festlegen', newPassword:'Neues Passwort',
  savePassword:'Passwort speichern und öffnen', passwordSaved:'Passwort gespeichert.',
  passwordMismatch:'Die Passwörter stimmen nicht überein.', passwordShort:'Das Passwort muss mindestens 8 Zeichen haben.',
  wrongLogin:'E-Mail oder Passwort ist falsch.', emailNotConfirmed:'Bestätigen Sie zuerst Ihre E-Mail.',
  alreadyRegistered:'Für diese E-Mail besteht bereits ein Konto. Melden Sie sich an oder nutzen Sie „Passwort vergessen?“.',
  authServiceError:'Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.'
});
Object.assign(translations.uk, {
  loginText:'Увійдіть за допомогою e-mail і пароля. Новий обліковий запис підтверджується e-mail лише один раз.',
  signInTab:'Вхід', registerTab:'Реєстрація', password:'Пароль',
  repeatPassword:'Повторіть пароль', signIn:'Увійти', forgotPassword:'Забули пароль?',
  createAccount:'Створити обліковий запис', registerNote:'Ми надішлемо лист. Натисніть один раз, щоб підтвердити адресу.',
  passwordNote:'Під час реєстрації підтвердьте e-mail один раз. Потім входьте за e-mail і паролем.',
  confirmationSent:'Дякуємо. Відкрийте лист-підтвердження DUONERA та натисніть посилання. Потім ми особисто зв’яжемося з вами і допоможемо створити перевірену анкету.',
  resetSent:'Ми надіслали лист для встановлення нового пароля.',
  newPasswordTitle:'Встановити новий пароль', newPassword:'Новий пароль',
  savePassword:'Зберегти пароль і увійти', passwordSaved:'Пароль збережено.',
  passwordMismatch:'Паролі не збігаються.', passwordShort:'Пароль має містити щонайменше 8 символів.',
  wrongLogin:'Неправильний e-mail або пароль.', emailNotConfirmed:'Спочатку підтвердьте e-mail.',
  alreadyRegistered:'Цей e-mail уже має обліковий запис. Увійдіть або скористайтеся «Забули пароль?».',
  authServiceError:'Не вдалося увійти. Спробуйте ще раз.'
});
Object.assign(translations.ru, {
  loginText:'Войдите по e-mail и паролю. Новый аккаунт подтверждается через e-mail только один раз.',
  signInTab:'Вход', registerTab:'Регистрация', password:'Пароль',
  repeatPassword:'Повторите пароль', signIn:'Войти', forgotPassword:'Забыли пароль?',
  createAccount:'Создать аккаунт', registerNote:'Мы отправим письмо. Нажмите один раз, чтобы подтвердить адрес.',
  passwordNote:'При регистрации подтвердите e-mail один раз. Затем входите по e-mail и паролю.',
  confirmationSent:'Спасибо. Откройте письмо DUONERA и нажмите ссылку подтверждения. Затем мы лично свяжемся с вами и поможем создать проверенную анкету.',
  resetSent:'Мы отправили письмо для установки нового пароля.',
  newPasswordTitle:'Установить новый пароль', newPassword:'Новый пароль',
  savePassword:'Сохранить пароль и войти', passwordSaved:'Пароль сохранён.',
  passwordMismatch:'Пароли не совпадают.', passwordShort:'Пароль должен содержать не менее 8 символов.',
  wrongLogin:'Неверный e-mail или пароль.', emailNotConfirmed:'Сначала подтвердите e-mail.',
  alreadyRegistered:'Для этого e-mail уже есть аккаунт. Войдите или нажмите «Забыли пароль?».',
  authServiceError:'Не удалось войти. Попробуйте ещё раз.'
});
['it','pl','sk'].forEach(language=>{translations[language]={...translations.en,...translations[language]};});

const quickRegistrationCopy = {
  cs:{firstName:'Jméno',iam:'Jsem',woman:'Žena',man:'Muž',seekWoman:'Ženu',seekMan:'Muže',city:'Město',privacyConsent:'Souhlasím se zpracováním údajů pro registraci a soukromý výběr.',restoreProfile:'Znovu načíst profil',profilePreparing:'Připravuji váš soukromý profil…',profileReady:'Registrace je hotová. Váš soukromý profil je aktivní.',photoLater:'Fotografii můžete přidat později.'},
  en:{firstName:'First name',iam:'I am',woman:'Woman',man:'Man',seekWoman:'Woman',seekMan:'Man',city:'City',privacyConsent:'I agree to data processing for registration and private selection.',restoreProfile:'Reload profile',profilePreparing:'Preparing your private profile…',profileReady:'Registration is complete. Your private profile is active.',photoLater:'You can add a photo later.'},
  de:{firstName:'Vorname',iam:'Ich bin',woman:'Frau',man:'Mann',seekWoman:'Frau',seekMan:'Mann',city:'Stadt',privacyConsent:'Ich stimme der Datenverarbeitung für Registrierung und private Auswahl zu.',restoreProfile:'Profil neu laden',profilePreparing:'Ihr privates Profil wird vorbereitet…',profileReady:'Die Registrierung ist abgeschlossen. Ihr privates Profil ist aktiv.',photoLater:'Ein Foto können Sie später hinzufügen.'},
  it:{firstName:'Nome',iam:'Sono',woman:'Donna',man:'Uomo',seekWoman:'Donna',seekMan:'Uomo',city:'Città',privacyConsent:'Acconsento al trattamento dei dati per la registrazione e la selezione privata.',restoreProfile:'Ricarica profilo',profilePreparing:'Preparazione del profilo privato…',profileReady:'Registrazione completata. Il tuo profilo privato è attivo.',photoLater:'Puoi aggiungere una foto più tardi.'},
  pl:{firstName:'Imię',iam:'Jestem',woman:'Kobieta',man:'Mężczyzna',seekWoman:'Kobiety',seekMan:'Mężczyzny',city:'Miasto',privacyConsent:'Zgadzam się na przetwarzanie danych do rejestracji i prywatnego doboru.',restoreProfile:'Załaduj profil ponownie',profilePreparing:'Przygotowujemy Twój prywatny profil…',profileReady:'Rejestracja zakończona. Twój prywatny profil jest aktywny.',photoLater:'Zdjęcie możesz dodać później.'},
  sk:{firstName:'Meno',iam:'Som',woman:'Žena',man:'Muž',seekWoman:'Ženu',seekMan:'Muža',city:'Mesto',privacyConsent:'Súhlasím so spracovaním údajov na registráciu a súkromný výber.',restoreProfile:'Načítať profil znova',profilePreparing:'Pripravujem váš súkromný profil…',profileReady:'Registrácia je hotová. Váš súkromný profil je aktívny.',photoLater:'Fotografiu môžete pridať neskôr.'},
  uk:{firstName:'Ім’я',iam:'Я',woman:'Жінка',man:'Чоловік',seekWoman:'Жінку',seekMan:'Чоловіка',city:'Місто',privacyConsent:'Я погоджуюся на обробку даних для реєстрації та приватного добору.',restoreProfile:'Завантажити анкету знову',profilePreparing:'Готуємо вашу приватну анкету…',profileReady:'Реєстрацію завершено. Ваша приватна анкета активна.',photoLater:'Фото можна додати пізніше.'},
  ru:{firstName:'Имя',iam:'Я',woman:'Женщина',man:'Мужчина',seekWoman:'Женщину',seekMan:'Мужчину',city:'Город',privacyConsent:'Я согласен на обработку данных для регистрации и приватного подбора.',restoreProfile:'Загрузить анкету снова',profilePreparing:'Готовим вашу приватную анкету…',profileReady:'Регистрация завершена. Ваша приватная анкета активна.',photoLater:'Фотографию можно добавить позже.'}
};
Object.entries(quickRegistrationCopy).forEach(([language, copy]) => Object.assign(translations[language], copy));

const loginView = document.querySelector('#loginView');
const dashboardView = document.querySelector('#dashboardView');
const loginForm = document.querySelector('#loginForm');
const loginButton = document.querySelector('#loginButton');
const loginMessage = document.querySelector('#loginMessage');
const memberEmail = document.querySelector('#memberEmail');
const memberPassword = document.querySelector('#memberPassword');
const registerForm = document.querySelector('#registerForm');
const registerFirstName = document.querySelector('#registerFirstName');
const registerAge = document.querySelector('#registerAge');
const registerGender = document.querySelector('#registerGender');
const registerLookingFor = document.querySelector('#registerLookingFor');
const registerCity = document.querySelector('#registerCity');
const registerEmail = document.querySelector('#registerEmail');
const registerPassword = document.querySelector('#registerPassword');
const registerPasswordAgain = document.querySelector('#registerPasswordAgain');
const registerButton = document.querySelector('#registerButton');
const resetForm = document.querySelector('#resetForm');
const newPassword = document.querySelector('#newPassword');
const newPasswordAgain = document.querySelector('#newPasswordAgain');
const savePasswordButton = document.querySelector('#savePasswordButton');
const showLogin = document.querySelector('#showLogin');
const showRegister = document.querySelector('#showRegister');
const forgotPassword = document.querySelector('#forgotPassword');
const loginNote = document.querySelector('#loginNote');
const logoutButton = document.querySelector('#logoutButton');
const memberLanguageSelect = document.querySelector('#memberLanguageSelect');
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
let currentRegistration = null;
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
  if (memberLanguageSelect) memberLanguageSelect.value = currentLang;
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

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, character => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;'
  })[character]);
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

function savedShortRegistration(email = '') {
  try {
    const saved = JSON.parse(localStorage.getItem('duonera-short-registration') || '{}');
    return String(saved.email || '').trim().toLowerCase() === String(email).trim().toLowerCase()
      ? saved
      : {};
  } catch {
    return {};
  }
}

function registrationSnapshot(auth, lead = null) {
  const metadata = auth.user?.user_metadata || {};
  return {
    ...metadata,
    ...(lead || {}),
    ...savedShortRegistration(auth.user?.email)
  };
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
  return localPart.split(/\s+/).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ').slice(0, 40);
}

function countryForLanguage(language) {
  return {cs:'Česko',de:'Deutschland',it:'Italia',pl:'Polska',sk:'Slovensko',uk:'Україна'}[language] || 'Česko';
}

function starterProfilePayload(auth, lead, saved) {
  const registration = {...(auth.user?.user_metadata || {}), ...lead, ...saved};
  const email = String(auth.user.email || lead?.email || saved.email || '').trim().toLowerCase();
  const age = Number(registration.age || 18);
  return {
    id: createUuid(),
    user_id: auth.user.id,
    lead_id: lead.id,
    status: 'new',
    first_name: String(registration.first_name || fallbackName(email)).trim().slice(0, 40),
    birth_date: birthDateFromAge(age),
    gender: String(registration.gender || ''),
    looking_for: String(registration.looking_for || ''),
    country: String(registration.country || countryForLanguage(registration.landing_language || currentLang)),
    city: String(registration.city || '').trim(),
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
    preferred_distance_km: 50,
    relationship_goal: 'Vážný vztah',
    consent_privacy: true,
    consent_discovery: true,
    consent_contact: false,
    is_approved: false,
    is_discoverable: false,
    source: 'duonera.cz/short-registration',
    photo_paths: [],
    public_photo_paths: [],
    raw_data: { starter_profile: true, registration_age: age }
  };
}

async function ensureLeadForMember(auth, lead, saved) {
  if (lead?.id) return lead;
  const registration = {...(auth.user?.user_metadata || {}), ...saved};
  if (!registration.first_name && !registration.city) return null;
  const payload = {
    id: createUuid(),
    gender: registration.gender || '',
    looking_for: registration.looking_for || '',
    age: Number(registration.age || 18),
    city: registration.city || '',
    email: String(auth.user.email || '').trim().toLowerCase(),
    consent_privacy: true,
    source: 'duonera.cz/account-recovery'
  };
  await insertRow('duonera_leads', payload, 20000);
  await callMemberRpc('duonera_claim_registration');
  const rows = await memberRest(`duonera_leads?select=*&user_id=eq.${encodeURIComponent(auth.user.id)}&order=created_at.desc&limit=1`);
  return rows?.[0] || null;
}

async function ensureStarterProfile(auth, lead) {
  const saved = savedShortRegistration(auth.user.email);
  const memberLead = await ensureLeadForMember(auth, lead, saved);
  if (!memberLead?.id) return null;
  const payload = starterProfilePayload(auth, memberLead, saved);
  await insertRow('duonera_profiles', payload, 20000, auth.session.access_token);
  return payload;
}

async function renderOwnProfile(auth) {
  if (!currentProfile) {
    profileState.textContent = t('profileActive');
    createProfileButton.hidden = !currentRegistration;
    const saved = savedShortRegistration(auth.user.email);
    const registration = currentRegistration || saved;
    const name = registration.first_name || fallbackName(auth.user.email);
    const age = registration.age || '—';
    const city = registration.city || '—';
    ownProfileCard.innerHTML = `<div class="own-profile-layout starter-profile"><div class="starter-photo" aria-hidden="true"><span>D</span><small>${escapeHtml(t('photoLater'))}</small></div><div class="own-profile-info"><h3>${escapeHtml(name)}, ${escapeHtml(age)}</h3><p class="location">${escapeHtml(city)}</p><div class="own-details"><div><span>${escapeHtml(t('seeking'))}</span><p>${escapeHtml(registration.looking_for || '—')}</p></div><div><span>${escapeHtml(t('languages'))}</span><p>${escapeHtml(valueText(registration.languages))}</p></div></div></div></div>`;
    return;
  }

  createProfileButton.hidden = true;
  profileState.textContent = t('profileActive');
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
    gallery.innerHTML = `<div class="starter-photo" aria-hidden="true"><span>D</span><small>${t('photoLater')}</small></div>`;
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
    const [ownRows, leadRows, discovery, choices, premium] = await Promise.all([
      memberRest(`duonera_profiles?select=*&user_id=eq.${encodeURIComponent(auth.user.id)}&limit=1`),
      memberRest(`duonera_leads?select=*&user_id=eq.${encodeURIComponent(auth.user.id)}&order=created_at.desc&limit=1`),
      fetchDiscoveryProfiles(),
      callMemberRpc('duonera_my_choices'),
      callMemberRpc('duonera_my_premium_selection')
    ]);
    currentProfile = ownRows?.[0] || null;
    currentRegistration = registrationSnapshot(auth, leadRows?.[0] || null);
    if (!currentProfile) {
      dashboardMessage.textContent = t('profilePreparing');
      try {
        currentProfile = await ensureStarterProfile(auth, leadRows?.[0] || null);
      } catch (profileError) {
        console.error('DUONERA starter profile could not be created', profileError);
      }
    }
    loadedDiscovery = discovery || [];
    loadedPremium = premium || [];
    selectedProfiles = new Map((choices || []).map(choice => [choice.chosen_profile_id, choice]));
    mutualNotice.hidden = !(choices || []).some(choice => choice.is_mutual);
    await renderOwnProfile(auth);
    renderDiscovery(loadedDiscovery);
    renderPremium(loadedPremium);
    dashboardMessage.textContent = currentProfile ? t('profileReady') : t('accountReady');
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

function authMessage(error) {
  const details = String(error?.message || '').toLowerCase();
  if (details.includes('invalid login credentials')) return t('wrongLogin');
  if (details.includes('email not confirmed')) return t('emailNotConfirmed');
  if (details.includes('already registered') || details.includes('already been registered')) return t('alreadyRegistered');
  return t('authServiceError');
}

function setLoginMessage(message = '', error = false) {
  loginMessage.className = error ? 'member-message error' : 'member-message';
  loginMessage.textContent = message;
}

function setAuthMode(mode) {
  const loginMode = mode === 'login';
  const registerMode = mode === 'register';
  const resetMode = mode === 'reset';
  loginForm.hidden = !loginMode;
  registerForm.hidden = !registerMode;
  resetForm.hidden = !resetMode;
  showLogin.classList.toggle('active', loginMode);
  showRegister.classList.toggle('active', registerMode);
  showLogin.hidden = resetMode;
  showRegister.hidden = resetMode;
  loginNote.hidden = resetMode;
  setLoginMessage();
}

async function openDashboard(auth) {
  activeAuth = auth;
  loginView.hidden = true;
  dashboardView.hidden = false;
  logoutButton.hidden = false;
  const adminLink = document.getElementById('adminLink');
  if (adminLink) {
    const email = String(auth.user.email || '').trim().toLowerCase();
    adminLink.hidden = email !== 'info@duonera.cz';
  }
  await loadDashboard(auth);
}

showLogin.addEventListener('click', () => setAuthMode('login'));
showRegister.addEventListener('click', () => {
  registerEmail.value = memberEmail.value.trim();
  setAuthMode('register');
});
createProfileButton.addEventListener('click', async () => {
  if (!activeAuth) return;
  createProfileButton.disabled = true;
  await loadDashboard(activeAuth);
  createProfileButton.disabled = false;
});

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  loginButton.disabled = true;
  setLoginMessage();
  try {
    const auth = await signInMember(memberEmail.value, memberPassword.value);
    await openDashboard(auth);
  } catch (error) {
    setLoginMessage(authMessage(error), true);
  } finally {
    loginButton.disabled = false;
  }
});

registerForm.addEventListener('submit', async event => {
  event.preventDefault();
  registerButton.disabled = true;
  setLoginMessage();
  const password = registerPassword.value;
  if (password.length < 8) {
    setLoginMessage(t('passwordShort'), true);
    registerButton.disabled = false;
    return;
  }
  if (password !== registerPasswordAgain.value) {
    setLoginMessage(t('passwordMismatch'), true);
    registerButton.disabled = false;
    return;
  }
  try {
    const leadId = createUuid();
    const shortRegistration = {
      first_name: registerFirstName.value.trim(),
      age: Number(registerAge.value),
      gender: registerGender.value,
      looking_for: registerLookingFor.value,
      city: registerCity.value.trim(),
      country: countryForLanguage(currentLang),
      languages: [],
      email: registerEmail.value.trim().toLowerCase(),
      landing_language: currentLang,
      consent_privacy: true,
      source: 'duonera.cz/account-registration'
    };
    const data = await registerMember(
      shortRegistration.email,
      password,
      `${location.origin}/ucet.html`,
      shortRegistration
    );
    localStorage.setItem('duonera-short-registration', JSON.stringify(shortRegistration));
    localStorage.setItem('duonera-lead-id', leadId);
    try {
      await insertRow('duonera_leads', {
        id: leadId,
        gender: shortRegistration.gender,
        looking_for: shortRegistration.looking_for,
        age: shortRegistration.age,
        city: shortRegistration.city,
        email: shortRegistration.email,
        consent_privacy: true,
        source: shortRegistration.source
      }, 20000);
    } catch (leadError) {
      console.warn('DUONERA account created, but the starter registration could not be saved yet', leadError);
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', {
        method: 'account_registration',
        landing_language: currentLang,
        transport_type: 'beacon'
      });
      window.gtag('event', 'sign_up', {
        method: 'email_password',
        transport_type: 'beacon'
      });
    }
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', { content_name: 'duonera_registration' });
    }
    if (data?.session?.access_token && data?.user) {
      await openDashboard({ session: data.session, user: data.user });
    } else {
      memberEmail.value = shortRegistration.email;
      memberPassword.value = '';
      setAuthMode('login');
      setLoginMessage(t('confirmationSent'));
    }
  } catch (error) {
    setLoginMessage(authMessage(error), true);
  } finally {
    registerButton.disabled = false;
  }
});

forgotPassword.addEventListener('click', async () => {
  const email = memberEmail.value.trim().toLowerCase();
  if (!email) {
    memberEmail.focus();
    return;
  }
  forgotPassword.disabled = true;
  setLoginMessage();
  try {
    await requestPasswordReset(email, `${location.origin}/ucet.html`);
    setLoginMessage(t('resetSent'));
  } catch (error) {
    setLoginMessage(authMessage(error), true);
  } finally {
    forgotPassword.disabled = false;
  }
});

resetForm.addEventListener('submit', async event => {
  event.preventDefault();
  savePasswordButton.disabled = true;
  setLoginMessage();
  const password = newPassword.value;
  if (password.length < 8) {
    setLoginMessage(t('passwordShort'), true);
    savePasswordButton.disabled = false;
    return;
  }
  if (password !== newPasswordAgain.value) {
    setLoginMessage(t('passwordMismatch'), true);
    savePasswordButton.disabled = false;
    return;
  }
  try {
    await updateMemberPassword(password);
    sessionStorage.removeItem('duonera-auth-flow-type');
    setLoginMessage(t('passwordSaved'));
    const auth = await requireMemberSession();
    if (auth) await openDashboard(auth);
  } catch (error) {
    setLoginMessage(authMessage(error), true);
  } finally {
    savePasswordButton.disabled = false;
  }
});

logoutButton.addEventListener('click', async () => {
  await signOutMember();
  activeAuth = null;
  currentProfile = null;
  currentRegistration = null;
  loadedDiscovery = [];
  loadedPremium = [];
  selectedProfiles.clear();
  dashboardView.hidden = true;
  logoutButton.hidden = true;
  loginView.hidden = false;
  setAuthMode('login');
});

document.querySelectorAll('[data-lang]').forEach(button => {
  button.addEventListener('click', () => applyLanguage(button.dataset.lang));
});
memberLanguageSelect?.addEventListener('change',()=>applyLanguage(memberLanguageSelect.value));


document.querySelector('#year').textContent = new Date().getFullYear();
applyLanguage(currentLang);

let savedRegistration = {};
try {
  savedRegistration = JSON.parse(localStorage.getItem('duonera-short-registration') || '{}');
} catch {
  savedRegistration = {};
}
if (savedRegistration.email) {
  memberEmail.value = savedRegistration.email;
  registerEmail.value = savedRegistration.email;
}
if (savedRegistration.first_name) registerFirstName.value = savedRegistration.first_name;
if (savedRegistration.age) registerAge.value = savedRegistration.age;
if (savedRegistration.gender) registerGender.value = savedRegistration.gender;
if (savedRegistration.looking_for) registerLookingFor.value = savedRegistration.looking_for;
if (savedRegistration.city) registerCity.value = savedRegistration.city;
const pageParams = new URLSearchParams(location.search);
const requestedEmail = String(pageParams.get('email') || '').trim().toLowerCase();
const requestedMode = pageParams.get('mode');
if (requestedEmail) {
  memberEmail.value = requestedEmail;
  registerEmail.value = requestedEmail;
}

const auth = await requireMemberSession();
const recoveryFlow = sessionStorage.getItem('duonera-auth-flow-type') === 'recovery';
if (auth && recoveryFlow) {
  activeAuth = auth;
  loginView.hidden = false;
  dashboardView.hidden = true;
  logoutButton.hidden = true;
  setAuthMode('reset');
} else if (auth) {
  await openDashboard(auth);
} else {
  loginView.hidden = false;
  dashboardView.hidden = true;
  logoutButton.hidden = true;
  setAuthMode(requestedMode === 'register' ? 'register' : 'login');
  const redirectError = takeAuthRedirectError();
  if (redirectError) setLoginMessage(t('authServiceError'), true);
}


// Keep the member area available from the installed DUONERA app.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js?v=43').catch(error => {
      console.warn('DUONERA service worker registration failed', error);
    });
  });
}
