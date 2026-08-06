(()=>{
  const copy={
    cs:{title:'DUONERA v telefonu',sub:'Rychlý vstup do vašeho účtu',button:'Nainstalovat',guideTitle:'Přidat DUONERA na telefon',ios:'V Safari klepněte na Sdílet a potom na Přidat na plochu.',android:'V nabídce prohlížeče ⋮ zvolte Nainstalovat aplikaci nebo Přidat na plochu.',close:'Rozumím'},
    de:{title:'DUONERA auf dem Handy',sub:'Schneller Zugang zu Ihrem Konto',button:'Installieren',guideTitle:'DUONERA installieren',ios:'Tippen Sie in Safari auf Teilen und dann auf Zum Home-Bildschirm.',android:'Wählen Sie im Browsermenü ⋮ App installieren oder Zum Startbildschirm.',close:'Verstanden'},
    it:{title:'DUONERA sul telefono',sub:'Accesso rapido al tuo account',button:'Installa',guideTitle:'Installa DUONERA',ios:'In Safari tocca Condividi e poi Aggiungi alla schermata Home.',android:'Nel menu del browser ⋮ scegli Installa app o Aggiungi alla schermata Home.',close:'Ho capito'},
    pl:{title:'DUONERA w telefonie',sub:'Szybki dostęp do Twojego konta',button:'Zainstaluj',guideTitle:'Zainstaluj DUONERA',ios:'W Safari wybierz Udostępnij, a następnie Dodaj do ekranu początkowego.',android:'W menu przeglądarki ⋮ wybierz Zainstaluj aplikację lub Dodaj do ekranu głównego.',close:'Rozumiem'},
    sk:{title:'DUONERA v telefóne',sub:'Rýchly vstup do vášho účtu',button:'Nainštalovať',guideTitle:'Nainštalovať DUONERA',ios:'V Safari ťuknite na Zdieľať a potom Pridať na plochu.',android:'V ponuke prehliadača ⋮ vyberte Nainštalovať aplikáciu alebo Pridať na plochu.',close:'Rozumiem'},
    uk:{title:'DUONERA у телефоні',sub:'Швидкий вхід до вашого кабінету',button:'Встановити',guideTitle:'Встановити DUONERA',ios:'У Safari натисніть «Поділитися», потім «На початковий екран».',android:'У меню браузера ⋮ виберіть «Встановити застосунок» або «Додати на головний екран».',close:'Зрозуміло'},
    ru:{title:'DUONERA в телефоне',sub:'Быстрый вход в личный кабинет',button:'Установить',guideTitle:'Установить DUONERA',ios:'В Safari нажмите «Поделиться», затем «На экран Домой».',android:'В меню браузера ⋮ выберите «Установить приложение» или «Добавить на главный экран».',close:'Понятно'},
    en:{title:'DUONERA on your phone',sub:'Quick access to your account',button:'Install',guideTitle:'Install DUONERA',ios:'In Safari tap Share, then Add to Home Screen.',android:'In the browser menu ⋮ choose Install app or Add to Home screen.',close:'Got it'}
  };
  const aliases={cz:'cs',ua:'uk'};
  const lang=(()=>{try{const raw=new URLSearchParams(location.search).get('lang')||localStorage.getItem('duonera-lang')||'cs';return aliases[raw]||raw}catch(_){return'cs'}})();
  const text=copy[lang]||copy.cs;
  const standalone=matchMedia('(display-mode:standalone)').matches||navigator.standalone===true;
  if(standalone)return;
  const bar=document.createElement('aside');
  bar.className='pwa-install';
  bar.innerHTML=`<img src="assets/duonera-mark-v2.svg" alt=""><div class="pwa-install-copy"><strong>${text.title}</strong><span>${text.sub}</span></div><button class="pwa-install-button" type="button">${text.button}</button>`;
  const guide=document.createElement('section');
  guide.className='pwa-guide';guide.hidden=true;
  const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
  guide.innerHTML=`<div class="pwa-guide-card"><h2>${text.guideTitle}</h2><p>${ios?text.ios:text.android}</p><button type="button">${text.close}</button></div>`;
  document.body.append(bar,guide);
  const consent=document.querySelector('.tracking-consent');
  const placeBar=()=>{
    if(consent&&!consent.hidden){bar.style.bottom=`${Math.ceil(consent.getBoundingClientRect().height)+20}px`;}
    else{bar.style.removeProperty('bottom');}
  };
  if(consent)new MutationObserver(placeBar).observe(consent,{attributes:true,attributeFilter:['hidden']});
  addEventListener('resize',placeBar);requestAnimationFrame(placeBar);setTimeout(placeBar,300);
  let promptEvent=null;
  addEventListener('beforeinstallprompt',event=>{event.preventDefault();promptEvent=event});
  bar.querySelector('button').addEventListener('click',async()=>{
    if(promptEvent){promptEvent.prompt();await promptEvent.userChoice;promptEvent=null;return}
    guide.hidden=false;
  });
  guide.querySelector('button').addEventListener('click',()=>guide.hidden=true);
  guide.addEventListener('click',event=>{if(event.target===guide)guide.hidden=true});
  addEventListener('appinstalled',()=>{bar.hidden=true;guide.hidden=true});
})();
