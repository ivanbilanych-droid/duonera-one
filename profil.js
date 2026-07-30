import {
  PROFILE_PHOTO_BUCKET,
  createUuid,
  insertRow,
  uploadPrivateFile
} from './supabase-client.js?v=5';
import {
  callMemberRpc,
  memberRest,
  requireMemberSession
} from './member-auth.js?v=2';

const memberAuth = await requireMemberSession();
if(!memberAuth){
  location.replace('ucet.html?next=profil.html');
  throw new Error('Member authentication required');
}
try{
  await callMemberRpc('duonera_claim_registration');
}catch(error){
  console.warn('The earlier registration could not be attached automatically', error);
}
const existingProfiles = await memberRest(
  `duonera_profiles?select=id&user_id=eq.${encodeURIComponent(memberAuth.user.id)}&limit=1`
);
if(existingProfiles?.length){
  location.replace('ucet.html');
  throw new Error('Profile already exists');
}
const memberLeads = await memberRest(
  `duonera_leads?select=id&user_id=eq.${encodeURIComponent(memberAuth.user.id)}&order=created_at.desc&limit=1`
);
let memberLeadId = memberLeads?.[0]?.id || null;

const profileTranslations = {
  cs: {
    backHome:'Zpět na hlavní stránku',eyebrow:'VÁŠ SOUKROMÝ PROFIL',title:'Pomozte nám vybrat lidi, kteří se k vám opravdu hodí.',intro:'Čím přesněji profil vyplníte, tím kvalitnější bude váš osobní výběr. Vaše údaje nejsou veřejné a uvidí je pouze vybraní kandidáti.',promiseTitle:'Přibližně 8–10 minut',promiseText:'Rozpracovaný profil se automaticky ukládá v tomto zařízení.',journey:'VAŠE CESTA',step1:'Základní údaje',step1s:'Kdo jste a kde žijete',step2:'Životní styl',step2s:'Jak žijete každý den',step3:'Koho hledáte',step3s:'Vaše důležité preference',step4:'O vás',step4s:'Charakter, zájmy a hodnoty',step5:'Fotografie a souhlas',step5s:'Poslední krok',privateTitle:'Profil není veřejný',privateText:'Nezobrazujeme otevřený katalog. Váš profil uvidí pouze lidé, které pro vás systém vybere.',progressLabel:'PRŮBĚH PROFILU',progressStep:'Krok',s1label:'KROK 1',s1title:'Základní údaje',s1text:'Tyto informace potřebujeme pro základní výběr podle věku, města a toho, koho hledáte.',optionalNote:'Stačí vyplnit základní údaje. Ostatní položky můžete přeskočit a doplnit později.',firstName:'Křestní jméno',birthDate:'Datum narození',gender:'Jsem',seeking:'Hledám',choose:'Vyberte',chooseOptional:'Vyberte (volitelné)',man:'Muž',woman:'Žena',otherGender:'Jiné / nechci uvést',seekWoman:'Ženu',seekMan:'Muže',seekBoth:'Muže i ženy',country:'Země',city:'Město',email:'E-mail',phone:'Telefon',languages:'Jazyky, kterými se domluvíte',s2label:'KROK 2',s2title:'Váš životní styl',s2text:'Nejde o dokonalost. Potřebujeme pochopit váš běžný život, aby se k vám druhý člověk opravdu hodil.',height:'Výška (cm)',occupation:'Povolání / obor',education:'Vzdělání',relationshipStatus:'Rodinný stav',children:'Děti',pets:'Domácí zvířata',smoking:'Kouření',alcohol:'Alkohol',workRhythm:'Pracovní rytmus',weekend:'Ideální víkend',s3label:'KROK 3',s3title:'Koho chcete potkat',s3text:'Rozlišujeme pevné podmínky a přání. Díky tomu systém nevyloučí dobrého člověka kvůli nepodstatnému detailu.',ageFrom:'Věk od',ageTo:'Věk do',distance:'Max. vzdálenost',goal:'Cíl seznámení',partnerChildren:'Děti u partnera',partnerSmoking:'Kouření u partnera',relocation:'Stěhování / vztah na dálku',mustHave:'Tři vlastnosti, které jsou pro vás u partnera nejdůležitější',dealBreakers:'Co je pro vás nepřijatelné? (volitelné)',s4label:'KROK 4',s4title:'Co vás vystihuje',s4text:'Vyberte pouze to, co je vám skutečně blízké. Kvalitní výběr nevzniká z dokonalé ankety, ale z upřímné ankety.',character:'Jaký jste člověk? Vyberte maximálně 6 vlastností.',interests:'Vaše zájmy',aboutMe:'Napište krátce o sobě',relationshipVision:'Jak si představujete dobrý vztah?',s5label:'KROK 5',s5title:'Fotografie a dokončení profilu',s5text:'Fotografie jsou volitelné. Pokud je nahrajete, použijte aktuální snímky, na kterých jste dobře vidět.',uploadTitle:'Vyberte až 3 fotografie (volitelné)',uploadText:'JPG, PNG nebo WEBP. Celková velikost maximálně 10 MB.',choosePhotos:'Vybrat fotografie',adultConsent:'Potvrzuji, že mi je nejméně 18 let.',dataConsent:'Výslovně souhlasím se zpracováním údajů z této ankety a fotografií za účelem vytvoření soukromého profilu a výběru vhodných kandidátů.',termsConsent:'Souhlasím s',termsLink:'podmínkami služby',andWord:'a',privacyLink:'ochranou soukromí',truthConsent:'Potvrzuji, že uvedené údaje a případné fotografie jsou pravdivé a patří mně.',finalTitle:'Po odeslání profil zkontrolujeme technicky.',finalText:'Po kontrole profilu vás budeme kontaktovat, jakmile pro vás připravíme vhodný soukromý výběr.',back:'Zpět',saved:'Uloženo v tomto zařízení',continue:'Pokračovat',submitProfile:'Odeslat profil',footer:'Soukromí. Kvalitní výběr. Skutečné setkání.',validation:'Prosím doplňte označené povinné údaje.',ageValidation:'Věk „od“ nemůže být vyšší než věk „do“.',photoValidation:'Můžete nahrát nejvýše 3 fotografie o celkové velikosti maximálně 10 MB.',maxChoices:'Můžete vybrat maximálně 6 vlastností.',sending:'Odesílám profil…'
  },
  en: {
    backHome:'Back to home',eyebrow:'YOUR PRIVATE PROFILE',title:'Help us select people who truly fit you.',intro:'The more accurately you complete your profile, the better your personal selection will be. Your data is not public and will only be shown to selected candidates.',promiseTitle:'About 8–10 minutes',promiseText:'Your draft is saved automatically on this device.',journey:'YOUR JOURNEY',step1:'Basic details',step1s:'Who you are and where you live',step2:'Lifestyle',step2s:'How you live every day',step3:'Who you seek',step3s:'Your important preferences',step4:'About you',step4s:'Character, interests and values',step5:'Photos and consent',step5s:'Final step',privateTitle:'Your profile is not public',privateText:'There is no open catalogue. Only people selected for you will see your profile.',progressLabel:'PROFILE PROGRESS',progressStep:'Step',s1label:'STEP 1',s1title:'Basic details',s1text:'We need these details for the initial selection by age, location and who you are looking for.',optionalNote:'Only the basic details are required. You can skip the other fields and complete them later.',firstName:'First name',birthDate:'Date of birth',gender:'I am',seeking:'I am looking for',choose:'Choose',chooseOptional:'Choose (optional)',man:'Man',woman:'Woman',otherGender:'Other / prefer not to say',seekWoman:'A woman',seekMan:'A man',seekBoth:'Men and women',country:'Country',city:'City',email:'Email',phone:'Phone',languages:'Languages you speak',s2label:'STEP 2',s2title:'Your lifestyle',s2text:'This is not about perfection. We need to understand your everyday life so the other person can truly fit you.',height:'Height (cm)',occupation:'Occupation / field',education:'Education',relationshipStatus:'Relationship status',children:'Children',pets:'Pets',smoking:'Smoking',alcohol:'Alcohol',workRhythm:'Work rhythm',weekend:'Ideal weekend',s3label:'STEP 3',s3title:'Who you want to meet',s3text:'We distinguish firm requirements from preferences, so a good person is not excluded over an unimportant detail.',ageFrom:'Age from',ageTo:'Age to',distance:'Maximum distance',goal:'Relationship goal',partnerChildren:'Partner’s children',partnerSmoking:'Partner’s smoking',relocation:'Relocation / long distance',mustHave:'Three qualities that matter most to you in a partner',dealBreakers:'What is unacceptable to you? (optional)',s4label:'STEP 4',s4title:'What describes you',s4text:'Choose only what is truly close to you. A quality match comes from an honest profile, not a perfect one.',character:'What are you like? Choose up to 6 qualities.',interests:'Your interests',aboutMe:'Write briefly about yourself',relationshipVision:'What does a good relationship look like to you?',s5label:'STEP 5',s5title:'Photos and profile completion',s5text:'Photos are optional. If you upload them, use recent images where you are clearly visible.',uploadTitle:'Choose up to 3 photos (optional)',uploadText:'JPG, PNG or WEBP. Maximum total size 10 MB.',choosePhotos:'Choose photos',adultConsent:'I confirm that I am at least 18 years old.',dataConsent:'I explicitly consent to the processing of the profile data and photos for creating a private profile and selecting suitable candidates.',termsConsent:'I agree to the',termsLink:'terms of service',andWord:'and',privacyLink:'privacy policy',truthConsent:'I confirm that the information and any uploaded photos are true and belong to me.',finalTitle:'After submission, the profile will be checked technically.',finalText:'After reviewing your profile, we will contact you as soon as we prepare a suitable private selection for you.',back:'Back',saved:'Saved on this device',continue:'Continue',submitProfile:'Submit profile',footer:'Privacy. Quality selection. A real meeting.',validation:'Please complete the highlighted required fields.',ageValidation:'The “from” age cannot be greater than the “to” age.',photoValidation:'You may upload up to 3 photos with a total size up to 10 MB.',maxChoices:'You can choose up to 6 qualities.',sending:'Submitting profile…'
  },
  de: {
    backHome:'Zur Startseite',eyebrow:'IHR PRIVATES PROFIL',title:'Helfen Sie uns, Menschen auszuwählen, die wirklich zu Ihnen passen.',intro:'Je genauer Sie Ihr Profil ausfüllen, desto besser wird Ihre persönliche Auswahl. Ihre Daten sind nicht öffentlich und werden nur ausgewählten Kandidatinnen und Kandidaten gezeigt.',promiseTitle:'Etwa 8–10 Minuten',promiseText:'Ihr Entwurf wird automatisch auf diesem Gerät gespeichert.',journey:'IHR WEG',step1:'Grundangaben',step1s:'Wer Sie sind und wo Sie leben',step2:'Lebensstil',step2s:'Wie Sie Ihren Alltag gestalten',step3:'Wen Sie suchen',step3s:'Ihre wichtigen Wünsche',step4:'Über Sie',step4s:'Charakter, Interessen und Werte',step5:'Fotos und Einwilligung',step5s:'Letzter Schritt',privateTitle:'Ihr Profil ist nicht öffentlich',privateText:'Es gibt keinen offenen Katalog. Ihr Profil sehen nur Menschen, die für Sie ausgewählt wurden.',progressLabel:'PROFILFORTSCHRITT',progressStep:'Schritt',
    s1label:'SCHRITT 1',s1title:'Grundangaben',s1text:'Diese Angaben benötigen wir für die erste Auswahl nach Alter, Ort und der Person, die Sie suchen.',optionalNote:'Nur die Grundangaben sind erforderlich. Die übrigen Felder können Sie überspringen und später ergänzen.',firstName:'Vorname',birthDate:'Geburtsdatum',gender:'Ich bin',seeking:'Ich suche',choose:'Auswählen',chooseOptional:'Auswählen (optional)',man:'Mann',woman:'Frau',otherGender:'Divers / keine Angabe',seekWoman:'Eine Frau',seekMan:'Einen Mann',seekBoth:'Frauen und Männer',country:'Land',city:'Stadt',email:'E-Mail',phone:'Telefon',languages:'Sprachen, die Sie sprechen',
    s2label:'SCHRITT 2',s2title:'Ihr Lebensstil',s2text:'Es geht nicht um Perfektion. Wir möchten Ihren Alltag verstehen, damit die andere Person wirklich zu Ihnen passt.',height:'Körpergröße (cm)',occupation:'Beruf / Bereich',education:'Ausbildung',relationshipStatus:'Beziehungsstatus',children:'Kinder',pets:'Haustiere',smoking:'Rauchen',alcohol:'Alkohol',workRhythm:'Arbeitsrhythmus',weekend:'Ideales Wochenende',
    s3label:'SCHRITT 3',s3title:'Wen Sie kennenlernen möchten',s3text:'Wir unterscheiden feste Anforderungen von Wünschen, damit ein guter Mensch nicht wegen eines unwichtigen Details ausgeschlossen wird.',ageFrom:'Alter von',ageTo:'Alter bis',distance:'Maximale Entfernung',goal:'Beziehungsziel',partnerChildren:'Kinder der Partnerperson',partnerSmoking:'Rauchen der Partnerperson',relocation:'Umzug / Fernbeziehung',mustHave:'Drei Eigenschaften, die Ihnen bei einer Partnerperson am wichtigsten sind',dealBreakers:'Was ist für Sie nicht akzeptabel? (optional)',
    s4label:'SCHRITT 4',s4title:'Was Sie beschreibt',s4text:'Wählen Sie nur, was wirklich zu Ihnen passt. Eine gute Auswahl beginnt mit einem ehrlichen Profil.',character:'Wie sind Sie? Wählen Sie bis zu 6 Eigenschaften.',interests:'Ihre Interessen',aboutMe:'Beschreiben Sie sich kurz',relationshipVision:'Wie sieht für Sie eine gute Beziehung aus?',
    s5label:'SCHRITT 5',s5title:'Fotos und Profilabschluss',s5text:'Fotos sind optional. Wenn Sie Fotos hochladen, verwenden Sie aktuelle Bilder, auf denen Sie gut zu erkennen sind.',uploadTitle:'Bis zu 3 Fotos auswählen (optional)',uploadText:'JPG, PNG oder WEBP. Gesamtgröße maximal 10 MB.',choosePhotos:'Fotos auswählen',adultConsent:'Ich bestätige, dass ich mindestens 18 Jahre alt bin.',dataConsent:'Ich willige ausdrücklich in die Verarbeitung meiner Profildaten und Fotos zur Erstellung eines privaten Profils und zur Auswahl geeigneter Kandidatinnen und Kandidaten ein.',termsConsent:'Ich akzeptiere die',termsLink:'Nutzungsbedingungen',andWord:'und die',privacyLink:'Datenschutzbestimmungen',truthConsent:'Ich bestätige, dass die Angaben wahr sind und die hochgeladenen Fotos mich zeigen und mir gehören.',finalTitle:'Nach dem Absenden wird Ihr Profil technisch geprüft.',finalText:'Nach der Prüfung Ihres Profils kontaktieren wir Sie, sobald wir eine passende private Auswahl für Sie vorbereitet haben.',back:'Zurück',saved:'Auf diesem Gerät gespeichert',continue:'Weiter',submitProfile:'Profil absenden',footer:'Privatsphäre. Hochwertige Auswahl. Ein echtes Treffen.',validation:'Bitte füllen Sie die markierten Pflichtfelder aus.',ageValidation:'Das Mindestalter darf nicht höher als das Höchstalter sein.',photoValidation:'Sie können bis zu 3 Fotos mit einer Gesamtgröße von maximal 10 MB hochladen.',maxChoices:'Sie können höchstens 6 Eigenschaften auswählen.',sending:'Profil wird gesendet…'
  },
  uk: {
    backHome:'На головну',eyebrow:'ВАША ПРИВАТНА АНКЕТА',title:'Допоможіть нам підібрати людей, які справді вам підходять.',intro:'Чим точніше ви заповните анкету, тим якіснішою буде персональна добірка. Ваші дані не є публічними, їх побачать лише підібрані кандидати.',promiseTitle:'Приблизно 8–10 хвилин',promiseText:'Чернетка автоматично зберігається на цьому пристрої.',journey:'ВАШ ШЛЯХ',step1:'Основні дані',step1s:'Хто ви і де живете',step2:'Стиль життя',step2s:'Як проходить ваш день',step3:'Кого шукаєте',step3s:'Важливі побажання',step4:'Про вас',step4s:'Характер, інтереси та цінності',step5:'Фото та згода',step5s:'Останній крок',privateTitle:'Анкета не є публічною',privateText:'Відкритого каталогу немає. Вашу анкету побачать лише люди, яких система підбере для вас.',progressLabel:'ЗАПОВНЕННЯ АНКЕТИ',progressStep:'Крок',s1label:'КРОК 1',s1title:'Основні дані',s1text:'Ці дані потрібні для початкового підбору за віком, містом та вашими побажаннями.',optionalNote:'Достатньо заповнити основні дані. Інші поля можна пропустити й доповнити пізніше.',firstName:'Ім’я',birthDate:'Дата народження',gender:'Я',seeking:'Шукаю',choose:'Оберіть',chooseOptional:'Оберіть (необов’язково)',man:'Чоловік',woman:'Жінка',otherGender:'Інше / не хочу вказувати',seekWoman:'Жінку',seekMan:'Чоловіка',seekBoth:'Чоловіків і жінок',country:'Країна',city:'Місто',email:'E-mail',phone:'Телефон',languages:'Мови, якими ви володієте',s2label:'КРОК 2',s2title:'Ваш стиль життя',s2text:'Йдеться не про досконалість. Нам потрібно зрозуміти ваше щоденне життя, щоб інша людина справді вам підходила.',height:'Зріст (см)',occupation:'Професія / сфера',education:'Освіта',relationshipStatus:'Сімейний стан',children:'Діти',pets:'Домашні тварини',smoking:'Куріння',alcohol:'Алкоголь',workRhythm:'Робочий ритм',weekend:'Ідеальні вихідні',s3label:'КРОК 3',s3title:'Кого ви хочете зустріти',s3text:'Ми розрізняємо обов’язкові умови та побажання, щоб не виключити хорошу людину через несуттєву деталь.',ageFrom:'Вік від',ageTo:'Вік до',distance:'Максимальна відстань',goal:'Мета знайомства',partnerChildren:'Діти партнера',partnerSmoking:'Куріння партнера',relocation:'Переїзд / відстань',mustHave:'Три найважливіші якості партнера',dealBreakers:'Що для вас неприйнятно? (необов’язково)',s4label:'КРОК 4',s4title:'Що вас характеризує',s4text:'Оберіть лише те, що вам справді близьке. Якісний підбір починається з чесної анкети.',character:'Яка ви людина? Оберіть до 6 якостей.',interests:'Ваші інтереси',aboutMe:'Коротко напишіть про себе',relationshipVision:'Якими ви бачите добрі стосунки?',s5label:'КРОК 5',s5title:'Фотографії та завершення',s5text:'Фотографії необов’язкові. Якщо завантажуєте їх, оберіть актуальні фото, на яких вас добре видно.',uploadTitle:'Оберіть до 3 фото (необов’язково)',uploadText:'JPG, PNG або WEBP. Загальний розмір до 10 МБ.',choosePhotos:'Обрати фото',adultConsent:'Підтверджую, що мені виповнилося 18 років.',dataConsent:'Я прямо погоджуюся на обробку даних анкети та фотографій для створення приватного профілю і підбору відповідних кандидатів.',termsConsent:'Погоджуюся з',termsLink:'умовами сервісу',andWord:'та',privacyLink:'політикою конфіденційності',truthConsent:'Підтверджую, що дані та завантажені фотографії правдиві й належать мені.',finalTitle:'Після надсилання ми технічно перевіримо анкету.',finalText:'Після перевірки анкети ми зв’яжемося з вами, щойно підготуємо відповідну приватну добірку.',back:'Назад',saved:'Збережено на цьому пристрої',continue:'Продовжити',submitProfile:'Надіслати анкету',footer:'Приватність. Якісний вибір. Справжня зустріч.',validation:'Заповніть позначені обов’язкові поля.',ageValidation:'Вік «від» не може бути більшим за вік «до».',photoValidation:'Можна завантажити до 3 фото загальним розміром до 10 МБ.',maxChoices:'Можна обрати максимум 6 якостей.',sending:'Надсилаємо анкету…'
  },
  ru: {
    backHome:'На главную',eyebrow:'ВАША ЗАКРЫТАЯ АНКЕТА',title:'Помогите нам подобрать людей, которые действительно вам подходят.',intro:'Чем точнее заполнена анкета, тем качественнее будет персональная подборка. Ваши данные не публикуются, их увидят только выбранные кандидаты.',promiseTitle:'Примерно 8–10 минут',promiseText:'Черновик автоматически сохраняется на этом устройстве.',journey:'ВАШ ПУТЬ',step1:'Основные данные',step1s:'Кто вы и где живёте',step2:'Образ жизни',step2s:'Как проходит ваш день',step3:'Кого вы ищете',step3s:'Важные предпочтения',step4:'О вас',step4s:'Характер, интересы и ценности',step5:'Фото и согласие',step5s:'Последний шаг',privateTitle:'Анкета не публичная',privateText:'Открытого каталога нет. Вашу анкету увидят только люди, которых система подберёт для вас.',progressLabel:'ЗАПОЛНЕНИЕ АНКЕТЫ',progressStep:'Шаг',s1label:'ШАГ 1',s1title:'Основные данные',s1text:'Эти данные нужны для начального подбора по возрасту, городу и вашим пожеланиям.',optionalNote:'Достаточно заполнить основные данные. Остальные поля можно пропустить и дополнить позже.',firstName:'Имя',birthDate:'Дата рождения',gender:'Я',seeking:'Ищу',choose:'Выберите',chooseOptional:'Выберите (необязательно)',man:'Мужчина',woman:'Женщина',otherGender:'Другое / не хочу указывать',seekWoman:'Женщину',seekMan:'Мужчину',seekBoth:'Мужчин и женщин',country:'Страна',city:'Город',email:'E-mail',phone:'Телефон',languages:'Языки, на которых вы говорите',s2label:'ШАГ 2',s2title:'Ваш образ жизни',s2text:'Речь не об идеальности. Нам важно понять вашу обычную жизнь, чтобы другой человек действительно вам подходил.',height:'Рост (см)',occupation:'Профессия / сфера',education:'Образование',relationshipStatus:'Семейное положение',children:'Дети',pets:'Домашние животные',smoking:'Курение',alcohol:'Алкоголь',workRhythm:'Рабочий ритм',weekend:'Идеальные выходные',s3label:'ШАГ 3',s3title:'Кого вы хотите встретить',s3text:'Мы разделяем обязательные условия и пожелания, чтобы не исключить хорошего человека из-за несущественной детали.',ageFrom:'Возраст от',ageTo:'Возраст до',distance:'Максимальное расстояние',goal:'Цель знакомства',partnerChildren:'Дети у партнёра',partnerSmoking:'Курение партнёра',relocation:'Переезд / расстояние',mustHave:'Три самых важных качества партнёра',dealBreakers:'Что для вас неприемлемо? (необязательно)',s4label:'ШАГ 4',s4title:'Что вас характеризует',s4text:'Выберите только то, что вам действительно близко. Качественный подбор начинается с честной анкеты.',character:'Какой вы человек? Выберите до 6 качеств.',interests:'Ваши интересы',aboutMe:'Коротко напишите о себе',relationshipVision:'Какими вы видите хорошие отношения?',s5label:'ШАГ 5',s5title:'Фотографии и завершение',s5text:'Фотографии необязательны. Если вы их загружаете, выберите актуальные снимки, на которых вас хорошо видно.',uploadTitle:'Выберите до 3 фотографий (необязательно)',uploadText:'JPG, PNG или WEBP. Общий размер до 10 МБ.',choosePhotos:'Выбрать фотографии',adultConsent:'Подтверждаю, что мне исполнилось 18 лет.',dataConsent:'Я прямо соглашаюсь на обработку данных анкеты и фотографий для создания закрытого профиля и подбора подходящих кандидатов.',termsConsent:'Согласен с',termsLink:'условиями сервиса',andWord:'и',privacyLink:'политикой конфиденциальности',truthConsent:'Подтверждаю, что данные и загруженные фотографии правдивы и принадлежат мне.',finalTitle:'После отправки мы технически проверим анкету.',finalText:'После проверки анкеты мы свяжемся с вами, как только подготовим подходящую закрытую подборку.',back:'Назад',saved:'Сохранено на этом устройстве',continue:'Продолжить',submitProfile:'Отправить анкету',footer:'Приватность. Качественный выбор. Настоящая встреча.',validation:'Заполните отмеченные обязательные поля.',ageValidation:'Возраст «от» не может быть больше возраста «до».',photoValidation:'Можно загрузить до 3 фотографий общим размером до 10 МБ.',maxChoices:'Можно выбрать максимум 6 качеств.',sending:'Отправляем анкету…'
  }
};

const profileProcessTranslations = {
  cs:{
    privateTitle:'Kontakty zůstávají soukromé',
    privateText:'Po vašem souhlasu a kontrole může omezená část profilu pomoci ostatním, aby vás našli. E-mail ani kontaktní údaje se nezobrazují.',
    intro:'Čím přesněji profil vyplníte, tím kvalitnější budou vaše výběry. V osobním účtu uvidíte vlastní anketu, fotografie i lidi, které jste označili.',
    dataConsent:'Výslovně souhlasím se zpracováním údajů a fotografií pro vytvoření mého účtu, výběr vhodných kandidátů a organizaci případné schůzky.',
    discoveryConsent:'Souhlasím, aby po kontrole DUONERA mohly být moje křestní jméno, věk, město, vybrané údaje a fotografie zobrazeny v omezené nabídce. Kontaktní údaje se nezobrazí.',
    finalTitle:'Po odeslání uvidíte profil ve svém osobním účtu.',
    finalText:'DUONERA profil zkontroluje. Teprve po schválení se může zobrazit v omezeném výběru.'
  },
  en:{
    privateTitle:'Your contact details remain private',
    privateText:'With your consent and after review, a limited part of your profile may help others find you. Email and contact details are never displayed.',
    intro:'The more accurately you complete your profile, the better your selections. Your account shows your own profile, photos and the people you selected.',
    dataConsent:'I explicitly consent to the processing of my details and photos to create my account, select suitable candidates and arrange a possible meeting.',
    discoveryConsent:'I agree that, after DUONERA review, my first name, age, city, selected profile details and photos may appear in the limited selection. Contact details will not be displayed.',
    finalTitle:'After submission, your profile appears in your personal account.',
    finalText:'DUONERA reviews the profile. It may enter the limited selection only after approval.'
  },
  de:{
    privateTitle:'Ihre Kontaktdaten bleiben privat',
    privateText:'Mit Ihrer Zustimmung und nach Prüfung kann ein begrenzter Teil Ihres Profils anderen helfen, Sie zu finden. E-Mail und Kontaktdaten werden nie angezeigt.',
    intro:'Je genauer Sie Ihr Profil ausfüllen, desto besser werden Ihre Vorschläge. In Ihrem Konto sehen Sie Ihr Profil, Ihre Fotos und Ihre Auswahl.',
    dataConsent:'Ich willige ausdrücklich in die Verarbeitung meiner Angaben und Fotos ein, um mein Konto zu erstellen, passende Personen auszuwählen und ein mögliches Treffen zu organisieren.',
    discoveryConsent:'Ich stimme zu, dass nach der Prüfung durch DUONERA mein Vorname, Alter, Ort, ausgewählte Profildaten und Fotos in der begrenzten Auswahl erscheinen dürfen. Kontaktdaten werden nicht angezeigt.',
    finalTitle:'Nach dem Absenden sehen Sie Ihr Profil in Ihrem persönlichen Konto.',
    finalText:'DUONERA prüft das Profil. Erst nach der Freigabe kann es in der begrenzten Auswahl erscheinen.'
  },
  uk:{
    privateTitle:'Ваші контактні дані залишаються приватними',
    privateText:'Після вашої згоди та перевірки обмежена частина анкети може допомогти іншим знайти вас. E-mail і контакти не показуються.',
    intro:'Чим точніше ви заповните анкету, тим кращими будуть добірки. У кабінеті ви бачите власну анкету, фотографії та обраних людей.',
    dataConsent:'Я прямо погоджуюся на обробку даних і фотографій для створення мого кабінету, добору відповідних кандидатів та організації можливої зустрічі.',
    discoveryConsent:'Я погоджуюся, що після перевірки DUONERA моє ім’я, вік, місто, вибрані дані анкети та фотографії можуть бути показані в обмеженій добірці. Контактні дані не показуються.',
    finalTitle:'Після надсилання анкета з’явиться у вашому особистому кабінеті.',
    finalText:'DUONERA перевірить анкету. Лише після схвалення вона може з’явитися в обмеженій добірці.'
  },
  ru:{
    privateTitle:'Ваши контактные данные остаются закрытыми',
    privateText:'После вашего согласия и проверки ограниченная часть анкеты может помочь другим найти вас. E-mail и контакты не показываются.',
    intro:'Чем точнее заполнена анкета, тем лучше будут подборки. В личном кабинете вы видите свою анкету, фотографии и выбранных людей.',
    dataConsent:'Я прямо соглашаюсь на обработку данных и фотографий для создания моего кабинета, подбора подходящих кандидатов и организации возможной встречи.',
    discoveryConsent:'Я согласен, что после проверки DUONERA моё имя, возраст, город, выбранные данные анкеты и фотографии могут показываться в ограниченной подборке. Контактные данные не показываются.',
    finalTitle:'После отправки анкета появится в вашем личном кабинете.',
    finalText:'DUONERA проверит анкету. Только после одобрения она может появиться в ограниченной подборке.'
  }
};
Object.entries(profileProcessTranslations).forEach(([language,values])=>{
  Object.assign(profileTranslations[language],values);
});

const form = document.getElementById('fullProfileForm');
const steps = [...document.querySelectorAll('.form-step')];
const indicators = [...document.querySelectorAll('[data-step-indicator]')];
const prevButton = document.getElementById('prevStep');
const nextButton = document.getElementById('nextStep');
const submitButton = document.getElementById('submitProfile');
const actions = document.querySelector('.form-actions');
const currentStepLabel = document.getElementById('currentStep');
const progressPercent = document.getElementById('progressPercent');
const progressBar = document.getElementById('progressBar');
const message = document.getElementById('formMessage');
const photoInput = document.getElementById('photos');
const photoPreviews = document.getElementById('photoPreviews');
const choosePhotos = document.getElementById('choosePhotos');
const draftKey = 'duonera-profile-draft';
let currentStep = 0;
let currentLang = localStorage.getItem('duonera-lang') || 'cs';
let saveTimer;

function t(key){ return (profileTranslations[currentLang] || profileTranslations.cs)[key] || profileTranslations.cs[key] || key; }
function setLanguage(lang){
  currentLang = profileTranslations[lang] ? lang : 'cs';
  document.documentElement.lang = currentLang === 'uk' ? 'uk' : currentLang;
  document.querySelectorAll('[data-i18n]').forEach(el=>{ const value=t(el.dataset.i18n); if(value) el.textContent=value; });
  document.querySelectorAll('[data-lang]').forEach(btn=>btn.classList.toggle('active',btn.dataset.lang===currentLang));
  localStorage.setItem('duonera-lang',currentLang);
  markOptionalLabels();
}
function markOptionalLabels(){
  const optionalNames = new Set([
    'Výška','Povolání','Vzdělání','Rodinný stav','Děti','Domácí zvířata',
    'Kouření','Alkohol','Pracovní rytmus','Ideální víkend','Hledaný věk od','Hledaný věk do',
    'Maximální vzdálenost','Cíl seznámení','Děti u partnera','Kouření u partnera',
    'Stěhování a vzdálenost','Nejdůležitější vlastnosti partnera',
    'O mně','Představa o vztahu'
  ]);
  const suffix = currentLang==='cs' ? ' — volitelné' : currentLang==='en' ? ' — optional' : currentLang==='de' ? ' — optional' : currentLang==='uk' ? ' — необов’язково' : ' — необязательно';
  form.querySelectorAll('input[name], select[name], textarea[name]').forEach(input=>{
    if(!optionalNames.has(input.name)) return;
    const label=input.closest('.field');
    const title=label?.querySelector(':scope > span');
    if(!title) return;
    title.textContent=title.textContent.replace(/\s—\s(volitelné|optional|необов’язково|необязательно)$/u,'')+suffix;
  });
}

document.querySelectorAll('[data-lang]').forEach(btn=>btn.addEventListener('click',()=>setLanguage(btn.dataset.lang)));
setLanguage(currentLang);

document.getElementById('year').textContent = new Date().getFullYear();

function showMessage(text){
  message.textContent = text;
  message.classList.add('show');
  clearTimeout(window.__profileMessage);
  window.__profileMessage = setTimeout(()=>message.classList.remove('show'),3200);
}

function updateStep(){
  steps.forEach((step,index)=>step.classList.toggle('active',index===currentStep));
  indicators.forEach((item,index)=>{
    item.classList.toggle('active',index===currentStep);
    item.classList.toggle('done',index<currentStep);
  });
  const percent = Math.round(((currentStep+1)/steps.length)*100);
  currentStepLabel.textContent = currentStep+1;
  progressPercent.textContent = `${percent} %`;
  progressBar.style.width = `${percent}%`;
  prevButton.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
  actions.classList.toggle('final',currentStep === steps.length-1);
  window.scrollTo({top:Math.max(0,document.querySelector('.profile-workspace').offsetTop-95),behavior:'smooth'});
}

function validateCurrentStep(){
  const required = [...steps[currentStep].querySelectorAll('[required]')];
  let valid = true;
  required.forEach(input=>{
    const inputValid = input.type === 'checkbox' ? input.checked : input.checkValidity();
    input.classList.toggle('invalid',!inputValid);
    if(!inputValid) valid=false;
  });
  if(currentStep===2){
    const from = Number(document.getElementById('ageFrom').value);
    const to = Number(document.getElementById('ageTo').value);
    if(from && to && from>to){ showMessage(t('ageValidation')); return false; }
  }
  if(currentStep===4 && !validatePhotos(false)) valid=false;
  if(!valid) showMessage(t('validation'));
  return valid;
}

nextButton.addEventListener('click',()=>{
  if(!validateCurrentStep()) return;
  currentStep = Math.min(steps.length-1,currentStep+1);
  updateStep();
});
prevButton.addEventListener('click',()=>{ currentStep=Math.max(0,currentStep-1);updateStep(); });

form.addEventListener('input',event=>{
  event.target.classList.remove('invalid');
  updateCharacterCount(event.target);
  scheduleSave();
});
form.addEventListener('change',event=>{
  event.target.classList.remove('invalid');
  scheduleSave();
});

function serializeDraft(){
  const draft={};
  [...form.elements].forEach(el=>{
    if(!el.name || el.type==='file' || el.name.startsWith('_')) return;
    if(el.type==='checkbox'){
      if(!draft[el.name]) draft[el.name]=[];
      if(el.checked) draft[el.name].push(el.value || 'Ano');
    } else if(el.type==='radio'){
      if(el.checked) draft[el.name]=el.value;
    } else draft[el.name]=el.value;
  });
  return draft;
}
function scheduleSave(){
  clearTimeout(saveTimer);
  document.getElementById('saveDot').style.background='#c09133';
  saveTimer=setTimeout(()=>{
    localStorage.setItem(draftKey,JSON.stringify(serializeDraft()));
    document.getElementById('saveDot').style.background='#58a36c';
    document.getElementById('saveText').textContent=t('saved');
  },450);
}
function restoreDraft(){
  let draft={};
  try{ draft=JSON.parse(localStorage.getItem(draftKey)||'{}'); }catch(e){}
  let short={};
  try{ short=JSON.parse(localStorage.getItem('duonera-short-registration')||'{}'); }catch(e){}
  if(short.email && !draft.email) draft.email=short.email;
  if(short.Město && !draft.Město) draft.Město=short.Město;
  if(short.Jsem && !draft.Jsem) draft.Jsem=short.Jsem;
  if(short.Hledám && !draft.Hledám) draft.Hledám=short.Hledám;
  [...form.elements].forEach(el=>{
    if(!el.name || !(el.name in draft)) return;
    const value=draft[el.name];
    if(el.type==='checkbox') el.checked=Array.isArray(value)&&value.includes(el.value||'Ano');
    else if(el.type!=='file') el.value=value;
    updateCharacterCount(el);
  });
}

function updateCharacterCount(el){
  if(el.tagName!=='TEXTAREA') return;
  const counter=el.parentElement.querySelector('.char-count span');
  if(counter) counter.textContent=el.value.length;
}

document.querySelectorAll('.choice-grid[data-max]').forEach(group=>{
  group.addEventListener('change',event=>{
    const max=Number(group.dataset.max);
    const checked=[...group.querySelectorAll('input:checked')];
    if(checked.length>max){event.target.checked=false;showMessage(t('maxChoices'));}
  });
});

choosePhotos.addEventListener('click',event=>{event.preventDefault();photoInput.click();});
let selectedPhotos = [];

photoInput.addEventListener('change',()=>{
  const incoming = [...photoInput.files];
  const known = new Set(selectedPhotos.map(file=>`${file.name}:${file.size}:${file.lastModified}`));
  const merged = [...selectedPhotos];

  incoming.forEach(file=>{
    const key = `${file.name}:${file.size}:${file.lastModified}`;
    if(!known.has(key)){
      known.add(key);
      merged.push(file);
    }
  });

  const total = merged.reduce((sum,file)=>sum+file.size,0);
  if(merged.length>3 || total>10*1024*1024){
    syncPhotoInput();
    validatePhotos(true);
    return;
  }

  selectedPhotos = merged;
  syncPhotoInput();
  validatePhotos(false);
  renderPhotoPreviews();
});

function syncPhotoInput(){
  const transfer = new DataTransfer();
  selectedPhotos.forEach(file=>transfer.items.add(file));
  photoInput.files = transfer.files;
}

function validatePhotos(show=true){
  const total=selectedPhotos.reduce((sum,file)=>sum+file.size,0);
  const valid=selectedPhotos.length<=3&&total<=10*1024*1024;
  photoInput.classList.toggle('invalid',!valid);
  if(!valid&&show) showMessage(t('photoValidation'));
  return valid;
}

function renderPhotoPreviews(){
  photoPreviews.innerHTML='';
  selectedPhotos.forEach((file,index)=>{
    const item=document.createElement('div');
    item.className='photo-preview';
    const reader=new FileReader();
    reader.onload=()=>item.style.backgroundImage=`url("${reader.result}")`;
    reader.readAsDataURL(file);
    const remove=document.createElement('button');
    remove.type='button';
    remove.className='photo-remove';
    remove.textContent='×';
    remove.setAttribute('aria-label','Odstranit fotografii');
    remove.addEventListener('click',()=>{
      selectedPhotos.splice(index,1);
      syncPhotoInput();
      validatePhotos(false);
      renderPhotoPreviews();
    });
    item.appendChild(remove);
    photoPreviews.appendChild(item);
  });
}

function getFormValue(formData, name){
  return String(formData.get(name) || '').trim();
}

function getFormValues(formData, name){
  return formData.getAll(name).map(value=>String(value).trim()).filter(Boolean);
}

function parseDistance(value){
  const number = Number.parseInt(String(value || ''), 10);
  return Number.isFinite(number) ? number : null;
}

function parseOptionalNumber(value){
  const normalized = String(value ?? '').trim();
  if(!normalized) return null;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function buildRawData(){
  const raw = {};
  [...form.elements].forEach(element=>{
    if(!element.name || element.type === 'file' || element.name.startsWith('_')) return;
    if(element.type === 'checkbox'){
      if(!raw[element.name]) raw[element.name] = [];
      if(element.checked) raw[element.name].push(element.value || 'Ano');
    }else if(element.type === 'radio'){
      if(element.checked) raw[element.name] = element.value;
    }else{
      raw[element.name] = element.value;
    }
  });
  return raw;
}

function photoExtension(file){
  const byType = {
    'image/jpeg':'jpg',
    'image/png':'png',
    'image/webp':'webp'
  };
  return byType[file.type] || 'jpg';
}

function calculateAge(birthDate){
  const value = String(birthDate || '').trim();
  if(!value) return null;
  const birth = new Date(`${value}T00:00:00`);
  if(Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDifference = today.getMonth() - birth.getMonth();
  if(monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age >= 18 && age <= 120 ? age : null;
}

async function ensureMemberLead(formData){
  if(memberLeadId) return memberLeadId;

  const leadId = createUuid();
  const age = calculateAge(getFormValue(formData, 'Datum narození'));
  const leadPayload = {
    id: leadId,
    gender: getFormValue(formData, 'Jsem'),
    looking_for: getFormValue(formData, 'Hledám'),
    age,
    city: getFormValue(formData, 'Město'),
    email: String(memberAuth.user.email || getFormValue(formData, 'email')).trim().toLowerCase(),
    consent_privacy: formData.get('Souhlas se zpracováním profilu') === 'Ano',
    source: 'duonera.cz/account'
  };

  // The public lead endpoint is intentionally used without the member token.
  // It is the same protected registration endpoint as the short form.
  await insertRow('duonera_leads', leadPayload, 20000);
  localStorage.setItem('duonera-lead-id', leadId);
  memberLeadId = leadId;

  try{
    await callMemberRpc('duonera_claim_registration');
  }catch(error){
    // The profile can still reference the newly created lead. Claiming only
    // lets the member read the short registration from the account.
    console.warn('The new short registration could not be attached automatically', error);
  }

  return memberLeadId;
}

async function uploadProfilePhotos(profileId){
  const files = [...photoInput.files].slice(0, 3);
  const paths = [];

  for(let index = 0; index < files.length; index += 1){
    const file = files[index];
    const path = `${memberAuth.user.id}/${profileId}/${String(index + 1).padStart(2, '0')}.${photoExtension(file)}`;
    try{
      paths.push(await uploadPrivateFile(
        PROFILE_PHOTO_BUCKET,
        path,
        file,
        memberAuth.session.access_token
      ));
    }catch(error){
      // A single photo must never block creation of the member profile.
      console.error(`Photo ${index + 1} could not be uploaded`, error);
    }
  }

  return paths;
}

form.addEventListener('submit', async event=>{
  event.preventDefault();
  if(currentStep!==steps.length-1){ currentStep=steps.length-1; updateStep(); return; }
  if(!validateCurrentStep()) return;

  const formData = new FormData(form);
  const profileId = createUuid();
  const originalButtonText = submitButton.textContent;

  const payload = {
    id: profileId,
    user_id: memberAuth.user.id,
    // Link the full profile to the authenticated member's verified short
    // registration. The database schema uses this relation for profiles.
    lead_id: memberLeadId,
    status: 'new',
    first_name: getFormValue(formData, 'Křestní jméno'),
    birth_date: getFormValue(formData, 'Datum narození'),
    gender: getFormValue(formData, 'Jsem'),
    looking_for: getFormValue(formData, 'Hledám'),
    country: getFormValue(formData, 'Země') || 'Česko',
    city: getFormValue(formData, 'Město'),
    email: getFormValue(formData, 'email').toLowerCase(),
    languages: getFormValues(formData, 'Jazyky'),
    height_cm: parseOptionalNumber(getFormValue(formData, 'Výška')),
    occupation: getFormValue(formData, 'Povolání'),
    education: getFormValue(formData, 'Vzdělání'),
    relationship_status: getFormValue(formData, 'Rodinný stav'),
    children: getFormValue(formData, 'Děti'),
    pets: getFormValue(formData, 'Domácí zvířata'),
    smoking: getFormValue(formData, 'Kouření'),
    alcohol: getFormValue(formData, 'Alkohol'),
    traits: getFormValues(formData, 'Povaha'),
    interests: getFormValues(formData, 'Zájmy'),
    about_me: getFormValue(formData, 'O mně'),
    ideal_relationship: getFormValue(formData, 'Představa o vztahu'),
    preferred_age_min: parseOptionalNumber(getFormValue(formData, 'Hledaný věk od')),
    preferred_age_max: parseOptionalNumber(getFormValue(formData, 'Hledaný věk do')),
    preferred_distance_km: parseDistance(getFormValue(formData, 'Maximální vzdálenost')),
    relationship_goal: getFormValue(formData, 'Cíl seznámení'),
    consent_privacy: formData.get('Souhlas se zpracováním profilu') === 'Ano',
    consent_discovery: formData.get('Souhlas se zobrazením profilu') === 'Ano',
    consent_contact: false,
    is_approved: false,
    is_discoverable: false,
    source: 'duonera.cz',
    photo_paths: [],
    public_photo_paths: [],
    raw_data: buildRawData()
  };

  try{
    submitButton.disabled = true;
    submitButton.textContent = t('sending');
    localStorage.setItem(draftKey, JSON.stringify(serializeDraft()));

    payload.lead_id = await ensureMemberLead(formData);
    payload.photo_paths = await uploadProfilePhotos(profileId);
    await insertRow('duonera_profiles', payload, 20000, memberAuth.session.access_token);

    localStorage.removeItem(draftKey);
    location.assign('profil-hotovo.html');
  }catch(error){
    console.error(error);
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
    const errors = {
      cs:'Profil se nepodařilo bezpečně uložit do databáze. Zkontrolujte připojení a zkuste odeslání znovu.',
      en:'The profile could not be saved securely. Check your connection and submit it again.',
      uk:'Не вдалося безпечно зберегти анкету. Перевірте з’єднання та надішліть її ще раз.',
      ru:'Не удалось безопасно сохранить анкету. Проверьте соединение и отправьте её ещё раз.',
      de:'Das Profil konnte nicht sicher in der Datenbank gespeichert werden. Prüfen Sie Ihre Verbindung und senden Sie es erneut.'
    };
    showMessage(errors[currentLang] || errors.cs);
  }
});


const birthDateInput = form.querySelector('input[name="Datum narození"]');
if(birthDateInput){
  const adultDate = new Date();
  adultDate.setFullYear(adultDate.getFullYear()-18);
  birthDateInput.max = adultDate.toISOString().slice(0,10);
}

restoreDraft();
const emailInput = form.querySelector('input[name="email"]');
if(emailInput){
  emailInput.value = memberAuth.user.email || '';
  emailInput.readOnly = true;
}
updateStep();
