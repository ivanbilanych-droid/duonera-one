import { createUuid, insertRow } from './supabase-client.js?v=5';
import { registerMember } from './member-auth.js?v=18';
import { compressProfilePhoto, savePendingRegistrationPhoto } from './registration-photo.js?v=1';

const t = {
  cs:{login:'Přihlásit',kicker:'SOUKROMÉ SEZNÁMENÍ VE VAŠEM MĚSTĚ',title1:'Někdo blízký.',title2:'Ne další profil.',intro:'DUONERA vám představí tři lidi poblíž, kteří chtějí skutečný vztah. Kontakt se otevře jen při vzájemném ano.',nearbyNow:'lidé poblíž dnes',proof1:'lidé ve vašem okruhu',proof2:'veřejných profilů',proof3:'skutečný cíl',cta:'Najít mé tři',free:'Zdarma',oneMinute:'1 minuta',ageRule:'od 18 let',discover:'Jak to funguje',howTitle:'Méně hledání. Více pozornosti.',formTitle:'Koho máme hledat pro vás?',name:'Jméno',namePlaceholder:'Jana',age:'Věk',iam:'Jsem',seeking:'Hledám',woman:'Žena',man:'Muž',seekWoman:'Ženu',seekMan:'Muže',homeCity:'Město, kde žijete',cityPlaceholder:'Praha',location:'Použít aktuální polohu',locating:'Zjišťuji polohu…',locationReady:'Poloha je připravena',locationDenied:'Povolte polohu nebo napište město ručně.',languages:'Jazyky',multiple:'můžete vybrat více',emailPlaceholder:'vas@email.cz',consent:'Souhlasím se zpracováním údajů pro registraci a soukromý výběr.',privacy:'Soukromí',submit:'Vstoupit do DUONERA',submitting:'Vytvářím profil…',noPassword:'Bez hesla',private:'Neveřejný profil',noPhoto:'Fotografie později',close:'Zavřít',successTitle:'Váš soukromý profil je připraven,',successText:'Fotografii a další informace můžete doplnit později.',openProfile:'Otevřít můj profil',error:'Profil se nepodařilo uložit. Zkuste to prosím znovu.',photoAlt:'Dva lidé se potkávají v evropském městě'},
  de:{login:'Anmelden',kicker:'PRIVATE BEGEGNUNGEN IN IHRER STADT',title1:'Jemand in Ihrer Nähe.',title2:'Nicht noch ein Profil.',intro:'DUONERA stellt Ihnen drei Menschen in Ihrer Nähe vor, die eine echte Beziehung suchen. Kontakt gibt es nur nach einem gegenseitigen Ja.',nearbyNow:'Menschen heute in der Nähe',proof1:'Menschen in Ihrem Kreis',proof2:'öffentliche Profile',proof3:'echtes Ziel',cta:'Meine drei finden',free:'Kostenlos',oneMinute:'1 Minute',ageRule:'ab 18 Jahren',discover:'So funktioniert es',howTitle:'Weniger suchen. Mehr Aufmerksamkeit.',formTitle:'Wen dürfen wir für Sie suchen?',name:'Vorname',namePlaceholder:'Anna',age:'Alter',iam:'Ich bin',seeking:'Ich suche',woman:'Frau',man:'Mann',seekWoman:'Frau',seekMan:'Mann',homeCity:'Stadt, in der Sie leben',cityPlaceholder:'Berlin',location:'Aktuellen Standort verwenden',locating:'Standort wird ermittelt…',locationReady:'Standort ist bereit',locationDenied:'Erlauben Sie den Standort oder geben Sie Ihre Stadt ein.',languages:'Sprachen',multiple:'mehrere möglich',emailPlaceholder:'ihre@email.de',consent:'Ich stimme der Datenverarbeitung für Registrierung und private Auswahl zu.',privacy:'Datenschutz',submit:'DUONERA beitreten',submitting:'Profil wird erstellt…',noPassword:'Ohne Passwort',private:'Nicht öffentlich',noPhoto:'Foto später',close:'Schließen',successTitle:'Ihr privates Profil ist bereit,',successText:'Foto und weitere Angaben können später ergänzt werden.',openProfile:'Mein Profil öffnen',error:'Das Profil konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',photoAlt:'Zwei Menschen begegnen sich in einer europäischen Stadt'},
  it:{login:'Accedi',kicker:'INCONTRI PRIVATI NELLA TUA CITTÀ',title1:'Qualcuno vicino.',title2:'Non un altro profilo.',intro:'DUONERA ti presenta tre persone vicine che desiderano una relazione vera. Il contatto si apre solo dopo una scelta reciproca.',nearbyNow:'persone vicine oggi',proof1:'persone nella tua cerchia',proof2:'profili pubblici',proof3:'obiettivo reale',cta:'Trova i miei tre',free:'Gratis',oneMinute:'1 minuto',ageRule:'dai 18 anni',discover:'Come funziona',howTitle:'Meno ricerca. Più attenzione.',formTitle:'Chi dobbiamo cercare per te?',name:'Nome',namePlaceholder:'Giulia',age:'Età',iam:'Sono',seeking:'Cerco',woman:'Donna',man:'Uomo',seekWoman:'Donna',seekMan:'Uomo',homeCity:'Città in cui vivi',cityPlaceholder:'Roma',location:'Usa la posizione attuale',locating:'Rilevamento posizione…',locationReady:'Posizione pronta',locationDenied:'Consenti la posizione o inserisci la città.',languages:'Lingue',multiple:'più di una',emailPlaceholder:'tua@email.it',consent:'Acconsento al trattamento dei dati per la registrazione e la selezione privata.',privacy:'Privacy',submit:'Entra in DUONERA',submitting:'Creazione profilo…',noPassword:'Senza password',private:'Profilo non pubblico',noPhoto:'Foto più tardi',close:'Chiudi',successTitle:'Il tuo profilo privato è pronto,',successText:'Puoi aggiungere la foto e altri dettagli più tardi.',openProfile:'Apri il mio profilo',error:'Impossibile salvare il profilo. Riprova.',photoAlt:'Due persone si incontrano in una città europea'},
  pl:{login:'Zaloguj się',kicker:'PRYWATNE POZNANIE W TWOIM MIEŚCIE',title1:'Ktoś blisko.',title2:'Nie kolejny profil.',intro:'DUONERA przedstawia trzy osoby w pobliżu, które chcą prawdziwego związku. Kontakt otwiera się tylko po wzajemnym wyborze.',nearbyNow:'osoby w pobliżu dziś',proof1:'osoby w Twoim kręgu',proof2:'publicznych profili',proof3:'prawdziwy cel',cta:'Znajdź moją trójkę',free:'Bezpłatnie',oneMinute:'1 minuta',ageRule:'od 18 lat',discover:'Jak to działa',howTitle:'Mniej szukania. Więcej uwagi.',formTitle:'Kogo mamy szukać dla Ciebie?',name:'Imię',namePlaceholder:'Anna',age:'Wiek',iam:'Jestem',seeking:'Szukam',woman:'Kobieta',man:'Mężczyzna',seekWoman:'Kobiety',seekMan:'Mężczyzny',homeCity:'Miasto, w którym mieszkasz',cityPlaceholder:'Warszawa',location:'Użyj aktualnej lokalizacji',locating:'Ustalam lokalizację…',locationReady:'Lokalizacja gotowa',locationDenied:'Zezwól na lokalizację lub wpisz miasto.',languages:'Języki',multiple:'możesz wybrać kilka',emailPlaceholder:'twoj@email.pl',consent:'Zgadzam się na przetwarzanie danych do rejestracji i prywatnego doboru.',privacy:'Prywatność',submit:'Dołącz do DUONERA',submitting:'Tworzę profil…',noPassword:'Bez hasła',private:'Profil niepubliczny',noPhoto:'Zdjęcie później',close:'Zamknij',successTitle:'Twój prywatny profil jest gotowy,',successText:'Zdjęcie i inne informacje możesz dodać później.',openProfile:'Otwórz mój profil',error:'Nie udało się zapisać profilu. Spróbuj ponownie.',photoAlt:'Dwie osoby spotykają się w europejskim mieście'},
  sk:{login:'Prihlásiť',kicker:'SÚKROMNÉ ZOZNÁMENIE VO VAŠOM MESTE',title1:'Niekto nablízku.',title2:'Nie ďalší profil.',intro:'DUONERA vám predstaví troch ľudí nablízku, ktorí chcú skutočný vzťah. Kontakt sa otvorí iba po vzájomnom áno.',nearbyNow:'ľudia nablízku dnes',proof1:'ľudia vo vašom okruhu',proof2:'verejných profilov',proof3:'skutočný cieľ',cta:'Nájsť mojich troch',free:'Zadarmo',oneMinute:'1 minúta',ageRule:'od 18 rokov',discover:'Ako to funguje',howTitle:'Menej hľadania. Viac pozornosti.',formTitle:'Koho máme hľadať pre vás?',name:'Meno',namePlaceholder:'Jana',age:'Vek',iam:'Som',seeking:'Hľadám',woman:'Žena',man:'Muž',seekWoman:'Ženu',seekMan:'Muža',homeCity:'Mesto, kde žijete',cityPlaceholder:'Bratislava',location:'Použiť aktuálnu polohu',locating:'Zisťujem polohu…',locationReady:'Poloha je pripravená',locationDenied:'Povoľte polohu alebo napíšte mesto.',languages:'Jazyky',multiple:'môžete vybrať viac',emailPlaceholder:'vas@email.sk',consent:'Súhlasím so spracovaním údajov na registráciu a súkromný výber.',privacy:'Súkromie',submit:'Vstúpiť do DUONERA',submitting:'Vytváram profil…',noPassword:'Bez hesla',private:'Neverejný profil',noPhoto:'Fotografia neskôr',close:'Zavrieť',successTitle:'Váš súkromný profil je pripravený,',successText:'Fotografiu a ďalšie údaje môžete doplniť neskôr.',openProfile:'Otvoriť môj profil',error:'Profil sa nepodarilo uložiť. Skúste to znova.',photoAlt:'Dvaja ľudia sa stretávajú v európskom meste'}
};
t.en={...t.cs,login:'Sign in',kicker:'PRIVATE INTRODUCTIONS IN YOUR CITY',title1:'Someone nearby.',title2:'Not another profile.',intro:'DUONERA introduces three nearby people who want a real relationship. Contact opens only after a mutual yes.',nearbyNow:'people nearby today',proof1:'people in your circle',proof2:'public profiles',proof3:'real goal',cta:'Find my three',free:'Free',oneMinute:'1 minute',ageRule:'18 and over',discover:'How it works',howTitle:'Less searching. More attention.',formTitle:'Who should we look for?',name:'First name',namePlaceholder:'Anna',age:'Age',iam:'I am',seeking:'Looking for',woman:'Woman',man:'Man',seekWoman:'Woman',seekMan:'Man',homeCity:'City where you live',cityPlaceholder:'London',location:'Use current location',locating:'Finding location…',locationReady:'Location is ready',locationDenied:'Allow location or enter your city.',languages:'Languages',multiple:'choose more than one',emailPlaceholder:'you@email.com',consent:'I agree to data processing for registration and private selection.',privacy:'Privacy',submit:'Join DUONERA',submitting:'Creating profile…',noPassword:'No password',private:'Private profile',noPhoto:'Photo later',close:'Close',successTitle:'Your private profile is ready,',successText:'Add your photo and other details later.',openProfile:'Open my profile',error:'We could not save the profile. Please try again.',photoAlt:'Two people meet in a European city'};
t.uk={...t.en,login:'Увійти',kicker:'ПРИВАТНІ ЗНАЙОМСТВА У ВАШОМУ МІСТІ',title1:'Хтось поруч.',title2:'Не ще одна анкета.',intro:'DUONERA познайомить вас із трьома людьми поруч, які прагнуть справжніх стосунків. Контакт відкриється лише після взаємного вибору.',nearbyNow:'люди поруч сьогодні',proof1:'люди у вашому колі',proof2:'публічних анкет',proof3:'справжня мета',cta:'Знайти мою трійку',free:'Безкоштовно',oneMinute:'1 хвилина',ageRule:'від 18 років',discover:'Як це працює',howTitle:'Менше пошуку. Більше уваги.',formTitle:'Кого нам шукати для вас?',name:'Ім’я',namePlaceholder:'Анна',age:'Вік',iam:'Я',seeking:'Шукаю',woman:'Жінка',man:'Чоловік',seekWoman:'Жінку',seekMan:'Чоловіка',homeCity:'Місто, де ви живете',cityPlaceholder:'Київ',location:'Використати поточне місце',locating:'Визначаємо місце…',locationReady:'Місце визначено',locationDenied:'Дозвольте геолокацію або введіть місто.',languages:'Мови',multiple:'можна вибрати кілька',emailPlaceholder:'vas@email.ua',consent:'Я погоджуюся на обробку даних для реєстрації та приватного добору.',privacy:'Конфіденційність',submit:'Приєднатися до DUONERA',submitting:'Створюємо профіль…',noPassword:'Без пароля',private:'Непублічний профіль',noPhoto:'Фото пізніше',close:'Закрити',successTitle:'Ваш приватний профіль готовий,',successText:'Фото та іншу інформацію можна додати пізніше.',openProfile:'Відкрити мій профіль',error:'Не вдалося зберегти профіль. Спробуйте ще раз.',photoAlt:'Двоє людей зустрічаються в європейському місті'};
t.ru={...t.en,login:'Войти',kicker:'ПРИВАТНЫЕ ЗНАКОМСТВА В ВАШЕМ ГОРОДЕ',title1:'Кто-то рядом.',title2:'Не ещё одна анкета.',intro:'DUONERA познакомит вас с тремя людьми рядом, которые хотят настоящих отношений. Контакт откроется только после взаимного выбора.',nearbyNow:'люди рядом сегодня',proof1:'люди в вашем круге',proof2:'публичных анкет',proof3:'настоящая цель',cta:'Найти мою тройку',free:'Бесплатно',oneMinute:'1 минута',ageRule:'от 18 лет',discover:'Как это работает',howTitle:'Меньше поиска. Больше внимания.',formTitle:'Кого нам искать для вас?',name:'Имя',namePlaceholder:'Анна',age:'Возраст',iam:'Я',seeking:'Ищу',woman:'Женщина',man:'Мужчина',seekWoman:'Женщину',seekMan:'Мужчину',homeCity:'Город, где вы живёте',cityPlaceholder:'Прага',location:'Использовать текущее местоположение',locating:'Определяем местоположение…',locationReady:'Местоположение определено',locationDenied:'Разрешите геолокацию или укажите город.',languages:'Языки',multiple:'можно выбрать несколько',emailPlaceholder:'vas@email.cz',consent:'Я согласен на обработку данных для регистрации и приватного подбора.',privacy:'Конфиденциальность',submit:'Вступить в DUONERA',submitting:'Создаём профиль…',noPassword:'Без пароля',private:'Непубличный профиль',noPhoto:'Фото позже',close:'Закрыть',successTitle:'Ваш приватный профиль готов,',successText:'Фотографию и другие данные можно добавить позже.',openProfile:'Открыть мой профиль',error:'Не удалось сохранить профиль. Попробуйте ещё раз.',photoAlt:'Два человека встречаются в европейском городе'};

const registrationCopy={
  cs:{password:'Heslo',passwordPlaceholder:'Min. 8 znaků',oneRegistration:'Jedna registrace',terms:'Jak funguje DUONERA',successTitle:'Účet je vytvořen,',successText:'Potvrďte e-mail od DUONERA. Potom se otevře váš soukromý účet.',openProfile:'Otevřít přihlášení',accountExists:'Tento e-mail už má účet. Použijte Přihlásit.',registrationError:'Registraci se nepodařilo dokončit. Zkuste to prosím znovu.'},
  de:{password:'Passwort',passwordPlaceholder:'Mind. 8 Zeichen',oneRegistration:'Eine Registrierung',terms:'So funktioniert DUONERA',successTitle:'Ihr Konto wurde erstellt,',successText:'Bestätigen Sie die E-Mail von DUONERA. Danach öffnet sich Ihr privates Konto.',openProfile:'Zur Anmeldung',accountExists:'Für diese E-Mail besteht bereits ein Konto. Bitte melden Sie sich an.',registrationError:'Die Registrierung konnte nicht abgeschlossen werden. Bitte versuchen Sie es erneut.'},
  it:{password:'Password',passwordPlaceholder:'Almeno 8 caratteri',oneRegistration:'Una registrazione',terms:'Come funziona DUONERA',successTitle:'Il tuo account è stato creato,',successText:'Conferma l’e-mail di DUONERA. Poi si aprirà il tuo account privato.',openProfile:'Vai all’accesso',accountExists:'Esiste già un account per questa e-mail. Accedi.',registrationError:'Non è stato possibile completare la registrazione. Riprova.'},
  pl:{password:'Hasło',passwordPlaceholder:'Min. 8 znaków',oneRegistration:'Jedna rejestracja',terms:'Jak działa DUONERA',successTitle:'Twoje konto zostało utworzone,',successText:'Potwierdź e-mail od DUONERA. Potem otworzy się Twoje prywatne konto.',openProfile:'Przejdź do logowania',accountExists:'Dla tego e-maila istnieje już konto. Zaloguj się.',registrationError:'Nie udało się dokończyć rejestracji. Spróbuj ponownie.'},
  sk:{password:'Heslo',passwordPlaceholder:'Min. 8 znakov',oneRegistration:'Jedna registrácia',terms:'Ako funguje DUONERA',successTitle:'Váš účet je vytvorený,',successText:'Potvrďte e-mail od DUONERA. Potom sa otvorí váš súkromný účet.',openProfile:'Otvoriť prihlásenie',accountExists:'Tento e-mail už má účet. Prihláste sa.',registrationError:'Registráciu sa nepodarilo dokončiť. Skúste to znova.'},
  uk:{password:'Пароль',passwordPlaceholder:'Щонайменше 8 символів',oneRegistration:'Одна реєстрація',terms:'Як працює DUONERA',successTitle:'Ваш обліковий запис створено,',successText:'Підтвердьте лист від DUONERA. Після цього відкриється ваш приватний кабінет.',openProfile:'Перейти до входу',accountExists:'Для цього e-mail уже є обліковий запис. Увійдіть.',registrationError:'Не вдалося завершити реєстрацію. Спробуйте ще раз.'},
  ru:{password:'Пароль',passwordPlaceholder:'Минимум 8 символов',oneRegistration:'Одна регистрация',terms:'Как работает DUONERA',successTitle:'Ваш аккаунт создан,',successText:'Подтвердите письмо от DUONERA. После этого откроется ваш личный кабинет.',openProfile:'Перейти ко входу',accountExists:'Для этого e-mail уже есть аккаунт. Войдите.',registrationError:'Не удалось завершить регистрацию. Попробуйте ещё раз.'},
  en:{password:'Password',passwordPlaceholder:'At least 8 characters',oneRegistration:'One registration',terms:'How DUONERA works',successTitle:'Your account has been created,',successText:'Confirm the email from DUONERA. Your private account will then open.',openProfile:'Go to sign in',accountExists:'An account already exists for this email. Sign in instead.',registrationError:'We could not complete the registration. Please try again.'}
};
Object.entries(registrationCopy).forEach(([code,copy])=>Object.assign(t[code],copy));

const shortPhotoCopy={
  cs:{distance:'Koho hledat v okruhu',profilePhoto:'Vaše fotografie',choosePhoto:'Vybrat fotografii',photoRequirement:'Aktuální fotografie obličeje. JPG, PNG nebo WEBP.',photoNow:'Fotografie je součástí profilu',photoInvalid:'Vyberte fotografii JPG, PNG nebo WEBP do 12 MB.',successText:'Potvrďte e-mail. Fotografie a údaje se potom automaticky otevřou ve vašem profilu.'},
  de:{distance:'Suchradius',profilePhoto:'Ihr Foto',choosePhoto:'Foto auswählen',photoRequirement:'Aktuelles Gesichtsfoto. JPG, PNG oder WEBP.',photoNow:'Foto ist Teil des Profils',photoInvalid:'Wählen Sie ein JPG-, PNG- oder WEBP-Foto bis 12 MB.',successText:'Bestätigen Sie Ihre E-Mail. Foto und Angaben erscheinen danach automatisch in Ihrem Profil.'},
  it:{distance:'Raggio di ricerca',profilePhoto:'La tua foto',choosePhoto:'Scegli una foto',photoRequirement:'Foto attuale del viso. JPG, PNG o WEBP.',photoNow:'La foto fa parte del profilo',photoInvalid:'Scegli una foto JPG, PNG o WEBP fino a 12 MB.',successText:'Conferma l’e-mail. La foto e i dati appariranno automaticamente nel tuo profilo.'},
  pl:{distance:'Promień wyszukiwania',profilePhoto:'Twoje zdjęcie',choosePhoto:'Wybierz zdjęcie',photoRequirement:'Aktualne zdjęcie twarzy. JPG, PNG lub WEBP.',photoNow:'Zdjęcie jest częścią profilu',photoInvalid:'Wybierz zdjęcie JPG, PNG lub WEBP do 12 MB.',successText:'Potwierdź e-mail. Zdjęcie i dane automatycznie pojawią się w Twoim profilu.'},
  sk:{distance:'Okruh hľadania',profilePhoto:'Vaša fotografia',choosePhoto:'Vybrať fotografiu',photoRequirement:'Aktuálna fotografia tváre. JPG, PNG alebo WEBP.',photoNow:'Fotografia je súčasťou profilu',photoInvalid:'Vyberte fotografiu JPG, PNG alebo WEBP do 12 MB.',successText:'Potvrďte e-mail. Fotografia a údaje sa potom automaticky zobrazia vo vašom profile.'},
  uk:{distance:'Радіус пошуку',profilePhoto:'Ваше фото',choosePhoto:'Обрати фото',photoRequirement:'Актуальне фото обличчя. JPG, PNG або WEBP.',photoNow:'Фото є частиною анкети',photoInvalid:'Оберіть фото JPG, PNG або WEBP до 12 МБ.',successText:'Підтвердьте e-mail. Фото й дані автоматично з’являться у вашій анкеті.'},
  ru:{distance:'Радиус поиска',profilePhoto:'Ваша фотография',choosePhoto:'Выбрать фотографию',photoRequirement:'Актуальная фотография лица. JPG, PNG или WEBP.',photoNow:'Фотография входит в профиль',photoInvalid:'Выберите фотографию JPG, PNG или WEBP до 12 МБ.',successText:'Подтвердите e-mail. Фотография и данные автоматически появятся в вашем профиле.'},
  en:{distance:'Search radius',profilePhoto:'Your photo',choosePhoto:'Choose a photo',photoRequirement:'A current face photo. JPG, PNG or WEBP.',photoNow:'Photo included in profile',photoInvalid:'Choose a JPG, PNG or WEBP photo up to 12 MB.',successText:'Confirm your email. Your photo and details will then appear automatically in your profile.'}
};
Object.entries(shortPhotoCopy).forEach(([code,copy])=>Object.assign(t[code],copy));

const shared={navLabel:'Hlavní navigace',languageLabel:'Jazyk',proofLabel:'Princip DUONERA',howLabel:'DUONERA CITY CIRCLE',step1Title:'Řeknete jen to důležité',step1Text:'Kdo jste, koho hledáte, město, věk a jazyky.',step2Title:'Vybereme lidi poblíž',step2Text:'Bydliště a aktuální poloha zůstávají oddělené a soukromé.',step3Title:'Otevře se skutečné setkání',step3Text:'Kontakt až po vzájemném výběru. Žádné swipování.',closingLabel:'LUXURY JE KLID, SOUKROMÍ A POZORNOST',closingTitle:'Nejste položka v katalogu.',formKicker:'VÁŠ SOUKROMÝ VSTUP',successLabel:'VÍTEJTE V DUONERA'};
const sharedLocalized={
  de:{navLabel:'Hauptnavigation',languageLabel:'Sprache',proofLabel:'Das DUONERA-Prinzip',step1Title:'Nur das Wesentliche',step1Text:'Wer Sie sind, wen Sie suchen, Stadt, Alter und Sprachen.',step2Title:'Wir wählen Menschen in der Nähe',step2Text:'Wohnort und aktueller Standort bleiben getrennt und privat.',step3Title:'Ein echtes Treffen wird möglich',step3Text:'Kontakt erst nach gegenseitiger Wahl. Kein Swipen.',closingLabel:'LUXURY IST RUHE, PRIVATSPHÄRE UND AUFMERKSAMKEIT',closingTitle:'Sie sind kein Eintrag in einem Katalog.',formKicker:'IHR PRIVATER ZUGANG',successLabel:'WILLKOMMEN BEI DUONERA'},
  it:{navLabel:'Navigazione principale',languageLabel:'Lingua',proofLabel:'Il principio DUONERA',step1Title:'Solo ciò che conta',step1Text:'Chi sei, chi cerchi, città, età e lingue.',step2Title:'Selezioniamo persone vicine',step2Text:'Casa e posizione attuale restano separate e private.',step3Title:'Si apre un incontro reale',step3Text:'Contatto solo dopo una scelta reciproca. Niente swipe.',closingLabel:'LUXURY È CALMA, PRIVACY E ATTENZIONE',closingTitle:'Non sei una voce in un catalogo.',formKicker:'IL TUO ACCESSO PRIVATO',successLabel:'BENVENUTO IN DUONERA'},
  pl:{navLabel:'Główna nawigacja',languageLabel:'Język',proofLabel:'Zasada DUONERA',step1Title:'Tylko to, co ważne',step1Text:'Kim jesteś, kogo szukasz, miasto, wiek i języki.',step2Title:'Wybieramy osoby w pobliżu',step2Text:'Dom i bieżąca lokalizacja pozostają oddzielne i prywatne.',step3Title:'Otwiera się prawdziwe spotkanie',step3Text:'Kontakt dopiero po wzajemnym wyborze. Bez przesuwania.',closingLabel:'LUXURY TO SPOKÓJ, PRYWATNOŚĆ I UWAGA',closingTitle:'Nie jesteś pozycją w katalogu.',formKicker:'TWÓJ PRYWATNY WSTĘP',successLabel:'WITAJ W DUONERA'},
  sk:{navLabel:'Hlavná navigácia',languageLabel:'Jazyk',proofLabel:'Princíp DUONERA',step1Title:'Len to dôležité',step1Text:'Kto ste, koho hľadáte, mesto, vek a jazyky.',step2Title:'Vyberieme ľudí nablízku',step2Text:'Bydlisko a aktuálna poloha zostávajú oddelené a súkromné.',step3Title:'Otvorí sa skutočné stretnutie',step3Text:'Kontakt až po vzájomnom výbere. Bez swipovania.',closingLabel:'LUXURY JE POKOJ, SÚKROMIE A POZORNOSŤ',closingTitle:'Nie ste položka v katalógu.',formKicker:'VÁŠ SÚKROMNÝ VSTUP',successLabel:'VITAJTE V DUONERA'},
  en:{navLabel:'Main navigation',languageLabel:'Language',proofLabel:'The DUONERA principle',step1Title:'Only what matters',step1Text:'Who you are, who you seek, city, age and languages.',step2Title:'We select people nearby',step2Text:'Home and current location stay separate and private.',step3Title:'A real meeting opens',step3Text:'Contact only after mutual choice. No swiping.',closingLabel:'LUXURY IS CALM, PRIVACY AND ATTENTION',closingTitle:'You are not an item in a catalogue.',formKicker:'YOUR PRIVATE ENTRY',successLabel:'WELCOME TO DUONERA'},
  uk:{navLabel:'Головна навігація',languageLabel:'Мова',proofLabel:'Принцип DUONERA',step1Title:'Лише найважливіше',step1Text:'Хто ви, кого шукаєте, місто, вік і мови.',step2Title:'Ми обираємо людей поруч',step2Text:'Дім і поточна геолокація залишаються окремими та приватними.',step3Title:'Відкривається справжня зустріч',step3Text:'Контакт лише після взаємного вибору. Без свайпів.',closingLabel:'LUXURY — ЦЕ СПОКІЙ, ПРИВАТНІСТЬ І УВАГА',closingTitle:'Ви не пункт у каталозі.',formKicker:'ВАШ ПРИВАТНИЙ ВХІД',successLabel:'ЛАСКАВО ПРОСИМО ДО DUONERA'},
  ru:{navLabel:'Главная навигация',languageLabel:'Язык',proofLabel:'Принцип DUONERA',step1Title:'Только самое важное',step1Text:'Кто вы, кого ищете, город, возраст и языки.',step2Title:'Мы выбираем людей рядом',step2Text:'Дом и текущее местоположение остаются отдельными и приватными.',step3Title:'Открывается настоящая встреча',step3Text:'Контакт только после взаимного выбора. Без свайпов.',closingLabel:'LUXURY — ЭТО СПОКОЙСТВИЕ, ПРИВАТНОСТЬ И ВНИМАНИЕ',closingTitle:'Вы не пункт в каталоге.',formKicker:'ВАШ ПРИВАТНЫЙ ВХОД',successLabel:'ДОБРО ПОЖАЛОВАТЬ В DUONERA'}
};
Object.keys(t).forEach(key=>t[key]={...shared,...(sharedLocalized[key]||{}),...t[key]});
const settings={cs:{country:'Česko',city:'Praha',language:'Čeština'},de:{country:'Deutschland',city:'Berlin',language:'Deutsch'},it:{country:'Italia',city:'Roma',language:'Italiano'},pl:{country:'Polska',city:'Warszawa',language:'Polski'},sk:{country:'Slovensko',city:'Bratislava',language:'Slovenčina'},uk:{country:'Україна',city:'Київ',language:'Українська'},ru:{country:'Česko',city:'Praha',language:'Русский'},en:{country:'Europe',city:'London',language:'English'}};
const aliases={cs:'cs',cz:'cs',de:'de',at:'de',it:'it',pl:'pl',sk:'sk',uk:'uk',ua:'uk',ru:'ru',en:'en'};
const zoneLanguage={'Europe/Prague':'cs','Europe/Berlin':'de','Europe/Vienna':'de','Europe/Rome':'it','Europe/Warsaw':'pl','Europe/Bratislava':'sk','Europe/Kyiv':'uk'};
const countryLanguage={CZ:'cs',DE:'de',AT:'de',CH:'de',IT:'it',PL:'pl',SK:'sk',UA:'uk'};
const languageSelect=document.querySelector('[data-language]');
const dialog=document.querySelector('.register-dialog');
const form=document.querySelector('.register-form');
const toast=document.querySelector('.toast');
let active='cs';

function initialLanguage(){const params=new URLSearchParams(location.search);const query=aliases[params.get('lang')?.toLowerCase()];if(query)return query;const country=countryLanguage[String(params.get('country')||'').toUpperCase()];if(country)return country;try{const saved=aliases[localStorage.getItem('duonera-lang')];if(saved)return saved}catch(_){}const zone=Intl.DateTimeFormat().resolvedOptions().timeZone;if(zoneLanguage[zone])return zoneLanguage[zone];for(const value of navigator.languages||[navigator.language]){const code=aliases[String(value).toLowerCase().split('-')[0]];if(code)return code}return'cs'}
function applyLanguage(code){active=t[code]?code:'cs';const d=t[active];document.documentElement.lang=active;document.querySelectorAll('[data-i18n]').forEach(el=>{if(d[el.dataset.i18n])el.textContent=d[el.dataset.i18n]});document.querySelectorAll('[data-i18n-aria]').forEach(el=>{if(d[el.dataset.i18nAria])el.setAttribute('aria-label',d[el.dataset.i18nAria])});document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{if(d[el.dataset.i18nPlaceholder])el.placeholder=d[el.dataset.i18nPlaceholder]});languageSelect.value=active;document.querySelectorAll('[data-city]').forEach(el=>el.textContent=settings[active].city);document.querySelector('[data-country]').textContent=settings[active].country;try{localStorage.setItem('duonera-lang',active)}catch(_){}}
languageSelect.addEventListener('change',()=>applyLanguage(languageSelect.value));applyLanguage(initialLanguage());
const cookieCopy={cs:{cookieText:'Pomozte nám měřit, zda DUONERA funguje. Reklamní měření spustíme jen s vaším souhlasem.',cookieMore:'Více informací',cookieReject:'Jen nutné',cookieAccept:'Povolit měření'},de:{cookieText:'Helfen Sie uns zu messen, ob DUONERA funktioniert. Werbemessung startet nur mit Ihrer Zustimmung.',cookieMore:'Mehr erfahren',cookieReject:'Nur erforderlich',cookieAccept:'Messung erlauben'},it:{cookieText:'Aiutaci a misurare l’efficacia di DUONERA. La misurazione pubblicitaria inizierà solo con il tuo consenso.',cookieMore:'Maggiori informazioni',cookieReject:'Solo necessari',cookieAccept:'Consenti misurazione'},pl:{cookieText:'Pomóż nam mierzyć skuteczność DUONERA. Pomiar reklam uruchomimy tylko za Twoją zgodą.',cookieMore:'Więcej informacji',cookieReject:'Tylko niezbędne',cookieAccept:'Zezwól na pomiar'},sk:{cookieText:'Pomôžte nám merať, či DUONERA funguje. Meranie reklamy spustíme iba s vaším súhlasom.',cookieMore:'Viac informácií',cookieReject:'Iba nevyhnutné',cookieAccept:'Povoliť meranie'},uk:{cookieText:'Допоможіть нам виміряти ефективність DUONERA. Рекламне вимірювання почнеться лише з вашої згоди.',cookieMore:'Докладніше',cookieReject:'Лише необхідні',cookieAccept:'Дозволити вимірювання'},ru:{cookieText:'Помогите нам измерять эффективность DUONERA. Рекламное измерение начнётся только с вашего согласия.',cookieMore:'Подробнее',cookieReject:'Только необходимые',cookieAccept:'Разрешить измерение'},en:{cookieText:'Help us measure whether DUONERA works. Advertising measurement starts only with your consent.',cookieMore:'Learn more',cookieReject:'Essential only',cookieAccept:'Allow measurement'}};
Object.keys(cookieCopy).forEach(code=>Object.assign(t[code],cookieCopy[code]));
applyLanguage(active);
const trackingConsent=document.querySelector('.tracking-consent');
if(trackingConsent){try{if(!localStorage.getItem('duoneraMarketingConsent'))trackingConsent.hidden=false}catch(_){trackingConsent.hidden=false}trackingConsent.querySelector('.tracking-accept').addEventListener('click',()=>{try{localStorage.setItem('duoneraAnalyticsConsent','granted');localStorage.setItem('duoneraMarketingConsent','granted')}catch(_){}if(typeof gtag==='function')gtag('consent','update',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});if(typeof window.duoneraLoadMetaPixel==='function')window.duoneraLoadMetaPixel();trackingConsent.hidden=true});trackingConsent.querySelector('.tracking-reject').addEventListener('click',()=>{try{localStorage.setItem('duoneraAnalyticsConsent','denied');localStorage.setItem('duoneraMarketingConsent','denied')}catch(_){}trackingConsent.hidden=true})}
document.querySelectorAll('[data-open-register]').forEach(button=>button.addEventListener('click',()=>dialog.showModal()));document.querySelector('[data-close-register]').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>toast.classList.remove('show'),3800)}
form.addEventListener('input',event=>{event.target.classList.remove('invalid');event.target.closest('fieldset')?.classList.remove('invalid')});
const registrationPhoto=form.elements.photo;
const registrationPhotoPreview=form.querySelector('[data-photo-preview]');
const registrationPhotoPlaceholder=form.querySelector('[data-photo-placeholder]');
let preparedRegistrationPhoto=null;
let registrationPhotoUrl='';
let registrationPhotoPreparation=Promise.resolve();
registrationPhoto.addEventListener('change',()=>{
  registrationPhotoPreparation=(async()=>{
  preparedRegistrationPhoto=null;
  if(registrationPhotoUrl)URL.revokeObjectURL(registrationPhotoUrl);
  registrationPhotoPreview.hidden=true;
  registrationPhotoPlaceholder.hidden=false;
  const file=registrationPhoto.files?.[0];
  if(!file)return;
  try{
    preparedRegistrationPhoto=await compressProfilePhoto(file);
    registrationPhotoUrl=URL.createObjectURL(preparedRegistrationPhoto);
    registrationPhotoPreview.src=registrationPhotoUrl;
    registrationPhotoPreview.hidden=false;
    registrationPhotoPlaceholder.hidden=true;
  }catch(_){
    registrationPhoto.value='';
    showToast(t[active].photoInvalid);
  }
  })();
});
function validate(){form.querySelectorAll('.invalid').forEach(el=>el.classList.remove('invalid'));const invalid=[...form.elements].filter(el=>el.willValidate&&!el.checkValidity());invalid.forEach(el=>{const group=el.closest('fieldset');(group||el).classList.add('invalid')});if(invalid.length){invalid[0].focus();return false}if(!preparedRegistrationPhoto){registrationPhoto.classList.add('invalid');showToast(t[active].photoInvalid);return false}return true}
function gender(value){return value==='woman'?'Žena':'Muž'}function seeking(value){return value==='woman'?'Ženu':'Muže'}
form.addEventListener('submit',async event=>{
  event.preventDefault();
  await registrationPhotoPreparation;
  if(!validate())return;
  const data=new FormData(form);
  const id=createUuid();
  const params=new URLSearchParams(location.search);
  const profile={
    id,
    first_name:String(data.get('first_name')).trim(),
    age:Number(data.get('age')),
    gender:gender(data.get('gender')),
    looking_for:seeking(data.get('looking_for')),
    city:String(data.get('city')).trim(),
    country:settings[active].country,
    languages:[settings[active].language],
    email:String(data.get('email')).trim().toLowerCase(),
    preferred_distance_km:Number(data.get('distance')||50),
    consent_privacy:true,
    landing_language:active,
    attribution:{
      source:params.get('utm_source')||'direct',
      medium:params.get('utm_medium')||'',
      campaign:params.get('utm_campaign')||'',
      content:params.get('utm_content')||'',
      referrer:document.referrer||''
    },
    source:'duonera.cz/invitation'
  };
  const payload={id,gender:profile.gender,looking_for:profile.looking_for,age:profile.age,city:profile.city,email:profile.email,consent_privacy:true,source:profile.source};
  const button=form.querySelector('.form-submit');
  const label=button.querySelector('span');
  const original=label.textContent;
  const prototype=document.querySelector('meta[name=robots]')?.content.includes('noindex');
  try{
    button.disabled=true;
    label.textContent=t[active].submitting;
    let registration=null;
    if(prototype){
      await new Promise(resolve=>setTimeout(resolve,420));
    }else{
      await savePendingRegistrationPhoto(profile.email,preparedRegistrationPhoto);
      registration=await registerMember(profile.email,String(data.get('password')||''),`${location.origin}/ucet.html`,profile);
      try{
        await insertRow('duonera_leads',payload,20000);
      }catch(leadError){
        console.warn('DUONERA account created, but the lead row could not be saved',leadError);
      }
    }
    localStorage.setItem('duonera-short-registration',JSON.stringify(profile));
    localStorage.setItem('duonera-lead-id',id);
    if(!prototype&&registration?.user?.id){
      if(typeof gtag==='function'){
        gtag('event','generate_lead',{method:'duonera_invitation',campaign_source:profile.attribution.source,campaign_name:profile.attribution.campaign,landing_language:active,transport_type:'beacon'});
        gtag('event','sign_up',{method:'email_password',transport_type:'beacon'});
      }
      if(typeof fbq==='function')fbq('track','Lead',{content_name:'duonera_registration'});
    }
    document.querySelector('[data-success-name]').textContent=profile.first_name;
    const accountLink=document.querySelector('[data-account-after-registration]');
    accountLink.href=`ucet.html?mode=login&email=${encodeURIComponent(profile.email)}`;
    dialog.close();
    document.querySelector('.success').hidden=false;
  }catch(error){
    console.error(error);
    showToast(error?.code==='account_exists'?t[active].accountExists:t[active].registrationError);
  }finally{
    button.disabled=false;
    label.textContent=original;
  }
});

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/service-worker.js?v=50').catch(()=>{}))}
