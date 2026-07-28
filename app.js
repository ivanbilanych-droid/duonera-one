import {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  createUuid,
  insertRow
} from './supabase-client.js?v=5';
import { requestEmailOtp } from './member-auth.js?v=2';

const translations = {
  cs: {
    navHow:'Jak to funguje',navSelection:'Vaše výběry',navResult:'Výsledek',navSafety:'Soukromí',registerFree:'Registrace zdarma',
    heroKicker:'PRIVÁTNÍ SEZNAMOVÁNÍ PRO SKUTEČNÝ ŽIVOT',heroLine1:'Tři vybraní lidé.',heroLine2:'Jedna vzájemná volba.',heroLine3:'Skutečné setkání.',
    heroLead:'DUONERA pro vás vybere několik lidí podle vašich přání, hodnot a životního stylu. Vy si zvolíte jednoho. Když je sympatie vzájemná, otevře se cesta ke skutečné schůzce.',createProfile:'Vytvořit profil zdarma',seeHow:'Podívat se, jak to funguje',trustPrivate:'Profil není veřejný',trustNoSub:'Bez automatického předplatného',trustMeeting:'Cíl: skutečné setkání',
    statementLabel:'PROČ DUONERA',statementTitle:'Neplatíte za zprávy, lajky ani nekonečné prohlížení profilů.',statementText:'Platíte pouze za službu, která vás dovede k potvrzenému vzájemnému seznámení a skutečné schůzce. Lásku slíbit nemůžeme. Kvalitní výběr, soukromí a organizovaný proces ano.',
    howLabel:'JAK TO FUNGUJE',howTitle:'Pět jednoduchých kroků od profilu ke schůzce',step1Title:'Vytvoříte profil',step1Text:'Popíšete sebe, svůj život a člověka, kterého chcete skutečně potkat.',step2Title:'Dostanete 3 výběry',step2Text:'Ne stovky profilů. Jen několik lidí, kteří splňují vaše nejdůležitější podmínky.',step3Title:'Vyberete jednoho',step3Text:'Vyberete člověka, kterého chcete poznat. Můžete také všechny odmítnout.',step4Title:'Vzájemná sympatie',step4Text:'Možnost schůzky se otevře pouze tehdy, když jste si vybrali navzájem.',step5Title:'Skutečné setkání',step5Text:'Vyberete termín a vhodné veřejné místo. DUONERA vás procesem provede.',
    selectionLabel:'VAŠE SOUKROMÁ KOLEKCE',selectionTitle:'Několik kvalitních možností. Žádný nekonečný katalog.',selectionText:'Každá karta vysvětluje, proč byl člověk vybrán právě pro vás. Ukázkové profily níže slouží pouze k představení principu.',selectionNote:'Pouze vybraní lidé uvidí váš profil.',demoProfile:'Ukázkový profil',profile1Goal:'Hledá vážný vztah',profile1A:'cestování a kultura',profile1B:'nekuřačka',profile1C:'klidný životní styl',profile2Goal:'Hledá stabilní partnerství',profile2A:'sport a cestování',profile2B:'rodinně založený',profile2C:'aktivní životní styl',profile3Goal:'Hledá opravdové partnerství',profile3A:'gastronomie a umění',profile3B:'mluví česky a rusky',profile3C:'ráda cestuje',whySelected:'Proč je ve výběru?',profile1Why:'Bydlí blízko, hledá stejný typ vztahu a odpovídá vašim hlavním hodnotám.',profile2Why:'Má podobný denní rytmus, zájmy a stejné představy o budoucnosti.',profile3Why:'Sdílíte jazyky, zájem o cestování a podobnou představu o společném čase.',choosePerson:'Chci ji poznat',choosePersonMale:'Chci ho poznat',noneThisWeek:'Tentokrát nikdo — počkám na další výběr',
    mutualLabel:'VZÁJEMNÁ SYMPATIE',mutualTitle:'Vybrali jste si navzájem. Teď přichází skutečný krok.',mutualText:'Teprve při vzájemném zájmu se otevře možnost domluvit schůzku. Nejdřív volba. Potom termín. Až nakonec osobní kontakt.',dateTitle:'Výběr termínu',dateText:'Několik možností, které vyhovují oběma.',placeTitle:'Důstojné místo',placeText:'Veřejné a příjemné prostředí pro první setkání.',contactTitle:'Soukromé kontakty',contactText:'Otevírají se až po vzájemném potvrzení.',startJourney:'Začít svou cestu',
    payLabel:'PLATÍTE ZA VÝSLEDEK',payTitle:'Žádné placené zprávy. Žádná skrytá automatická předplatná.',payText:'Registrace a vytvoření profilu jsou zdarma. Cena se zobrazí až před potvrzením konkrétního vzájemného seznámení a schůzky.',guaranteeTitle:'Když druhý účastník schůzku zruší nebo nepřijde, další organizaci neplatíte.',guaranteeText:'Nemůžeme garantovat lásku. Můžeme garantovat férovou službu a jasné podmínky.',
    privacyLabel:'LUXURY JE TAKÉ SOUKROMÍ',privacyTitle:'Váš profil není veřejný produkt v katalogu.',privacyText:'Profil uvidí pouze lidé, které systém vybere jako vhodné kandidáty. Kontaktní údaje zůstávají skryté do vzájemného souhlasu.',private1Title:'Uzavřený profil',private1Text:'Žádné veřejné vyhledávání ani indexace profilů.',private2Title:'Omezený výběr',private2Text:'Méně možností, ale větší pozornost každému člověku.',private3Title:'Jasná pravidla',private3Text:'Nahlášení, blokace a ochrana proti opakovaným neúčastem.',private4Title:'Bez nátlaku',private4Text:'Můžete odmítnout všechny nabídky a počkat na další.',
    registerLabel:'SOUKROMÁ REGISTRACE',registerTitle:'Začněte bezpečně. Bez veřejného profilu a bez platby.',registerText:'Krátká registrace trvá přibližně jednu minutu. Poté se sami rozhodnete, zda chcete pokračovat k podrobné soukromé anketě.',regCheck1:'✓ Přibližně 1 minuta',regCheck2:'✓ Pro první krok stačí e-mail',regCheck3:'✓ Kontaktní údaje nezveřejňujeme',formIAm:'Jsem',formSeek:'Hledám',formAge:'Věk',formCity:'Město',formEmail:'E-mail',formPhone:'Telefon (volitelný)',select:'Vyberte',man:'Muž',woman:'Žena',seekWoman:'Ženu',seekMan:'Muže',formConsent:'Souhlasím se zpracováním údajů pro účely registrace a soukromého výběru DUONERA.',submit:'Zaregistrovat se zdarma',formNote:'Bez platby a bez závazku. Profil není veřejný.',footerTag:'Méně profilů. Lepší výběr. Skutečné setkání.',footerPrivacy:'Ochrana soukromí',footerTerms:'Podmínky služby',demoToast:'Ukázkové profily pouze vysvětlují princip DUONERA.'
  },
  en: {
    navHow:'How it works',navSelection:'Your selection',navResult:'The result',navSafety:'Privacy',registerFree:'Free registration',heroKicker:'PRIVATE DATING FOR REAL LIFE',heroLine1:'Three selected people.',heroLine2:'One mutual choice.',heroLine3:'A real meeting.',heroLead:'DUONERA selects a few people based on your preferences, values and lifestyle. You choose one. When the interest is mutual, the path to a real date opens.',createProfile:'Create a free profile',seeHow:'See how it works',trustPrivate:'Your profile is not public',trustNoSub:'No automatic subscription',trustMeeting:'Goal: a real meeting',statementLabel:'WHY DUONERA',statementTitle:'Do not pay for messages, likes or endless browsing.',statementText:'You pay only for a service that leads to a confirmed mutual introduction and a real date. We cannot promise love. We can promise a quality selection, privacy and an organised process.',howLabel:'HOW IT WORKS',howTitle:'Five simple steps from profile to meeting',step1Title:'Create your profile',step1Text:'Describe yourself, your life and the person you truly want to meet.',step2Title:'Receive 3 selections',step2Text:'Not hundreds of profiles. Only a few people who meet your key requirements.',step3Title:'Choose one person',step3Text:'Choose the person you want to meet, or decline them all.',step4Title:'Mutual interest',step4Text:'A date becomes possible only when you both choose each other.',step5Title:'A real meeting',step5Text:'Choose a time and a suitable public place. DUONERA guides the process.',selectionLabel:'YOUR PRIVATE COLLECTION',selectionTitle:'A few quality options. No endless catalogue.',selectionText:'Each card explains why the person was selected for you. The profiles below are examples only.',selectionNote:'Only selected people will see your profile.',demoProfile:'Example profile',whySelected:'Why selected?',choosePerson:'I want to meet her',choosePersonMale:'I want to meet him',noneThisWeek:'No one this time — wait for the next selection',mutualLabel:'MUTUAL INTEREST',mutualTitle:'You chose each other. Now comes the real step.',mutualText:'Only mutual interest unlocks the option to arrange a meeting. First the choice, then the date, and only then personal contact.',dateTitle:'Choose a date',dateText:'Several options that work for both.',placeTitle:'A quality venue',placeText:'A public and comfortable place for a first meeting.',contactTitle:'Private contacts',contactText:'Unlocked only after mutual confirmation.',startJourney:'Start your journey',payLabel:'PAY FOR THE RESULT',payTitle:'No paid messages. No hidden automatic subscriptions.',payText:'Registration and profile creation are free. The price appears only before confirming a specific mutual introduction and meeting.',guaranteeTitle:'If the other person cancels or does not arrive, you do not pay for the next arrangement.',guaranteeText:'We cannot guarantee love. We can guarantee fair service and clear terms.',privacyLabel:'LUXURY ALSO MEANS PRIVACY',privacyTitle:'Your profile is not a public product in a catalogue.',privacyText:'Only people selected as suitable candidates will see your profile. Contact details stay hidden until mutual consent.',registerLabel:'PRIVATE REGISTRATION',registerTitle:'Start safely. No public profile and no payment.',registerText:'The short registration takes about one minute. You then decide whether to continue to the detailed private profile.',regCheck1:'✓ About 1 minute',regCheck2:'✓ Email is enough for the first step',regCheck3:'✓ We never publish your contact details',formIAm:'I am',formSeek:'I am looking for',formAge:'Age',formCity:'City',formEmail:'Email',formPhone:'Phone (optional)',select:'Select',man:'Man',woman:'Woman',seekWoman:'Woman',seekMan:'Man',formConsent:'I agree to the processing of my data for registration and private DUONERA selections.',submit:'Register free',formNote:'No payment and no obligation. Your profile is not public.',footerTag:'Fewer profiles. Better choice. A real meeting.',footerPrivacy:'Privacy',footerTerms:'Terms',demoToast:'Example profiles only explain how DUONERA works.'
    ,profile1Goal:'Looking for a serious relationship',profile1A:'travel and culture',profile1B:'non-smoker',profile1C:'calm lifestyle',profile2Goal:'Looking for a stable partnership',profile2A:'sport and travel',profile2B:'family-oriented',profile2C:'active lifestyle',profile3Goal:'Looking for a genuine partnership',profile3A:'gastronomy and art',profile3B:'speaks Czech and Russian',profile3C:'enjoys travelling',profile1Why:'She lives nearby, seeks the same kind of relationship and shares your key values.',profile2Why:'He has a similar daily rhythm, interests and vision for the future.',profile3Why:'You share languages, a love of travel and a similar idea of quality time.'
    ,private1Title:'Closed profile',private1Text:'No public profile search or indexing.',private2Title:'Limited selection',private2Text:'Fewer options, with more attention for each person.',private3Title:'Clear rules',private3Text:'Reporting, blocking and protection from repeated no-shows.',private4Title:'No pressure',private4Text:'You can decline every suggestion and wait for the next selection.'
  },
  de: {
    navHow:'So funktioniert es',navSelection:'Ihre Auswahl',navResult:'Das Ergebnis',navSafety:'Privatsphäre',registerFree:'Kostenlos registrieren',
    heroKicker:'PRIVATE PARTNERVERMITTLUNG FÜR DAS ECHTE LEBEN',heroLine1:'Drei passende Menschen.',heroLine2:'Eine gegenseitige Wahl.',heroLine3:'Ein echtes Treffen.',
    heroLead:'DUONERA wählt einige Menschen passend zu Ihren Wünschen, Werten und Ihrem Lebensstil aus. Sie entscheiden sich für eine Person. Wenn das Interesse gegenseitig ist, öffnet sich der Weg zu einem echten Treffen.',createProfile:'Kostenloses Profil erstellen',seeHow:'So funktioniert es',trustPrivate:'Ihr Profil ist nicht öffentlich',trustNoSub:'Kein automatisches Abonnement',trustMeeting:'Ziel: ein echtes Treffen',
    statementLabel:'WARUM DUONERA',statementTitle:'Sie zahlen nicht für Nachrichten, Likes oder endloses Durchsuchen von Profilen.',statementText:'Sie zahlen nur für eine Dienstleistung, die zu einem bestätigten gegenseitigen Kennenlernen und einem echten Treffen führt. Liebe können wir nicht versprechen. Eine hochwertige Auswahl, Privatsphäre und einen organisierten Ablauf schon.',
    howLabel:'SO FUNKTIONIERT ES',howTitle:'Fünf einfache Schritte vom Profil zum Treffen',step1Title:'Profil erstellen',step1Text:'Beschreiben Sie sich, Ihr Leben und den Menschen, den Sie wirklich kennenlernen möchten.',step2Title:'3 Vorschläge erhalten',step2Text:'Keine Hunderte von Profilen. Nur einige Menschen, die Ihre wichtigsten Kriterien erfüllen.',step3Title:'Eine Person auswählen',step3Text:'Wählen Sie die Person, die Sie kennenlernen möchten. Sie können auch alle Vorschläge ablehnen.',step4Title:'Gegenseitiges Interesse',step4Text:'Ein Treffen wird erst möglich, wenn Sie sich gegenseitig ausgewählt haben.',step5Title:'Ein echtes Treffen',step5Text:'Wählen Sie einen Termin und einen passenden öffentlichen Ort. DUONERA begleitet Sie durch den Ablauf.',
    selectionLabel:'IHRE PRIVATE AUSWAHL',selectionTitle:'Einige hochwertige Möglichkeiten. Kein endloser Katalog.',selectionText:'Jede Karte erklärt, warum diese Person für Sie ausgewählt wurde. Die Profile unten dienen nur als Beispiele.',selectionNote:'Nur ausgewählte Menschen sehen Ihr Profil.',demoProfile:'Beispielprofil',profile1Goal:'Sucht eine ernsthafte Beziehung',profile1A:'Reisen und Kultur',profile1B:'Nichtraucherin',profile1C:'ruhiger Lebensstil',profile2Goal:'Sucht eine stabile Partnerschaft',profile2A:'Sport und Reisen',profile2B:'familienorientiert',profile2C:'aktiver Lebensstil',profile3Goal:'Sucht eine echte Partnerschaft',profile3A:'Gastronomie und Kunst',profile3B:'spricht Tschechisch und Russisch',profile3C:'reist gern',whySelected:'Warum wurde diese Person ausgewählt?',profile1Why:'Sie wohnt in der Nähe, sucht dieselbe Art von Beziehung und teilt Ihre wichtigsten Werte.',profile2Why:'Er hat einen ähnlichen Tagesrhythmus, ähnliche Interessen und dieselben Vorstellungen von der Zukunft.',profile3Why:'Sie teilen Sprachen, die Freude am Reisen und ähnliche Vorstellungen von gemeinsamer Zeit.',choosePerson:'Ich möchte sie kennenlernen',choosePersonMale:'Ich möchte ihn kennenlernen',noneThisWeek:'Diesmal niemand – ich warte auf die nächste Auswahl',
    mutualLabel:'GEGENSEITIGES INTERESSE',mutualTitle:'Sie haben sich gegenseitig ausgewählt. Jetzt folgt der echte Schritt.',mutualText:'Erst gegenseitiges Interesse eröffnet die Möglichkeit, ein Treffen zu vereinbaren. Zuerst die Wahl, dann der Termin und erst danach der persönliche Kontakt.',dateTitle:'Termin auswählen',dateText:'Mehrere Möglichkeiten, die für beide passen.',placeTitle:'Ein passender Ort',placeText:'Eine öffentliche und angenehme Umgebung für das erste Treffen.',contactTitle:'Private Kontaktdaten',contactText:'Sie werden erst nach gegenseitiger Bestätigung freigegeben.',startJourney:'Jetzt starten',
    payLabel:'SIE ZAHLEN FÜR DAS ERGEBNIS',payTitle:'Keine kostenpflichtigen Nachrichten. Keine versteckten automatischen Abonnements.',payText:'Registrierung und Profilerstellung sind kostenlos. Der Preis wird erst vor der Bestätigung eines konkreten gegenseitigen Kennenlernens und Treffens angezeigt.',guaranteeTitle:'Wenn die andere Person das Treffen absagt oder nicht erscheint, zahlen Sie nicht für die nächste Organisation.',guaranteeText:'Liebe können wir nicht garantieren. Einen fairen Service und klare Bedingungen schon.',
    privacyLabel:'LUXUS BEDEUTET AUCH PRIVATSPHÄRE',privacyTitle:'Ihr Profil ist kein öffentliches Produkt in einem Katalog.',privacyText:'Ihr Profil sehen nur Menschen, die das System als passende Kandidatinnen oder Kandidaten auswählt. Ihre Kontaktdaten bleiben bis zur gegenseitigen Zustimmung verborgen.',private1Title:'Geschlossenes Profil',private1Text:'Keine öffentliche Suche und keine Indexierung von Profilen.',private2Title:'Begrenzte Auswahl',private2Text:'Weniger Möglichkeiten, dafür mehr Aufmerksamkeit für jeden Menschen.',private3Title:'Klare Regeln',private3Text:'Melden, Sperren und Schutz vor wiederholtem Nichterscheinen.',private4Title:'Kein Druck',private4Text:'Sie können alle Vorschläge ablehnen und auf die nächste Auswahl warten.',
    registerLabel:'PRIVATE REGISTRIERUNG',registerTitle:'Starten Sie sicher. Kein öffentliches Profil und keine Zahlung.',registerText:'Die kurze Registrierung dauert etwa eine Minute. Danach entscheiden Sie selbst, ob Sie mit dem ausführlichen privaten Profil fortfahren möchten.',regCheck1:'✓ Etwa 1 Minute',regCheck2:'✓ Für den ersten Schritt genügt die E-Mail',regCheck3:'✓ Kontaktdaten werden nicht veröffentlicht',formIAm:'Ich bin',formSeek:'Ich suche',formAge:'Alter',formCity:'Stadt',formEmail:'E-Mail',formPhone:'Telefon (optional)',select:'Auswählen',man:'Mann',woman:'Frau',seekWoman:'Eine Frau',seekMan:'Einen Mann',formConsent:'Ich stimme der Verarbeitung meiner Daten für die Registrierung und private DUONERA-Auswahl zu.',submit:'Kostenlos registrieren',formNote:'Keine Zahlung und keine Verpflichtung. Ihr Profil ist nicht öffentlich.',footerTag:'Weniger Profile. Bessere Auswahl. Ein echtes Treffen.',footerPrivacy:'Datenschutz',footerTerms:'Nutzungsbedingungen',demoToast:'Die Beispielprofile erklären nur, wie DUONERA funktioniert.'
  },
  uk: {
    navHow:'Як це працює',navSelection:'Ваші варіанти',navResult:'Результат',navSafety:'Приватність',registerFree:'Безкоштовна реєстрація',heroKicker:'ПРИВАТНІ ЗНАЙОМСТВА ДЛЯ СПРАВЖНЬОГО ЖИТТЯ',heroLine1:'Три підібрані людини.',heroLine2:'Один взаємний вибір.',heroLine3:'Справжня зустріч.',heroLead:'DUONERA підбирає кількох людей за вашими побажаннями, цінностями та стилем життя. Ви обираєте одного. Коли симпатія взаємна, відкривається шлях до реальної зустрічі.',createProfile:'Створити анкету безкоштовно',seeHow:'Подивитися, як це працює',trustPrivate:'Анкета не є публічною',trustNoSub:'Без автоматичної підписки',trustMeeting:'Мета: реальна зустріч',statementLabel:'ЧОМУ DUONERA',statementTitle:'Не платіть за повідомлення, лайки та нескінченний перегляд.',statementText:'Ви платите лише за послугу, яка приводить до підтвердженого взаємного знайомства та реальної зустрічі. Ми не обіцяємо кохання. Ми обіцяємо якісний вибір, приватність і організований процес.',howLabel:'ЯК ЦЕ ПРАЦЮЄ',howTitle:'П’ять простих кроків від анкети до зустрічі',step1Title:'Створіть анкету',step1Text:'Розкажіть про себе, своє життя та людину, яку хочете зустріти.',step2Title:'Отримайте 3 варіанти',step2Text:'Не сотні анкет. Лише кілька людей, що відповідають ключовим вимогам.',step3Title:'Оберіть одну людину',step3Text:'Оберіть того, кого хочете пізнати, або відхиліть усіх.',step4Title:'Взаємна симпатія',step4Text:'Можливість зустрічі відкривається лише за взаємного вибору.',step5Title:'Справжня зустріч',step5Text:'Оберіть час і відповідне публічне місце. DUONERA проведе вас через процес.',selectionLabel:'ВАША ПРИВАТНА ДОБІРКА',selectionTitle:'Кілька якісних варіантів. Без нескінченного каталогу.',selectionText:'Кожна картка пояснює, чому людина підібрана саме для вас. Нижче лише приклади.',selectionNote:'Вашу анкету побачать лише підібрані люди.',demoProfile:'Приклад анкети',whySelected:'Чому в добірці?',choosePerson:'Хочу познайомитися',choosePersonMale:'Хочу познайомитися',noneThisWeek:'Цього разу ніхто — чекати наступну добірку',mutualLabel:'ВЗАЄМНА СИМПАТІЯ',mutualTitle:'Ви обрали одне одного. Тепер — справжній крок.',mutualText:'Лише взаємний інтерес відкриває можливість домовитися про зустріч. Спочатку вибір, потім час, і лише тоді особистий контакт.',dateTitle:'Вибір часу',dateText:'Кілька варіантів, зручних для обох.',placeTitle:'Гідне місце',placeText:'Публічне та приємне місце для першої зустрічі.',contactTitle:'Приватні контакти',contactText:'Відкриваються лише після взаємного підтвердження.',startJourney:'Почати свій шлях',payLabel:'ПЛАТІТЬ ЗА РЕЗУЛЬТАТ',payTitle:'Без платних повідомлень. Без прихованих автопідписок.',payText:'Реєстрація та створення анкети безкоштовні. Ціна показується лише перед підтвердженням конкретного взаємного знайомства і зустрічі.',guaranteeTitle:'Якщо інша людина скасує зустріч або не прийде, наступну організацію ви не оплачуєте.',guaranteeText:'Ми не можемо гарантувати кохання. Але можемо гарантувати чесну послугу і зрозумілі умови.',privacyLabel:'LUXURY — ЦЕ ТАКОЖ ПРИВАТНІСТЬ',privacyTitle:'Ваша анкета не є публічним товаром у каталозі.',privacyText:'Її побачать лише люди, яких система визначить як відповідних кандидатів. Контакти приховані до взаємної згоди.',registerLabel:'ПРИВАТНА РЕЄСТРАЦІЯ',registerTitle:'Почніть безпечно. Без публічної анкети та без оплати.',registerText:'Коротка реєстрація займає приблизно одну хвилину. Потім ви самі вирішите, чи продовжувати заповнення детальної приватної анкети.',regCheck1:'✓ Приблизно 1 хвилина',regCheck2:'✓ Для першого кроку достатньо e-mail',regCheck3:'✓ Контактні дані не публікуємо',formIAm:'Я',formSeek:'Шукаю',formAge:'Вік',formCity:'Місто',formEmail:'E-mail',formPhone:'Телефон (необов’язково)',select:'Оберіть',man:'Чоловік',woman:'Жінка',seekWoman:'Жінку',seekMan:'Чоловіка',formConsent:'Погоджуюся на обробку даних для реєстрації та приватного підбору DUONERA.',submit:'Зареєструватися безкоштовно',formNote:'Без оплати та зобов’язань. Анкета не є публічною.',footerTag:'Менше анкет. Кращий вибір. Справжня зустріч.',footerPrivacy:'Конфіденційність',footerTerms:'Умови',demoToast:'Приклади анкет лише пояснюють принцип DUONERA.'
    ,profile1Goal:'Шукає серйозні стосунки',profile1A:'подорожі та культура',profile1B:'не палить',profile1C:'спокійний стиль життя',profile2Goal:'Шукає стабільне партнерство',profile2A:'спорт і подорожі',profile2B:'цінує родину',profile2C:'активний стиль життя',profile3Goal:'Шукає справжнє партнерство',profile3A:'гастрономія та мистецтво',profile3B:'говорить чеською та російською',profile3C:'любить подорожувати',profile1Why:'Вона живе неподалік, шукає такий самий тип стосунків і поділяє ваші головні цінності.',profile2Why:'У нього подібний ритм дня, інтереси та бачення майбутнього.',profile3Why:'Ви говорите спільними мовами, любите подорожі й подібно уявляєте спільний час.'
    ,private1Title:'Закрита анкета',private1Text:'Без публічного пошуку та індексації анкет.',private2Title:'Обмежена добірка',private2Text:'Менше варіантів, але більше уваги кожній людині.',private3Title:'Чіткі правила',private3Text:'Скарги, блокування та захист від повторних неявок.',private4Title:'Без тиску',private4Text:'Можна відхилити всі варіанти й чекати наступну добірку.'
  },
  ru: {
    navHow:'Как это работает',navSelection:'Ваши варианты',navResult:'Результат',navSafety:'Приватность',registerFree:'Регистрация бесплатно',heroKicker:'ПРИВАТНЫЕ ЗНАКОМСТВА ДЛЯ НАСТОЯЩЕЙ ЖИЗНИ',heroLine1:'Три подходящих человека.',heroLine2:'Один взаимный выбор.',heroLine3:'Настоящая встреча.',heroLead:'DUONERA подбирает нескольких людей по вашим пожеланиям, ценностям и образу жизни. Вы выбираете одного. Когда симпатия взаимна, открывается путь к настоящей встрече.',createProfile:'Создать анкету бесплатно',seeHow:'Посмотреть, как это работает',trustPrivate:'Анкета не публичная',trustNoSub:'Без автоматической подписки',trustMeeting:'Цель: настоящая встреча',statementLabel:'ПОЧЕМУ DUONERA',statementTitle:'Не платите за сообщения, лайки и бесконечный просмотр.',statementText:'Вы платите только за услугу, которая приводит к подтверждённому взаимному знакомству и настоящей встрече. Мы не можем обещать любовь. Но можем обещать качественный выбор, приватность и организованный процесс.',howLabel:'КАК ЭТО РАБОТАЕТ',howTitle:'Пять простых шагов от анкеты до встречи',step1Title:'Создайте анкету',step1Text:'Расскажите о себе, своей жизни и человеке, которого хотите встретить.',step2Title:'Получите 3 варианта',step2Text:'Не сотни анкет. Только несколько людей, которые соответствуют главным условиям.',step3Title:'Выберите одного',step3Text:'Выберите человека, которого хотите узнать, или откажитесь от всех.',step4Title:'Взаимная симпатия',step4Text:'Встреча становится возможной только тогда, когда вы выбрали друг друга.',step5Title:'Настоящая встреча',step5Text:'Выберите время и подходящее публичное место. DUONERA проведёт вас через процесс.',selectionLabel:'ВАША ПРИВАТНАЯ ПОДБОРКА',selectionTitle:'Несколько качественных вариантов. Никакого бесконечного каталога.',selectionText:'Каждая карточка объясняет, почему человек подобран именно для вас. Ниже показаны только примеры.',selectionNote:'Вашу анкету увидят только подобранные люди.',demoProfile:'Пример анкеты',whySelected:'Почему в подборке?',choosePerson:'Хочу познакомиться',choosePersonMale:'Хочу познакомиться',noneThisWeek:'На этой неделе никто — ждать следующую подборку',mutualLabel:'ВЗАИМНАЯ СИМПАТИЯ',mutualTitle:'Вы выбрали друг друга. Теперь — настоящий шаг.',mutualText:'Только взаимный интерес открывает возможность договориться о встрече. Сначала выбор, затем время, и только потом личный контакт.',dateTitle:'Выбор времени',dateText:'Несколько вариантов, удобных для обоих.',placeTitle:'Достойное место',placeText:'Публичное и приятное место для первой встречи.',contactTitle:'Личные контакты',contactText:'Открываются только после взаимного подтверждения.',startJourney:'Начать свой путь',payLabel:'ПЛАТИТЕ ЗА РЕЗУЛЬТАТ',payTitle:'Без платных сообщений. Без скрытых автоматических подписок.',payText:'Регистрация и создание анкеты бесплатны. Цена показывается только перед подтверждением конкретного взаимного знакомства и встречи.',guaranteeTitle:'Если второй участник отменит встречу или не придёт, следующую организацию вы не оплачиваете.',guaranteeText:'Мы не можем гарантировать любовь. Но можем гарантировать честную услугу и понятные условия.',privacyLabel:'LUXURY — ЭТО ЕЩЁ И ПРИВАТНОСТЬ',privacyTitle:'Ваша анкета — не публичный товар в каталоге.',privacyText:'Её увидят только люди, которых система выберет как подходящих кандидатов. Контакты скрыты до взаимного согласия.',registerLabel:'ЗАКРЫТАЯ РЕГИСТРАЦИЯ',registerTitle:'Начните безопасно. Без публичной анкеты и без оплаты.',registerText:'Короткая регистрация занимает примерно одну минуту. Затем вы сами решите, продолжать ли заполнение подробной закрытой анкеты.',regCheck1:'✓ Примерно 1 минута',regCheck2:'✓ Для первого шага достаточно e-mail',regCheck3:'✓ Контактные данные не публикуются',formIAm:'Я',formSeek:'Ищу',formAge:'Возраст',formCity:'Город',formEmail:'E-mail',formPhone:'Телефон (необязательно)',select:'Выберите',man:'Мужчина',woman:'Женщина',seekWoman:'Женщину',seekMan:'Мужчину',formConsent:'Согласен на обработку данных для регистрации и закрытого подбора DUONERA.',submit:'Зарегистрироваться бесплатно',formNote:'Без оплаты и обязательств. Анкета не публикуется.',footerTag:'Меньше анкет. Лучший выбор. Настоящая встреча.',footerPrivacy:'Конфиденциальность',footerTerms:'Условия',demoToast:'Примеры анкет только объясняют принцип DUONERA.'
    ,profile1Goal:'Ищет серьёзные отношения',profile1A:'путешествия и культура',profile1B:'не курит',profile1C:'спокойный образ жизни',profile2Goal:'Ищет стабильное партнёрство',profile2A:'спорт и путешествия',profile2B:'ценит семью',profile2C:'активный образ жизни',profile3Goal:'Ищет настоящее партнёрство',profile3A:'гастрономия и искусство',profile3B:'говорит по-чешски и по-русски',profile3C:'любит путешествовать',profile1Why:'Она живёт рядом, ищет такой же тип отношений и разделяет ваши главные ценности.',profile2Why:'У него похожий ритм жизни, интересы и представления о будущем.',profile3Why:'У вас общие языки, интерес к путешествиям и похожее представление о совместном времени.'
    ,private1Title:'Закрытая анкета',private1Text:'Без публичного поиска и индексации анкет.',private2Title:'Ограниченная подборка',private2Text:'Меньше вариантов, но больше внимания каждому человеку.',private3Title:'Понятные правила',private3Text:'Жалобы, блокировка и защита от повторных неявок.',private4Title:'Без давления',private4Text:'Можно отклонить все варианты и дождаться следующей подборки.'
  }
};

const processTranslations = {
  cs:{
    account:'Můj účet',navSelection:'Profily',
    heroLead:'Nejdříve si prohlédnete omezený výběr skutečných profilů. Po registraci získáte vlastní stránku, můžete označit sympatie a při vzájemné volbě DUONERA připraví skutečné setkání.',
    trustPrivate:'Kontaktní údaje nejsou veřejné',
    statementTitle:'Omezený výběr pro vlastní rozhodnutí. Tři nejlepší kandidáti jako prémiová služba.',
    statementText:'Můžete si sami prohlédnout několik schválených profilů. Pokud chcete přesnější výběr, DUONERA pro vás osobně připraví tři nejsilnější kandidáty podle celé ankety.',
    howTitle:'Pět jednoduchých kroků od prvního pohledu ke schůzce',
    step1Title:'Prohlédnete si profily',step1Text:'Hned vidíte omezený počet skutečných a schválených profilů.',
    step2Title:'Získáte vlastní stránku',step2Text:'Po registraci vidíte svou anketu, fotografie a stav profilu.',
    step3Title:'Označíte sympatii',step3Text:'Vyberete lidi, které byste chtěli poznat. Kontakty zůstávají skryté.',
    step4Title:'Vzájemná volba',step4Text:'DUONERA odhalí shodu pouze tehdy, když jste si vybrali navzájem.',
    step5Text:'DUONERA pomůže domluvit termín a vhodné veřejné místo.',
    selectionLabel:'OMEZENÝ VÝBĚR',selectionTitle:'Skutečné profily. Žádný nekonečný katalog.',
    selectionText:'Zobrazujeme pouze schválené profily lidí, kteří výslovně souhlasili s jejich zobrazením. Kontaktní údaje ani přesné datum narození nezveřejňujeme.',
    selectionNote:'Kontaktní údaje zůstávají vždy skryté.',
    privacyTitle:'Vy rozhodujete, zda se váš profil může zobrazit.',
    privacyText:'Zobrazí se pouze po vašem výslovném souhlasu a schválení DUONERA. E-mail, telefon, příjmení a přesné datum narození se nezobrazují.',
    registerTitle:'Získejte vlastní stránku DUONERA zdarma.',
    registerText:'Krátká registrace trvá přibližně jednu minutu. Na e-mail dostanete šestimístný kód do osobního účtu, kde uvidíte svou anketu, fotografie a výběry.',
    regCheck2:'✓ Přihlášení bezpečným kódem bez hesla',regCheck3:'✓ E-mail a kontaktní údaje nezveřejňujeme',
    formNote:'Bez platby a bez závazku. O zobrazení profilu rozhodujete vy.',
    discoveryLoading:'Načítání schválených profilů…',noDiscoveryProfiles:'Momentálně nejsou k dispozici žádné schválené profily.',openAccount:'Chci tohoto člověka poznat'
  },
  en:{
    account:'My account',navSelection:'Profiles',
    heroLead:'First, browse a limited selection of real profiles. After registration you receive your own page, can mark who you like, and DUONERA prepares a real meeting when the choice is mutual.',
    trustPrivate:'Contact details are not public',
    statementTitle:'A limited selection for your own decision. Your three best candidates as a premium service.',
    statementText:'Browse a few approved profiles yourself. If you want a more precise selection, DUONERA personally prepares the three strongest candidates from your full profile.',
    howTitle:'Five simple steps from the first look to a real date',
    step1Title:'Browse profiles',step1Text:'Immediately see a limited number of real, approved profiles.',
    step2Title:'Get your own page',step2Text:'After registration, see your profile, photos and approval status.',
    step3Title:'Mark your interest',step3Text:'Choose the people you would like to meet. Contact details remain hidden.',
    step4Title:'Mutual choice',step4Text:'DUONERA reveals a match only when you choose each other.',
    step5Text:'DUONERA helps arrange a suitable time and public place.',
    selectionLabel:'LIMITED SELECTION',selectionTitle:'Real profiles. No endless catalogue.',
    selectionText:'We show only approved profiles of people who explicitly consented to display. Contact details and exact birth dates are never shown.',
    selectionNote:'Contact details always remain hidden.',
    privacyTitle:'You decide whether your profile may be shown.',
    privacyText:'It appears only with your explicit consent and DUONERA approval. Email, phone, surname and exact birth date are not displayed.',
    registerTitle:'Get your own DUONERA page for free.',
    registerText:'Short registration takes about one minute. You receive a six-digit email code for your account, where you can see your profile, photos and selections.',
    regCheck2:'✓ Secure password-free sign-in code',regCheck3:'✓ Email and contact details are never public',
    formNote:'No payment and no obligation. You decide whether your profile is displayed.',
    discoveryLoading:'Loading approved profiles…',noDiscoveryProfiles:'No approved profiles are available at the moment.',openAccount:'I would like to meet this person'
  },
  de:{
    account:'Mein Konto',navSelection:'Profile',
    heroLead:'Zuerst sehen Sie eine begrenzte Auswahl echter Profile. Nach der Registrierung erhalten Sie Ihre persönliche Seite, markieren Ihre Sympathien und bei gegenseitiger Wahl organisiert DUONERA ein echtes Treffen.',
    trustPrivate:'Kontaktdaten sind nicht öffentlich',
    statementTitle:'Eine begrenzte Auswahl für Ihre eigene Entscheidung. Die drei besten Kandidaten als Premium-Service.',
    statementText:'Sie können einige geprüfte Profile selbst ansehen. Für eine genauere Auswahl stellt DUONERA anhand Ihres vollständigen Profils persönlich die drei stärksten Kandidaten zusammen.',
    howTitle:'Fünf einfache Schritte vom ersten Blick zum echten Treffen',
    step1Title:'Profile ansehen',step1Text:'Sie sehen sofort eine begrenzte Zahl echter, geprüfter Profile.',
    step2Title:'Eigene Seite erhalten',step2Text:'Nach der Registrierung sehen Sie Ihr Profil, Ihre Fotos und den Prüfstatus.',
    step3Title:'Sympathie markieren',step3Text:'Wählen Sie Menschen, die Sie kennenlernen möchten. Kontaktdaten bleiben verborgen.',
    step4Title:'Gegenseitige Wahl',step4Text:'DUONERA zeigt eine Übereinstimmung nur, wenn Sie sich gegenseitig gewählt haben.',
    step5Text:'DUONERA hilft, einen Termin und einen geeigneten öffentlichen Ort zu vereinbaren.',
    selectionLabel:'BEGRENZTE AUSWAHL',selectionTitle:'Echte Profile. Kein endloser Katalog.',
    selectionText:'Wir zeigen nur geprüfte Profile von Menschen, die der Anzeige ausdrücklich zugestimmt haben. Kontaktdaten und das genaue Geburtsdatum werden nie gezeigt.',
    selectionNote:'Kontaktdaten bleiben immer verborgen.',
    privacyTitle:'Sie entscheiden, ob Ihr Profil angezeigt werden darf.',
    privacyText:'Es erscheint nur mit Ihrer ausdrücklichen Zustimmung und nach Freigabe durch DUONERA. E-Mail, Telefon, Nachname und genaues Geburtsdatum werden nicht angezeigt.',
    registerTitle:'Erhalten Sie Ihre eigene DUONERA-Seite kostenlos.',
    registerText:'Die kurze Registrierung dauert etwa eine Minute. Per E-Mail erhalten Sie einen sechsstelligen Code für Ihr Konto mit Profil, Fotos und Auswahl.',
    regCheck2:'✓ Sicherer Anmeldecode ohne Passwort',regCheck3:'✓ E-Mail und Kontaktdaten sind nie öffentlich',
    formNote:'Keine Zahlung und keine Verpflichtung. Sie entscheiden über die Anzeige Ihres Profils.',
    discoveryLoading:'Geprüfte Profile werden geladen…',noDiscoveryProfiles:'Zurzeit sind keine geprüften Profile verfügbar.',openAccount:'Ich möchte diese Person kennenlernen'
  },
  uk:{
    account:'Мій кабінет',navSelection:'Анкети',
    heroLead:'Спочатку ви бачите обмежену добірку реальних анкет. Після реєстрації отримуєте власну сторінку, відмічаєте симпатії, а при взаємному виборі DUONERA організовує справжню зустріч.',
    trustPrivate:'Контактні дані не є публічними',
    statementTitle:'Обмежений вибір для власного рішення. Три найкращі кандидати як преміальна послуга.',
    statementText:'Ви можете самі переглянути кілька схвалених анкет. Для точнішого вибору DUONERA особисто підготує три найсильніші кандидатури за повною анкетою.',
    howTitle:'П’ять простих кроків від першого погляду до зустрічі',
    step1Title:'Переглядаєте анкети',step1Text:'Одразу бачите обмежену кількість реальних і схвалених анкет.',
    step2Title:'Отримуєте власну сторінку',step2Text:'Після реєстрації бачите свою анкету, фотографії та статус перевірки.',
    step3Title:'Відмічаєте симпатію',step3Text:'Обираєте людей, з якими хочете познайомитися. Контакти приховані.',
    step4Title:'Взаємний вибір',step4Text:'DUONERA показує збіг лише тоді, коли ви обрали одне одного.',
    step5Text:'DUONERA допоможе домовитися про час і відповідне публічне місце.',
    selectionLabel:'ОБМЕЖЕНА ДОБІРКА',selectionTitle:'Реальні анкети. Без нескінченного каталогу.',
    selectionText:'Ми показуємо лише схвалені анкети людей, які дали явну згоду на показ. Контактні дані та точна дата народження не відображаються.',
    selectionNote:'Контактні дані завжди приховані.',
    privacyTitle:'Ви вирішуєте, чи можна показувати вашу анкету.',
    privacyText:'Вона з’явиться лише після вашої явної згоди та схвалення DUONERA. E-mail, телефон, прізвище і точна дата народження не показуються.',
    registerTitle:'Отримайте власну сторінку DUONERA безкоштовно.',
    registerText:'Коротка реєстрація займає близько хвилини. На e-mail ви отримаєте шестизначний код до кабінету з анкетою, фотографіями та добірками.',
    regCheck2:'✓ Безпечний код для входу без пароля',regCheck3:'✓ E-mail і контакти не публікуються',
    formNote:'Без оплати та зобов’язань. Ви вирішуєте, чи показувати анкету.',
    discoveryLoading:'Завантажуємо схвалені анкети…',noDiscoveryProfiles:'Наразі немає доступних схвалених анкет.',openAccount:'Хочу познайомитися з цією людиною'
  },
  ru:{
    account:'Мой кабинет',navSelection:'Анкеты',
    heroLead:'Сначала вы видите ограниченную подборку реальных анкет. После регистрации получаете личную страницу, отмечаете симпатии, а при взаимном выборе DUONERA организует настоящую встречу.',
    trustPrivate:'Контактные данные не публикуются',
    statementTitle:'Ограниченный выбор для собственного решения. Три лучших кандидата как премиальная услуга.',
    statementText:'Вы можете сами посмотреть несколько одобренных анкет. Для более точного выбора DUONERA лично подготовит три самых сильных кандидатуры по полной анкете.',
    howTitle:'Пять простых шагов от первого взгляда до встречи',
    step1Title:'Смотрите анкеты',step1Text:'Сразу видите ограниченное количество реальных и одобренных анкет.',
    step2Title:'Получаете личную страницу',step2Text:'После регистрации видите свою анкету, фотографии и статус проверки.',
    step3Title:'Отмечаете симпатию',step3Text:'Выбираете людей, с которыми хотите познакомиться. Контакты скрыты.',
    step4Title:'Взаимный выбор',step4Text:'DUONERA показывает совпадение только тогда, когда вы выбрали друг друга.',
    step5Text:'DUONERA поможет договориться о времени и подходящем публичном месте.',
    selectionLabel:'ОГРАНИЧЕННАЯ ПОДБОРКА',selectionTitle:'Реальные анкеты. Без бесконечного каталога.',
    selectionText:'Мы показываем только одобренные анкеты людей, которые дали явное согласие на показ. Контактные данные и точная дата рождения не отображаются.',
    selectionNote:'Контактные данные всегда скрыты.',
    privacyTitle:'Вы решаете, можно ли показывать вашу анкету.',
    privacyText:'Она появится только после вашего явного согласия и одобрения DUONERA. E-mail, телефон, фамилия и точная дата рождения не показываются.',
    registerTitle:'Получите личную страницу DUONERA бесплатно.',
    registerText:'Короткая регистрация занимает около минуты. На e-mail придёт шестизначный код в кабинет с вашей анкетой, фотографиями и подборками.',
    regCheck2:'✓ Безопасный код для входа без пароля',regCheck3:'✓ E-mail и контакты не публикуются',
    formNote:'Без оплаты и обязательств. Вы решаете, показывать ли анкету.',
    discoveryLoading:'Загружаем одобренные анкеты…',noDiscoveryProfiles:'Сейчас нет доступных одобренных анкет.',openAccount:'Хочу познакомиться с этим человеком'
  }
};

Object.entries(processTranslations).forEach(([language, values]) => {
  Object.assign(translations[language], values);
});

let publicProfiles = [];
const fallback = translations.cs;
const translatable = document.querySelectorAll('[data-i18n]');
const langButtons = document.querySelectorAll('[data-lang]');

function setLanguage(lang){
  const dict = translations[lang] || fallback;
  document.documentElement.lang = lang === 'uk' ? 'uk' : lang;
  translatable.forEach(el => {
    const key = el.dataset.i18n;
    if(dict[key] || fallback[key]) el.textContent = dict[key] || fallback[key];
  });
  langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
  localStorage.setItem('duonera-lang',lang);
  if(publicProfiles.length) renderPublicProfiles();
}
langButtons.forEach(btn => btn.addEventListener('click',()=>setLanguage(btn.dataset.lang)));
setLanguage(localStorage.getItem('duonera-lang') || 'cs');

document.getElementById('year').textContent = new Date().getFullYear();

const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
menuButton.addEventListener('click',()=>{
  const open = mobileMenu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded',String(open));
  mobileMenu.setAttribute('aria-hidden',String(!open));
});
mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  mobileMenu.classList.remove('open');
  menuButton.setAttribute('aria-expanded','false');
  mobileMenu.setAttribute('aria-hidden','true');
}));

const publicProfileGrid = document.querySelector('#publicProfileGrid');
const DISCOVERY_BUCKET = 'duonera-discovery-photos';

function encodedPublicPath(path){
  return String(path).split('/').map(encodeURIComponent).join('/');
}

function publicPhotoUrl(path){
  return `${SUPABASE_URL}/storage/v1/object/public/${encodeURIComponent(DISCOVERY_BUCKET)}/${encodedPublicPath(path)}`;
}

function renderPublicProfiles(){
  if(!publicProfileGrid) return;
  const lang = localStorage.getItem('duonera-lang') || 'cs';
  const dict = translations[lang] || fallback;
  publicProfileGrid.replaceChildren();

  if(!publicProfiles.length){
    const state = document.createElement('div');
    state.className = 'public-profile-state';
    state.textContent = dict.noDiscoveryProfiles || fallback.noDiscoveryProfiles;
    publicProfileGrid.appendChild(state);
    return;
  }

  publicProfiles.slice(0,6).forEach(profile=>{
    const card = document.createElement('article');
    card.className = 'profile-card';
    const photo = document.createElement('div');
    photo.className = 'profile-photo';
    const photoPath = Array.isArray(profile.public_photo_paths) ? profile.public_photo_paths[0] : '';
    if(photoPath) photo.style.backgroundImage = `url("${publicPhotoUrl(photoPath)}")`;

    const body = document.createElement('div');
    body.className = 'profile-body';
    const title = document.createElement('h3');
    title.textContent = `${profile.first_name || 'DUONERA'}, ${profile.age || '—'}`;
    const location = document.createElement('p');
    location.className = 'location';
    location.textContent = [profile.city,profile.country].filter(Boolean).join(', ');
    const about = document.createElement('p');
    about.className = 'public-profile-about';
    about.textContent = profile.about_me || profile.relationship_goal || '—';
    const list = document.createElement('ul');
    [...(profile.traits || []),...(profile.interests || [])].slice(0,3).forEach(value=>{
      const item = document.createElement('li');
      item.textContent = value;
      list.appendChild(item);
    });
    const link = document.createElement('a');
    link.className = 'btn btn-gold';
    link.href = 'ucet.html';
    link.textContent = dict.openAccount || fallback.openAccount;
    body.append(title,location,about,list,link);
    card.append(photo,body);
    publicProfileGrid.appendChild(card);
  });
}

async function loadPublicProfiles(){
  if(!publicProfileGrid) return;
  try{
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/duonera_discovery_profiles`,{
      method:'POST',
      headers:{
        apikey:SUPABASE_PUBLISHABLE_KEY,
        Accept:'application/json',
        'Content-Type':'application/json'
      },
      body:'{}'
    });
    if(!response.ok) throw new Error('Discovery unavailable');
    publicProfiles = await response.json();
  }catch(error){
    console.error(error);
    publicProfiles = [];
  }
  renderPublicProfiles();
}


const shortRegistrationForm = document.querySelector('.register-form');
if(shortRegistrationForm){
  let isSubmitting = false;

  shortRegistrationForm.addEventListener('submit', async event => {
    event.preventDefault();
    if(isSubmitting) return;
    if(!shortRegistrationForm.reportValidity()) return;

    const honeypot = shortRegistrationForm.querySelector('[name="_honey"]');
    if(honeypot && honeypot.value) return;

    const formData = new FormData(shortRegistrationForm);
    const leadId = createUuid();
    const submitButton = shortRegistrationForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    const language = localStorage.getItem('duonera-lang') || 'cs';
    const statusMessages = {
      cs:{sending:'Ukládáme registraci…',stillSaving:'Ještě chvíli, bezpečně ukládáme…',opening:'Registrace je uložena. Posíláme kód do účtu…',error:'Registraci se nepodařilo bezpečně uložit. Zkontrolujte připojení a zkuste to znovu.'},
      en:{sending:'Saving registration…',stillSaving:'Please wait, we are saving securely…',opening:'Registration saved. Sending your account code…',error:'The registration could not be saved securely. Check your connection and try again.'},
      uk:{sending:'Зберігаємо реєстрацію…',stillSaving:'Ще мить, безпечно зберігаємо…',opening:'Реєстрацію збережено. Надсилаємо код до кабінету…',error:'Не вдалося безпечно зберегти реєстрацію. Перевірте з’єднання та спробуйте ще раз.'},
      ru:{sending:'Сохраняем регистрацию…',stillSaving:'Ещё немного, безопасно сохраняем…',opening:'Регистрация сохранена. Отправляем код в кабинет…',error:'Не удалось безопасно сохранить регистрацию. Проверьте соединение и попробуйте ещё раз.'},
      de:{sending:'Registrierung wird gespeichert…',stillSaving:'Einen Moment, wir speichern Ihre Daten sicher…',opening:'Registrierung gespeichert. Ihr Anmeldecode wird gesendet…',error:'Die Registrierung konnte nicht sicher gespeichert werden. Prüfen Sie Ihre Verbindung und versuchen Sie es erneut.'}
    };
    const status = statusMessages[language] || statusMessages.cs;

    const localData = Object.fromEntries(formData.entries());
    const payload = {
      id: leadId,
      gender: String(formData.get('Jsem') || '').trim(),
      looking_for: String(formData.get('Hledám') || '').trim(),
      age: Number(formData.get('Věk')),
      city: String(formData.get('Město') || '').trim(),
      email: String(formData.get('email') || '').trim().toLowerCase(),
      consent_privacy: formData.get('consent_privacy') === 'true',
      source: 'duonera.cz'
    };

    let stillSavingTimer;
    try{
      isSubmitting = true;
      submitButton.disabled = true;
      submitButton.textContent = status.sending;
      stillSavingTimer = window.setTimeout(()=>{
        submitButton.textContent = status.stillSaving;
      }, 4000);

      await insertRow('duonera_leads', payload, 20000);
      clearTimeout(stillSavingTimer);
      submitButton.textContent = status.opening;
      await requestEmailOtp(payload.email, `${location.origin}/ucet.html`);

      localStorage.setItem('duonera-short-registration', JSON.stringify(localData));
      localStorage.setItem('duonera-lead-id', leadId);

      const leadIdInput = document.createElement('input');
      leadIdInput.type = 'hidden';
      leadIdInput.name = 'Supabase lead ID';
      leadIdInput.value = leadId;
      shortRegistrationForm.appendChild(leadIdInput);

      HTMLFormElement.prototype.submit.call(shortRegistrationForm);
    }catch(error){
      console.error(error);
      clearTimeout(stillSavingTimer);
      isSubmitting = false;
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
      toast.textContent = status.error;
      toast.classList.add('show');
      clearTimeout(window.__toastTimer);
      window.__toastTimer = setTimeout(()=>toast.classList.remove('show'), 5200);
    }
  });
}

const toast = document.querySelector('.toast');
loadPublicProfiles();
