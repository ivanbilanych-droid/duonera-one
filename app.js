import {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  createUuid,
  insertRow
} from './supabase-client.js?v=5';

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
    createProfile:'Chci být mezi prvními 20 členy',submit:'Chci být mezi prvními 20 členy',formNote:'Zdarma a bez závazku. DUONERA vás osobně kontaktuje a pomůže vytvořit ověřený profil.',
    foundingTitle:'Zakládající skupina DUONERA',foundingText:'Budujeme komunitu nezadaných lidí, kteří hledají svou životní perlu.',foundingMembers:'Přijímáme prvních 20 ověřených členů z celé České republiky. Registrace a vytvoření profilu jsou zdarma.',
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
    registerText:'Krátká registrace trvá přibližně jednu minutu. Poté si vytvoříte účet pomocí e-mailu a hesla a adresu jednou potvrdíte odkazem v e-mailu.',
    regCheck2:'✓ E-mail potvrdíte pouze jednou',regCheck3:'✓ E-mail a kontaktní údaje nezveřejňujeme',
    formNote:'Bez platby a bez závazku. O zobrazení profilu rozhodujete vy.',
    heroKicker:'SOUKROMÝ KLUB PRO SKUTEČNÁ SETKÁNÍ',heroLine1:'Nečekejte',heroLine2:'na náhodu.',heroLine3:'Poznejte někoho výjimečného.',
    heroLead:'Prohlédněte si několik vybraných lidí, kteří také hledají vážný vztah. Žádné nekonečné swipování. Jen skutečný zájem a cesta ke schůzce.',
    heroChoiceLabel:'Koho chcete poznat?',heroChoiceWoman:'Chci poznat ženu',heroChoiceMan:'Chci poznat muže',heroExample:'Ukázka člena DUONERA',
    registerFree:'Vstoupit do klubu',createProfile:'Chci vstoupit do DUONERA',submit:'Chci vstoupit do DUONERA',continue:'Pokračovat',
    selectionLabel:'KOHO MŮŽETE POTKAT',selectionTitle:'Nejdřív člověk. Potom vysvětlování.',selectionText:'Pár vybraných profilů vám ukáže, zda přeskočí jiskra. Kontakty zůstávají skryté, dokud není zájem vzájemný.',selectionNote:'Ukázkové profily vysvětlují princip. Skutečné profily zobrazujeme pouze se souhlasem.',
    registerLabel:'SOUKROMÝ VSTUP',registerTitle:'Řekněte nám jen to nejdůležitější.',registerText:'Stačí věk, město a e-mail. Zabere to přibližně 30 sekund.',
    howTitle:'Od prvního pohledu ke skutečné schůzce.',privacyTitle:'Vy rozhodujete, kdo vás uvidí.',footerTag:'Méně profilů. Více chemie. Skutečné setkání.',
    discoveryLoading:'Načítání schválených profilů…',noDiscoveryProfiles:'Momentálně nejsou k dispozici žádné schválené profily.',openAccount:'Chci ji poznat',openAccountMale:'Chci ho poznat'
  },
  en:{
    account:'My account',navSelection:'Profiles',
    createProfile:'Join the first 20 members',submit:'Join the first 20 members',formNote:'Free and without obligation. DUONERA will contact you personally and help create your verified profile.',
    foundingTitle:'Founding group DUONERA',foundingText:'We are building a community of single people looking for their life partner — their pearl.',foundingMembers:'We are accepting the first 20 verified members from across the Czech Republic. Registration and profile creation are free.',
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
    registerText:'Short registration takes about one minute. Then create your account with an email and password and confirm the address once using the email link.',
    regCheck2:'✓ Confirm your email only once',regCheck3:'✓ Email and contact details are never public',
    formNote:'No payment and no obligation. You decide whether your profile is displayed.',
    heroKicker:'A PRIVATE CLUB FOR REAL MEETINGS',heroLine1:'Do not wait',heroLine2:'for chance.',heroLine3:'Meet someone exceptional.',
    heroLead:'Discover a few selected people who are also looking for a serious relationship. No endless swiping. Just genuine interest and a path to a real date.',
    heroChoiceLabel:'Who would you like to meet?',heroChoiceWoman:'I want to meet a woman',heroChoiceMan:'I want to meet a man',heroExample:'DUONERA member example',
    registerFree:'Enter the club',createProfile:'I want to join DUONERA',submit:'I want to join DUONERA',continue:'Continue',
    selectionLabel:'WHO YOU CAN MEET',selectionTitle:'People first. Explanations second.',selectionText:'A few selected profiles let you see whether there is a spark. Contact details stay hidden until the interest is mutual.',selectionNote:'Example profiles explain the concept. Real profiles are shown only with consent.',
    registerLabel:'PRIVATE ENTRY',registerTitle:'Tell us only what matters.',registerText:'Just your age, city and email. It takes about 30 seconds.',
    howTitle:'From the first look to a real date.',privacyTitle:'You decide who can see you.',footerTag:'Fewer profiles. More chemistry. A real meeting.',
    discoveryLoading:'Loading approved profiles…',noDiscoveryProfiles:'No approved profiles are available at the moment.',openAccount:'I want to meet her',openAccountMale:'I want to meet him'
  },
  de:{
    account:'Mein Konto',navSelection:'Profile',
    createProfile:'Zu den ersten 20 Mitgliedern',submit:'Zu den ersten 20 Mitgliedern',formNote:'Kostenlos und unverbindlich. DUONERA kontaktiert Sie persönlich und hilft bei Ihrem verifizierten Profil.',
    foundingTitle:'DUONERA Gründungsgruppe',foundingText:'Wir bauen eine Gemeinschaft alleinstehender Menschen auf, die ihre Perle fürs Leben suchen.',foundingMembers:'Wir nehmen die ersten 20 verifizierten Mitglieder aus der ganzen Tschechischen Republik auf. Registrierung und Profilerstellung sind kostenlos.',
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
    registerText:'Die kurze Registrierung dauert etwa eine Minute. Danach erstellen Sie Ihr Konto mit E-Mail und Passwort und bestätigen die Adresse einmal über den Link in der E-Mail.',
    regCheck2:'✓ E-Mail nur einmal bestätigen',regCheck3:'✓ E-Mail und Kontaktdaten sind nie öffentlich',
    formNote:'Keine Zahlung und keine Verpflichtung. Sie entscheiden über die Anzeige Ihres Profils.',
    heroKicker:'EIN PRIVATER CLUB FÜR ECHTE TREFFEN',heroLine1:'Warten Sie nicht',heroLine2:'auf den Zufall.',heroLine3:'Lernen Sie jemanden Besonderen kennen.',
    heroLead:'Entdecken Sie einige ausgewählte Menschen, die ebenfalls eine ernsthafte Beziehung suchen. Kein endloses Swipen. Nur echtes Interesse und der Weg zu einem Treffen.',
    heroChoiceLabel:'Wen möchten Sie kennenlernen?',heroChoiceWoman:'Ich möchte eine Frau kennenlernen',heroChoiceMan:'Ich möchte einen Mann kennenlernen',heroExample:'DUONERA Profilbeispiel',
    registerFree:'Club beitreten',createProfile:'Ich möchte DUONERA beitreten',submit:'Ich möchte DUONERA beitreten',continue:'Weiter',
    selectionLabel:'WEN SIE KENNENLERNEN KÖNNEN',selectionTitle:'Zuerst der Mensch. Dann die Erklärung.',selectionText:'Einige ausgewählte Profile zeigen, ob der Funke überspringt. Kontaktdaten bleiben verborgen, bis das Interesse gegenseitig ist.',selectionNote:'Beispielprofile erklären das Prinzip. Echte Profile werden nur mit Zustimmung gezeigt.',
    registerLabel:'PRIVATER EINTRITT',registerTitle:'Sagen Sie uns nur das Wichtigste.',registerText:'Nur Alter, Stadt und E-Mail. Das dauert etwa 30 Sekunden.',
    howTitle:'Vom ersten Blick zum echten Treffen.',privacyTitle:'Sie entscheiden, wer Sie sehen darf.',footerTag:'Weniger Profile. Mehr Chemie. Ein echtes Treffen.',
    discoveryLoading:'Geprüfte Profile werden geladen…',noDiscoveryProfiles:'Zurzeit sind keine geprüften Profile verfügbar.',openAccount:'Ich möchte sie kennenlernen',openAccountMale:'Ich möchte ihn kennenlernen'
  },
  uk:{
    account:'Мій кабінет',navSelection:'Анкети',
    createProfile:'Хочу бути серед перших 20 учасників',submit:'Хочу бути серед перших 20 учасників',formNote:'Безкоштовно і без зобов’язань. DUONERA особисто зв’яжеться з вами та допоможе створити перевірену анкету.',
    foundingTitle:'Засновницька група DUONERA',foundingText:'Ми створюємо спільноту самотніх людей, які шукають свою життєву перлину.',foundingMembers:'Приймаємо перших 20 перевірених учасників з усієї Чеської Республіки. Реєстрація та створення анкети безкоштовні.',
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
    registerText:'Коротка реєстрація займає близько хвилини. Потім створіть акаунт за допомогою e-mail і пароля та один раз підтвердьте адресу посиланням у листі.',
    regCheck2:'✓ Підтвердження e-mail лише один раз',regCheck3:'✓ E-mail і контакти не публікуються',
    formNote:'Без оплати та зобов’язань. Ви вирішуєте, чи показувати анкету.',
    heroKicker:'ПРИВАТНИЙ КЛУБ ДЛЯ СПРАВЖНІХ ЗУСТРІЧЕЙ',heroLine1:'Не чекайте',heroLine2:'на випадковість.',heroLine3:'Познайомтеся з особливою людиною.',
    heroLead:'Перегляньте кілька відібраних людей, які також шукають серйозні стосунки. Без нескінченного гортання. Лише справжній інтерес і шлях до зустрічі.',
    heroChoiceLabel:'З ким хочете познайомитися?',heroChoiceWoman:'Хочу познайомитися з жінкою',heroChoiceMan:'Хочу познайомитися з чоловіком',heroExample:'Приклад учасника DUONERA',
    registerFree:'Увійти до клубу',createProfile:'Хочу приєднатися до DUONERA',submit:'Хочу приєднатися до DUONERA',continue:'Продовжити',
    selectionLabel:'КОГО ВИ МОЖЕТЕ ЗУСТРІТИ',selectionTitle:'Спочатку людина. Потім пояснення.',selectionText:'Кілька відібраних анкет покажуть, чи виникає іскра. Контакти приховані, доки інтерес не стане взаємним.',selectionNote:'Приклади анкет пояснюють принцип. Реальні анкети показуємо лише за згодою.',
    registerLabel:'ПРИВАТНИЙ ВСТУП',registerTitle:'Розкажіть лише найважливіше.',registerText:'Лише вік, місто та e-mail. Це займе близько 30 секунд.',
    howTitle:'Від першого погляду до справжньої зустрічі.',privacyTitle:'Ви вирішуєте, хто вас побачить.',footerTag:'Менше анкет. Більше хімії. Справжня зустріч.',
    discoveryLoading:'Завантажуємо схвалені анкети…',noDiscoveryProfiles:'Наразі немає доступних схвалених анкет.',openAccount:'Хочу познайомитися з нею',openAccountMale:'Хочу познайомитися з ним'
  },
  ru:{
    account:'Мой кабинет',navSelection:'Анкеты',
    createProfile:'Хочу войти в первые 20 участников',submit:'Хочу войти в первые 20 участников',formNote:'Бесплатно и без обязательств. DUONERA лично свяжется с вами и поможет создать проверенную анкету.',
    foundingTitle:'Первая группа DUONERA',foundingText:'Мы создаём сообщество одиноких людей, которые ищут свою жемчужину жизни.',foundingMembers:'Принимаем первых 20 проверенных участников со всей Чехии. Регистрация и создание анкеты бесплатны.',
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
    registerText:'Короткая регистрация занимает около минуты. Затем создайте аккаунт с e-mail и паролем и один раз подтвердите адрес по ссылке из письма.',
    regCheck2:'✓ Подтверждение e-mail только один раз',regCheck3:'✓ E-mail и контакты не публикуются',
    formNote:'Без оплаты и обязательств. Вы решаете, показывать ли анкету.',
    heroKicker:'ЗАКРЫТЫЙ КЛУБ ДЛЯ НАСТОЯЩИХ ВСТРЕЧ',heroLine1:'Не ждите',heroLine2:'случайности.',heroLine3:'Познакомьтесь с особенным человеком.',
    heroLead:'Посмотрите несколько отобранных людей, которые тоже ищут серьёзные отношения. Никакого бесконечного листания. Только настоящий интерес и путь к встрече.',
    heroChoiceLabel:'С кем хотите познакомиться?',heroChoiceWoman:'Хочу познакомиться с женщиной',heroChoiceMan:'Хочу познакомиться с мужчиной',heroExample:'Пример участника DUONERA',
    registerFree:'Войти в клуб',createProfile:'Хочу вступить в DUONERA',submit:'Хочу вступить в DUONERA',continue:'Продолжить',
    selectionLabel:'КОГО МОЖНО ВСТРЕТИТЬ',selectionTitle:'Сначала человек. Потом объяснения.',selectionText:'Несколько отобранных анкет покажут, возникает ли искра. Контакты скрыты, пока интерес не станет взаимным.',selectionNote:'Примеры анкет объясняют принцип. Настоящие анкеты показываем только с согласия.',
    registerLabel:'ЗАКРЫТЫЙ ВХОД',registerTitle:'Расскажите только самое важное.',registerText:'Только возраст, город и e-mail. Это займёт около 30 секунд.',
    howTitle:'От первого взгляда до настоящей встречи.',privacyTitle:'Вы решаете, кто вас увидит.',footerTag:'Меньше анкет. Больше химии. Настоящая встреча.',
    discoveryLoading:'Загружаем одобренные анкеты…',noDiscoveryProfiles:'Сейчас нет доступных одобренных анкет.',openAccount:'Хочу познакомиться с ней',openAccountMale:'Хочу познакомиться с ним'
  }
};

const conversionTranslations = {
  cs: {
    registerFree:'Vstoupit zdarma', heroKicker:'SOUKROMÝ EVROPSKÝ KLUB PRO SKUTEČNÉ VZTAHY',
    heroConversionTitle:'Najděte svou jedinou perlu.',
    heroConversionLead:'Ne stovky profilů. Jeden člověk, kterého stojí za to potkat. DUONERA vybírá, ověřuje a propojuje lidi se stejným vážným záměrem.',
    heroSignature:'Každý profil prochází osobní kontrolou.', heroImageCaption:'Chemie začíná pohledem.',
    europeLine:'Česko · Polsko · Německo · Slovensko · celá Evropa', formKicker:'SOUKROMÁ POZVÁNKA', formConversionTitle:'Vstupte do DUONERA za 30 sekund',
    submitConversion:'Přijmout soukromou pozvánku', formConversionNote:'Bez platby. Bez veřejného profilu. Bez automatického předplatného.',
    heroCaption:'Ne náhoda. Vzájemná volba.', trustStartTitle:'Začátek zdarma', trustStartText:'Bez karty a bez závazku',
    trustPrivacyTitle:'Soukromý profil', trustPrivacyText:'Kontakty nezveřejňujeme', trustEuropeTitle:'Celá Evropa', trustEuropeText:'Nezáleží, kde právě žijete',
    trustGoalTitle:'Skutečný cíl', trustGoalText:'Seznámení, ne nekonečný chat', manifestoLabel:'PRO NOVOU KAPITOLU ŽIVOTA',
    manifestoTitle:'Ne další seznamka. Cesta ke skutečnému člověku.', manifestoText:'Život se mění: nové město, nová země, nový začátek. DUONERA je pro ty, kteří chtějí znovu cítit blízkost a potkat člověka se stejným záměrem.',
    manifestoCta:'Udělat první krok →', howConversionTitle:'Tři kroky od registrace ke skutečnému setkání.',
    how1Title:'Řeknete, koho hledáte', how1Text:'Krátká registrace nám dá základ. Podrobný profil doplníte až potom.',
    how2Title:'Uvidíte vhodné lidi', how2Text:'Méně profilů, více pozornosti. Žádný nekonečný veřejný katalog.',
    how3Title:'Potvrdíte vzájemný zájem', how3Text:'Kontakty se otevírají až po vzájemné volbě a DUONERA pomůže se setkáním.',
    privacyConversionLabel:'PRIVÁTNOST JE SOUČÁST LUXUSU', privacyConversionTitle:'Vy rozhodujete, kdo vás uvidí.',
    privacyConversionText:'E-mail, telefon, příjmení a přesné datum narození nezveřejňujeme. Profil se zobrazuje pouze v rámci soukromého výběru.',
    footerConversionTag:'Najděte svou jedinou perlu.',
    productLabel:'NE DALŠÍ SEZNAMKA', productTitle:'Méně lidí. Vyšší úroveň. Větší šance.', productText:'DUONERA není veřejný katalog. Po registraci uvidíte pouze skutečné schválené profily, které odpovídají tomu, koho hledáte.',
    openClub:'Otevřít DUONERA', verifiedSelection:'OVĚŘENÝ SOUKROMÝ VÝBĚR', realProfilesAfterLogin:'Skutečné profily uvidíte po přihlášení', pointVerified:'Ověření lidé', pointIntent:'Vážný vztah', pointMutual:'Vzájemná volba', startSelection:'Začít svůj výběr',
    appInstallTitle:'DUONERA v telefonu', appInstallText:'Rychlý přístup bez lišty prohlížeče', appInstallButton:'Nainstalovat',
    appInstallHelpTitle:'Přidejte DUONERA na plochu', appInstallHelpText:'Aplikace se otevře přes celou obrazovku a bude vždy po ruce.'
  },
  en: {
    registerFree:'Enter for free', heroKicker:'A PRIVATE EUROPEAN CLUB FOR REAL RELATIONSHIPS',
    heroConversionTitle:'Find your one true pearl.',
    heroConversionLead:'Not hundreds of profiles. One person worth meeting. DUONERA selects, verifies and connects people who share the same serious intention.',
    heroSignature:'Every profile is personally reviewed.', heroImageCaption:'Chemistry begins with a look.',
    europeLine:'Czechia · Poland · Germany · Slovakia · all of Europe', formKicker:'PRIVATE INVITATION', formConversionTitle:'Enter DUONERA in 30 seconds',
    submitConversion:'Accept the private invitation', formConversionNote:'No payment. No public profile. No automatic subscription.',
    heroCaption:'Not chance. A mutual choice.', trustStartTitle:'Free to start', trustStartText:'No card and no commitment',
    trustPrivacyTitle:'Private profile', trustPrivacyText:'Contact details stay hidden', trustEuropeTitle:'Across Europe', trustEuropeText:'Where you live does not matter',
    trustGoalTitle:'A real goal', trustGoalText:'A meeting, not endless chat', manifestoLabel:'FOR A NEW CHAPTER',
    manifestoTitle:'Not another dating app. A path to a real person.', manifestoText:'Life changes: a new city, a new country, a new beginning. DUONERA is for people ready to feel close again and meet someone with the same intention.',
    manifestoCta:'Take the first step →', howConversionTitle:'Three steps from registration to a real meeting.',
    how1Title:'Tell us who you are looking for', how1Text:'A short registration gives us the essentials. Complete your detailed profile afterwards.',
    how2Title:'See suitable people', how2Text:'Fewer profiles, more attention. No endless public catalogue.',
    how3Title:'Confirm mutual interest', how3Text:'Contact details open only after a mutual choice, and DUONERA helps with the meeting.',
    privacyConversionLabel:'PRIVACY IS PART OF LUXURY', privacyConversionTitle:'You decide who can see you.',
    privacyConversionText:'We never publish your email, phone, surname or exact date of birth. Your profile appears only within a private selection.',
    footerConversionTag:'Find your one true pearl.',
    productLabel:'NOT ANOTHER DATING APP', productTitle:'Fewer people. A higher standard. A better chance.', productText:'DUONERA is not a public catalogue. After registration you see only real, approved profiles that match who you are looking for.',
    openClub:'Open DUONERA', verifiedSelection:'VERIFIED PRIVATE SELECTION', realProfilesAfterLogin:'See real profiles after signing in', pointVerified:'Verified people', pointIntent:'Serious relationship', pointMutual:'Mutual choice', startSelection:'Start my selection',
    appInstallTitle:'DUONERA on your phone', appInstallText:'Fast access without the browser bar', appInstallButton:'Install',
    appInstallHelpTitle:'Add DUONERA to your Home Screen', appInstallHelpText:'The app opens full screen and stays within easy reach.'
  },
  de: {
    registerFree:'Kostenlos eintreten', heroKicker:'EIN PRIVATER EUROPÄISCHER CLUB FÜR ECHTE BEZIEHUNGEN',
    heroConversionTitle:'Finden Sie Ihre eine besondere Perle.',
    heroConversionLead:'Nicht Hunderte Profile. Ein Mensch, den es sich zu treffen lohnt. DUONERA wählt aus, prüft und verbindet Menschen mit derselben ernsthaften Absicht.',
    heroSignature:'Jedes Profil wird persönlich geprüft.', heroImageCaption:'Chemie beginnt mit einem Blick.',
    europeLine:'Tschechien · Polen · Deutschland · Slowakei · ganz Europa', formKicker:'PRIVATE EINLADUNG', formConversionTitle:'In 30 Sekunden zu DUONERA',
    submitConversion:'Private Einladung annehmen', formConversionNote:'Keine Zahlung. Kein öffentliches Profil. Kein automatisches Abo.',
    heroCaption:'Kein Zufall. Eine gemeinsame Wahl.', trustStartTitle:'Kostenlos starten', trustStartText:'Ohne Karte und Verpflichtung',
    trustPrivacyTitle:'Privates Profil', trustPrivacyText:'Kontaktdaten bleiben verborgen', trustEuropeTitle:'Ganz Europa', trustEuropeText:'Ihr Wohnort spielt keine Rolle',
    trustGoalTitle:'Ein echtes Ziel', trustGoalText:'Begegnung statt endlosem Chat', manifestoLabel:'FÜR EIN NEUES KAPITEL',
    manifestoTitle:'Nicht noch eine Dating-App. Der Weg zu einem echten Menschen.', manifestoText:'Das Leben verändert sich: eine neue Stadt, ein neues Land, ein neuer Anfang. DUONERA ist für Menschen, die wieder Nähe spüren und jemanden mit derselben Absicht treffen möchten.',
    manifestoCta:'Den ersten Schritt machen →', howConversionTitle:'Drei Schritte von der Registrierung zur echten Begegnung.',
    how1Title:'Sagen Sie, wen Sie suchen', how1Text:'Die kurze Registrierung gibt uns die Basis. Ihr ausführliches Profil ergänzen Sie danach.',
    how2Title:'Sehen Sie passende Menschen', how2Text:'Weniger Profile, mehr Aufmerksamkeit. Kein endloser öffentlicher Katalog.',
    how3Title:'Bestätigen Sie gegenseitiges Interesse', how3Text:'Kontaktdaten öffnen sich erst bei gegenseitiger Wahl. DUONERA hilft beim Treffen.',
    privacyConversionLabel:'PRIVATSPHÄRE GEHÖRT ZUM LUXUS', privacyConversionTitle:'Sie entscheiden, wer Sie sehen darf.',
    privacyConversionText:'E-Mail, Telefon, Nachname und genaues Geburtsdatum werden nicht veröffentlicht. Ihr Profil erscheint nur in einer privaten Auswahl.',
    footerConversionTag:'Finden Sie Ihre eine besondere Perle.',
    productLabel:'NICHT NOCH EINE DATING-APP', productTitle:'Weniger Menschen. Höheres Niveau. Bessere Chancen.', productText:'DUONERA ist kein öffentlicher Katalog. Nach der Registrierung sehen Sie nur echte, geprüfte Profile, die zu Ihrer Suche passen.',
    openClub:'DUONERA öffnen', verifiedSelection:'GEPRÜFTE PRIVATE AUSWAHL', realProfilesAfterLogin:'Echte Profile nach der Anmeldung sehen', pointVerified:'Geprüfte Menschen', pointIntent:'Ernste Beziehung', pointMutual:'Gegenseitige Wahl', startSelection:'Meine Auswahl starten',
    appInstallTitle:'DUONERA auf Ihrem Handy', appInstallText:'Schneller Zugriff ohne Browserleiste', appInstallButton:'Installieren',
    appInstallHelpTitle:'DUONERA zum Startbildschirm hinzufügen', appInstallHelpText:'Die App öffnet sich im Vollbild und ist immer griffbereit.'
  },
  uk: {
    registerFree:'Увійти безкоштовно', heroKicker:'ПРИВАТНИЙ ЄВРОПЕЙСЬКИЙ КЛУБ ДЛЯ СПРАВЖНІХ СТОСУНКІВ',
    heroConversionTitle:'Знайдіть свою єдину перлину.',
    heroConversionLead:'Не сотні анкет. Одна людина, яку варто зустріти. DUONERA відбирає, перевіряє та поєднує людей зі спільним серйозним наміром.',
    heroSignature:'Кожна анкета проходить особисту перевірку.', heroImageCaption:'Хімія починається з погляду.',
    europeLine:'Чехія · Польща · Німеччина · Словаччина · вся Європа', formKicker:'ПРИВАТНЕ ЗАПРОШЕННЯ', formConversionTitle:'Увійдіть до DUONERA за 30 секунд',
    submitConversion:'Прийняти приватне запрошення', formConversionNote:'Без оплати. Без публічної анкети. Без автоматичної підписки.',
    heroCaption:'Не випадковість. Взаємний вибір.', trustStartTitle:'Початок безкоштовний', trustStartText:'Без картки та зобов’язань',
    trustPrivacyTitle:'Приватна анкета', trustPrivacyText:'Контакти залишаються прихованими', trustEuropeTitle:'Уся Європа', trustEuropeText:'Неважливо, де ви зараз живете',
    trustGoalTitle:'Справжня мета', trustGoalText:'Зустріч, а не нескінченний чат', manifestoLabel:'ДЛЯ НОВОГО РОЗДІЛУ ЖИТТЯ',
    manifestoTitle:'Не ще один застосунок. Шлях до справжньої людини.', manifestoText:'Життя змінюється: нове місто, нова країна, новий початок. DUONERA — для тих, хто хоче знову відчути близькість і зустріти людину з таким самим наміром.',
    manifestoCta:'Зробити перший крок →', howConversionTitle:'Три кроки від реєстрації до справжньої зустрічі.',
    how1Title:'Розкажіть, кого шукаєте', how1Text:'Коротка реєстрація дає нам основу. Детальну анкету заповните пізніше.',
    how2Title:'Побачте відповідних людей', how2Text:'Менше анкет, більше уваги. Жодного нескінченного публічного каталогу.',
    how3Title:'Підтвердьте взаємний інтерес', how3Text:'Контакти відкриваються лише після взаємного вибору, а DUONERA допомагає із зустріччю.',
    privacyConversionLabel:'ПРИВАТНІСТЬ — ЧАСТИНА РОЗКОШІ', privacyConversionTitle:'Ви вирішуєте, хто вас побачить.',
    privacyConversionText:'Ми не публікуємо e-mail, телефон, прізвище чи точну дату народження. Анкета з’являється лише у приватній добірці.',
    footerConversionTag:'Знайдіть свою єдину перлину.',
    productLabel:'НЕ ЩЕ ОДИН ЗАСТОСУНОК', productTitle:'Менше людей. Вищий рівень. Більший шанс.', productText:'DUONERA — не публічний каталог. Після реєстрації ви бачите лише справжні схвалені анкети, що відповідають вашому пошуку.',
    openClub:'Відкрити DUONERA', verifiedSelection:'ПЕРЕВІРЕНА ПРИВАТНА ДОБІРКА', realProfilesAfterLogin:'Справжні анкети — після входу', pointVerified:'Перевірені люди', pointIntent:'Серйозні стосунки', pointMutual:'Взаємний вибір', startSelection:'Почати свою добірку',
    appInstallTitle:'DUONERA у вашому телефоні', appInstallText:'Швидкий доступ без панелі браузера', appInstallButton:'Встановити',
    appInstallHelpTitle:'Додайте DUONERA на головний екран', appInstallHelpText:'Застосунок відкриватиметься на весь екран і завжди буде поруч.'
  },
  ru: {
    registerFree:'Войти бесплатно', heroKicker:'ЗАКРЫТЫЙ ЕВРОПЕЙСКИЙ КЛУБ ДЛЯ НАСТОЯЩИХ ОТНОШЕНИЙ',
    heroConversionTitle:'Найдите свою единственную жемчужину.',
    heroConversionLead:'Не сотни анкет. Один человек, которого стоит встретить. DUONERA отбирает, проверяет и соединяет людей с одинаково серьёзными намерениями.',
    heroSignature:'Каждая анкета проходит личную проверку.', heroImageCaption:'Химия начинается со взгляда.',
    europeLine:'Чехия · Польша · Германия · Словакия · вся Европа', formKicker:'ЗАКРЫТОЕ ПРИГЛАШЕНИЕ', formConversionTitle:'Войдите в DUONERA за 30 секунд',
    submitConversion:'Принять закрытое приглашение', formConversionNote:'Без оплаты. Без публичной анкеты. Без автоматической подписки.',
    heroCaption:'Не случайность. Взаимный выбор.', trustStartTitle:'Начало бесплатно', trustStartText:'Без карты и обязательств',
    trustPrivacyTitle:'Приватная анкета', trustPrivacyText:'Контакты остаются скрытыми', trustEuropeTitle:'Вся Европа', trustEuropeText:'Неважно, где вы сейчас живёте',
    trustGoalTitle:'Настоящая цель', trustGoalText:'Встреча, а не бесконечный чат', manifestoLabel:'ДЛЯ НОВОЙ ГЛАВЫ ЖИЗНИ',
    manifestoTitle:'Не ещё одно приложение. Путь к настоящему человеку.', manifestoText:'Жизнь меняется: новый город, новая страна, новое начало. DUONERA — для тех, кто хочет снова почувствовать близость и встретить человека с теми же намерениями.',
    manifestoCta:'Сделать первый шаг →', howConversionTitle:'Три шага от регистрации до настоящей встречи.',
    how1Title:'Расскажите, кого ищете', how1Text:'Короткая регистрация даёт нам основу. Подробную анкету заполните позже.',
    how2Title:'Увидьте подходящих людей', how2Text:'Меньше анкет, больше внимания. Никакого бесконечного публичного каталога.',
    how3Title:'Подтвердите взаимный интерес', how3Text:'Контакты открываются только после взаимного выбора, а DUONERA помогает со встречей.',
    privacyConversionLabel:'ПРИВАТНОСТЬ — ЧАСТЬ РОСКОШИ', privacyConversionTitle:'Вы решаете, кто вас увидит.',
    privacyConversionText:'Мы не публикуем e-mail, телефон, фамилию и точную дату рождения. Анкета появляется только в приватной подборке.',
    footerConversionTag:'Найдите свою единственную жемчужину.',
    productLabel:'НЕ ЕЩЁ ОДНО ПРИЛОЖЕНИЕ', productTitle:'Меньше людей. Выше уровень. Больше шанс.', productText:'DUONERA — не публичный каталог. После регистрации вы увидите только реальные одобренные анкеты, соответствующие вашему поиску.',
    openClub:'Открыть DUONERA', verifiedSelection:'ПРОВЕРЕННАЯ ПРИВАТНАЯ ПОДБОРКА', realProfilesAfterLogin:'Реальные анкеты — после входа', pointVerified:'Проверенные люди', pointIntent:'Серьёзные отношения', pointMutual:'Взаимный выбор', startSelection:'Начать свою подборку',
    appInstallTitle:'DUONERA в телефоне', appInstallText:'Быстрый доступ без панели браузера', appInstallButton:'Установить',
    appInstallHelpTitle:'Добавьте DUONERA на главный экран', appInstallHelpText:'Приложение откроется на весь экран и всегда будет под рукой.'
  }
};

const foundingTranslations = {
  cs: {
    registerFree:'Přidat svůj profil', heroKicker:'PRVNÍ OVĚŘENÁ SKUPINA DUONERA', heroConversionTitle:'Lidé, které stojí za to potkat.',
    heroConversionLead:'Budujeme komunitu nezadaných lidí, kteří hledají vztah s budoucností. Přidejte svůj profil. Po kontrole sami rozhodnete, zda může být viditelný.',
    heroImageCaption:'Ilustrační fotografie — nikoli členové DUONERA.', formKicker:'ZAKLÁDAJÍCÍ ČLENSTVÍ', formConversionTitle:'Přidejte se mezi první ověřené členy',
    submitConversion:'Vytvořit profil zdarma', formConversionNote:'Bez platby. O zobrazení profilu rozhodujete vy.', peopleLabel:'OVĚŘENÍ LIDÉ',
    peopleTitle:'Podívejte se, koho můžete v DUONERA potkat.', peopleText:'Zobrazujeme pouze schválené profily lidí, kteří s náhledem výslovně souhlasili. Kontaktní údaje zůstávají skryté.',
    foundingLabel:'ZAKLÁDAJÍCÍ SKUPINA SE PRÁVĚ OTEVÍRÁ', foundingTitle:'První skutečné profily začínají právě u vás.',
    foundingText:'Vyplňte vlastní profil a fotografie. Po kontrole rozhodnete, zda se váš náhled zobrazí ostatním. Příjmení, telefon ani e-mail nezveřejňujeme.', foundingCta:'Přidat svůj profil'
  },
  en: {
    registerFree:'Add my profile', heroKicker:'FIRST VERIFIED DUONERA GROUP', heroConversionTitle:'People worth meeting.',
    heroConversionLead:'We are building a community of single people looking for a relationship with a future. Add your profile. After review, you decide whether it may be shown.',
    heroImageCaption:'Illustrative campaign photography — not DUONERA members.', formKicker:'FOUNDING MEMBERSHIP', formConversionTitle:'Join the first verified members',
    submitConversion:'Create my profile free', formConversionNote:'No payment. You decide whether your profile is shown.', peopleLabel:'VERIFIED PEOPLE', peopleTitle:'See who you could meet in DUONERA.',
    peopleText:'We show only approved profiles from people who expressly agreed to the preview. Contact details remain hidden.', foundingLabel:'THE FOUNDING GROUP IS NOW OPEN',
    foundingTitle:'The first real profiles begin with you.', foundingText:'Complete your profile and add photos. After review, you decide whether the preview appears to others. We never publish your surname, phone or email.', foundingCta:'Add my profile'
  },
  de: {
    registerFree:'Mein Profil hinzufügen', heroKicker:'ERSTE GEPRÜFTE DUONERA-GRUPPE', heroConversionTitle:'Menschen, die es wert sind, sie kennenzulernen.',
    heroConversionLead:'Wir bauen eine Gemeinschaft alleinstehender Menschen auf, die eine Beziehung mit Zukunft suchen. Legen Sie Ihr Profil an. Nach der Prüfung entscheiden Sie selbst, ob es sichtbar sein darf.',
    heroImageCaption:'Illustrative Kampagnenfotografie — keine DUONERA-Mitglieder.', formKicker:'GRÜNDUNGSMITGLIEDSCHAFT', formConversionTitle:'Werden Sie eines der ersten geprüften Mitglieder',
    submitConversion:'Profil kostenlos erstellen', formConversionNote:'Keine Zahlung. Sie entscheiden über die Sichtbarkeit.', peopleLabel:'GEPRÜFTE MENSCHEN', peopleTitle:'Sehen Sie, wen Sie bei DUONERA treffen könnten.',
    peopleText:'Wir zeigen nur geprüfte Profile von Menschen, die der Vorschau ausdrücklich zugestimmt haben. Kontaktdaten bleiben verborgen.', foundingLabel:'DIE GRÜNDUNGSGRUPPE IST JETZT OFFEN',
    foundingTitle:'Die ersten echten Profile beginnen mit Ihnen.', foundingText:'Füllen Sie Ihr Profil aus und laden Sie Fotos hoch. Nach der Prüfung entscheiden Sie, ob Ihre Vorschau sichtbar wird. Nachname, Telefon und E-Mail veröffentlichen wir nie.', foundingCta:'Mein Profil hinzufügen'
  },
  uk: {
    registerFree:'Додати свою анкету', heroKicker:'ПЕРША ПЕРЕВІРЕНА ГРУПА DUONERA', heroConversionTitle:'Люди, з якими варто познайомитися.',
    heroConversionLead:'Ми створюємо спільноту самотніх людей, які шукають стосунків із майбутнім. Додайте анкету. Після перевірки ви самі вирішите, чи показувати її.',
    heroImageCaption:'Ілюстративне фото кампанії — не учасники DUONERA.', formKicker:'ЧЛЕНСТВО ЗАСНОВНИКІВ', formConversionTitle:'Приєднайтеся до перших перевірених учасників',
    submitConversion:'Створити анкету безкоштовно', formConversionNote:'Без оплати. Ви самі вирішуєте, чи показувати анкету.', peopleLabel:'ПЕРЕВІРЕНІ ЛЮДИ', peopleTitle:'Подивіться, кого можна зустріти в DUONERA.',
    peopleText:'Ми показуємо лише схвалені анкети людей, які прямо погодилися на попередній перегляд. Контактні дані залишаються прихованими.', foundingLabel:'ГРУПА ЗАСНОВНИКІВ УЖЕ ВІДКРИТА',
    foundingTitle:'Перші справжні анкети починаються з вас.', foundingText:'Заповніть анкету й додайте фотографії. Після перевірки ви вирішите, чи показувати її іншим. Прізвище, телефон та e-mail ми не публікуємо.', foundingCta:'Додати свою анкету'
  },
  ru: {
    registerFree:'Добавить свою анкету', heroKicker:'ПЕРВАЯ ПРОВЕРЕННАЯ ГРУППА DUONERA', heroConversionTitle:'Люди, с которыми стоит познакомиться.',
    heroConversionLead:'Мы создаём сообщество одиноких людей, которые ищут отношения с будущим. Добавьте анкету. После проверки вы сами решите, можно ли её показывать.',
    heroImageCaption:'Иллюстративное фото кампании — не участники DUONERA.', formKicker:'ЧЛЕНСТВО ОСНОВАТЕЛЕЙ', formConversionTitle:'Присоединитесь к первым проверенным участникам',
    submitConversion:'Создать анкету бесплатно', formConversionNote:'Без оплаты. Вы сами решаете, показывать ли анкету.', peopleLabel:'ПРОВЕРЕННЫЕ ЛЮДИ', peopleTitle:'Посмотрите, кого можно встретить в DUONERA.',
    peopleText:'Мы показываем только одобренные анкеты людей, которые прямо согласились на предварительный показ. Контактные данные остаются скрытыми.', foundingLabel:'ГРУППА ОСНОВАТЕЛЕЙ УЖЕ ОТКРЫТА',
    foundingTitle:'Первые настоящие анкеты начинаются с вас.', foundingText:'Заполните анкету и добавьте фотографии. После проверки вы решите, показывать ли её другим. Фамилию, телефон и e-mail мы не публикуем.', foundingCta:'Добавить свою анкету'
  }
};

Object.entries(processTranslations).forEach(([language, values]) => Object.assign(translations[language], values));
Object.entries(conversionTranslations).forEach(([language, values]) => Object.assign(translations[language], values));
Object.entries(foundingTranslations).forEach(([language, values]) => Object.assign(translations[language], values));

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
langButtons.forEach(btn => btn.addEventListener('click',()=>{
  const lang = btn.dataset.lang;
  setLanguage(lang);
  const url = new URL(location.href);
  if(lang === 'cs') url.searchParams.delete('lang');
  else url.searchParams.set('lang',lang);
  history.replaceState({},document.title,`${url.pathname}${url.search}${url.hash}`);
}));
const languageAliases = {ua:'uk',uk:'uk',ru:'ru',de:'de',en:'en',cs:'cs',cz:'cs'};
const requestedLanguage = languageAliases[new URLSearchParams(location.search).get('lang')?.toLowerCase()];
setLanguage(requestedLanguage || 'cs');

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
const foundingState = document.querySelector('#foundingState');
const peopleHeading = document.querySelector('.people-heading');
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
    publicProfileGrid.hidden = true;
    if(foundingState) foundingState.hidden = false;
    if(peopleHeading) peopleHeading.hidden = true;
    return;
  }

  publicProfileGrid.hidden = false;
  if(foundingState) foundingState.hidden = true;
  if(peopleHeading) peopleHeading.hidden = false;

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
    link.href = '#register';
    link.textContent = dict.registerFree || fallback.registerFree;
    link.addEventListener('click',()=>{
      try{ localStorage.setItem('duonera-interest-profile',String(profile.id || '')); }catch(error){}
    });
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
      cs:{sending:'Ukládáme registraci…',stillSaving:'Ještě chvíli, bezpečně ukládáme…',opening:'Registrace je uložena. Otevíráme vytvoření účtu…',error:'Registraci se nepodařilo bezpečně uložit. Zkontrolujte připojení a zkuste to znovu.'},
      en:{sending:'Saving registration…',stillSaving:'Please wait, we are saving securely…',opening:'Registration saved. Opening account creation…',error:'The registration could not be saved securely. Check your connection and try again.'},
      uk:{sending:'Зберігаємо реєстрацію…',stillSaving:'Ще мить, безпечно зберігаємо…',opening:'Реєстрацію збережено. Відкриваємо створення акаунта…',error:'Не вдалося безпечно зберегти реєстрацію. Перевірте з’єднання та спробуйте ще раз.'},
      ru:{sending:'Сохраняем регистрацию…',stillSaving:'Ещё немного, безопасно сохраняем…',opening:'Регистрация сохранена. Открываем создание аккаунта…',error:'Не удалось безопасно сохранить регистрацию. Проверьте соединение и попробуйте ещё раз.'},
      de:{sending:'Registrierung wird gespeichert…',stillSaving:'Einen Moment, wir speichern Ihre Daten sicher…',opening:'Registrierung gespeichert. Die Kontoerstellung wird geöffnet…',error:'Die Registrierung konnte nicht sicher gespeichert werden. Prüfen Sie Ihre Verbindung und versuchen Sie es erneut.'}
    };
    const status = statusMessages[language] || statusMessages.cs;

    const landingParams = new URLSearchParams(location.search);
    const attribution = {
      source: landingParams.get('utm_source') || 'direct',
      medium: landingParams.get('utm_medium') || '',
      campaign: landingParams.get('utm_campaign') || '',
      content: landingParams.get('utm_content') || '',
      landing_language: language,
      landing_path: location.pathname,
      referrer: document.referrer || ''
    };
    const localData = Object.fromEntries(formData.entries());
    localData._attribution = attribution;
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
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', {
          method: 'short_registration',
          campaign_source: attribution.source,
          campaign_name: attribution.campaign,
          landing_language: attribution.landing_language,
          transport_type: 'beacon'
        });
      }
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', {content_name:'short_registration'});
      }
      clearTimeout(stillSavingTimer);
      submitButton.textContent = status.opening;

      localStorage.setItem('duonera-short-registration', JSON.stringify(localData));
      localStorage.setItem('duonera-lead-id', leadId);
      const accountUrl = new URL('ucet.html', location.href);
      accountUrl.searchParams.set('mode', 'register');
      accountUrl.searchParams.set('email', payload.email);
      location.assign(accountUrl);
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


/* Installable DUONERA app */
let duoneraInstallPrompt = null;
const duoneraInstallButtons = [...document.querySelectorAll('[data-pwa-install]')];
const duoneraInstallBanner = document.querySelector('[data-app-install-banner]');
const duoneraInstallModal = document.querySelector('[data-app-install-modal]');
const duoneraInstallSteps = document.querySelector('[data-app-install-steps]');
const duoneraInstallLabels = {
  cs: 'Instalovat aplikaci',
  en: 'Install app',
  de: 'App installieren',
  uk: 'Встановити застосунок',
  ru: 'Установить приложение'
};

const duoneraInstallInstructions = {
  cs:{ios:['Otevřete stránku v Safari.','Klepněte dole na ikonu Sdílet.','Vyberte Přidat na plochu a potvrďte Přidat.'],android:['Otevřete nabídku prohlížeče ⋮.','Vyberte Nainstalovat aplikaci nebo Přidat na plochu.','Potvrďte instalaci DUONERA.']},
  en:{ios:['Open this page in Safari.','Tap the Share icon at the bottom.','Choose Add to Home Screen and confirm Add.'],android:['Open the browser menu ⋮.','Choose Install app or Add to Home screen.','Confirm the DUONERA installation.']},
  de:{ios:['Öffnen Sie diese Seite in Safari.','Tippen Sie unten auf das Teilen-Symbol.','Wählen Sie Zum Home-Bildschirm und bestätigen Sie Hinzufügen.'],android:['Öffnen Sie das Browsermenü ⋮.','Wählen Sie App installieren oder Zum Startbildschirm.','Bestätigen Sie die Installation von DUONERA.']},
  uk:{ios:['Відкрийте цю сторінку в Safari.','Натисніть унизу значок Поділитися.','Виберіть На початковий екран і підтвердьте Додати.'],android:['Відкрийте меню браузера ⋮.','Виберіть Встановити застосунок або Додати на головний екран.','Підтвердьте встановлення DUONERA.']},
  ru:{ios:['Откройте эту страницу в Safari.','Нажмите внизу значок Поделиться.','Выберите На экран «Домой» и подтвердите Добавить.'],android:['Откройте меню браузера ⋮.','Выберите Установить приложение или Добавить на главный экран.','Подтвердите установку DUONERA.']}
};

function duoneraAppLanguage(){
  const value = localStorage.getItem('duonera-lang') || document.documentElement.lang || 'cs';
  return value === 'ua' ? 'uk' : value;
}

function duoneraIsStandalone(){
  return window.matchMedia('(display-mode: standalone)').matches || Boolean(window.navigator.standalone);
}

function duoneraInstallDismissed(){
  try { return sessionStorage.getItem('duonera-install-dismissed') === 'true'; } catch (error) { return false; }
}

function duoneraAnalyticsChoiceMade(){
  try { return Boolean(localStorage.getItem('duoneraAnalyticsConsent')); } catch (error) { return true; }
}

function updateDuoneraInstallButtons() {
  const standalone = duoneraIsStandalone();
  const lang = duoneraAppLanguage();
  duoneraInstallButtons.forEach(button => {
    const isMenuButton = button.classList.contains('pwa-install-button');
    button.hidden = Boolean(standalone && !isMenuButton);
    button.textContent = duoneraInstallLabels[lang] || duoneraInstallLabels.cs;
  });
  if (duoneraInstallBanner) {
    duoneraInstallBanner.hidden = Boolean(standalone || duoneraInstallDismissed() || !duoneraAnalyticsChoiceMade());
  }
}

function showInstallHelp() {
  if (!duoneraInstallModal || !duoneraInstallSteps) return;
  const lang = duoneraAppLanguage();
  const platform = /iPad|iPhone|iPod/.test(navigator.userAgent) ? 'ios' : 'android';
  const instructions = (duoneraInstallInstructions[lang] || duoneraInstallInstructions.cs)[platform];
  duoneraInstallSteps.replaceChildren(...instructions.map((text, index) => {
    const item = document.createElement('li');
    const number = document.createElement('span');
    number.textContent = String(index + 1);
    const copy = document.createElement('strong');
    copy.textContent = text;
    item.append(number, copy);
    return item;
  }));
  duoneraInstallModal.hidden = false;
  document.body.classList.add('app-install-open');
  if (typeof window.gtag === 'function') window.gtag('event', 'app_install_help', {platform});
}

function closeInstallHelp(){
  if (!duoneraInstallModal) return;
  duoneraInstallModal.hidden = true;
  document.body.classList.remove('app-install-open');
}

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  duoneraInstallPrompt = event;
  updateDuoneraInstallButtons();
});

window.addEventListener('appinstalled', () => {
  duoneraInstallPrompt = null;
  updateDuoneraInstallButtons();
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'app_install', { method: 'pwa' });
  }
});

duoneraInstallButtons.forEach(button => {
  button.addEventListener('click', async () => {
    if (!duoneraInstallPrompt) {
      showInstallHelp();
      return;
    }
    duoneraInstallPrompt.prompt();
    const choice = await duoneraInstallPrompt.userChoice;
    if (choice.outcome === 'accepted') duoneraInstallPrompt = null;
    updateDuoneraInstallButtons();
  });
});

document.querySelectorAll('[data-app-install-modal-close]').forEach(button => button.addEventListener('click', closeInstallHelp));
document.querySelector('[data-app-install-close]')?.addEventListener('click', () => {
  try { sessionStorage.setItem('duonera-install-dismissed', 'true'); } catch (error) {}
  updateDuoneraInstallButtons();
});

document.querySelectorAll('[data-lang]').forEach(button => {
  button.addEventListener('click', () => setTimeout(() => {
    updateDuoneraInstallButtons();
    if (duoneraInstallModal && !duoneraInstallModal.hidden) showInstallHelp();
  }, 0));
});

document.querySelectorAll('#analyticsAccept, #analyticsDecline').forEach(button => {
  button.addEventListener('click', () => setTimeout(updateDuoneraInstallButtons, 0));
});

updateDuoneraInstallButtons();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(error => {
      console.error('DUONERA app service worker:', error);
    });
  });
}
