/* ==========================================================================
   PLAYTESTA — traduzioni
   L'italiano è già scritto nelle pagine HTML.
   Qui c'è solo l'INGLESE: ogni chiave corrisponde a un data-i18n="..." nell'HTML.
   ✏️ Se cambi un testo italiano nell'HTML, aggiorna qui la sua versione inglese.
   (puoi usare <br> per andare a capo)
   ========================================================================== */
window.PLAYTESTA_EN = {
  /* Titoli della scheda del browser */
  'title.index':    'Playtesta',
  'title.evento':   'The event | Playtesta',
  'title.galleria': 'Gallery | Playtesta',
  'title.contatti': 'Contact | Playtesta',
  'title.beyblade': 'Beyblade X | Playtesta',
  'title.partecipanti': 'Participants | Playtesta',

  /* Menu + footer */
  'skip':         'Skip to content',
  'nav.evento':   'The event',
  'nav.beyblade': 'Beyblade X',
  'nav.partecipanti': 'Participants',
  'nav.galleria': 'Gallery',
  'nav.contatti': 'Contact',
  'footer.icons': 'Icons by Streamline',

  /* Hero della home: prossimo evento */
  'idx.title':  'October 22, 2026<br>NAMA',   // ✏️ aggiorna a ogni evento
  'idx.cta':    'DISCOVER THE EVENT',

  /* Home (sezione "Cos'è") + hero pagina Beyblade X */
  'home.eyebrow':    'Next event',
  'home.title':      'Beyblade X Tournament<br>July 9',   // ✏️ aggiorna a ogni evento
  'home.cta1':       'SIGN UP!',
  'home.cta2':       'RULES',
  'home.aboutTitle': "Play, Test, Improve.",
  'home.aboutText': "Playtesta is the gaming showcase for people who make games and video games. And for people who love playing them.<br><br>Board games, video games and indie projects, one Thursday a month at NAMA. Entry is free with a NAMA membership card.",
  'home.aboutCta': "Book your spot",

  /* L'evento */
  'ev.eyebrow': '// The event',
  'ev.title':   'The event',
  'ev.sub': "Play, Test, Improve. Everything you need to know about Playtesta.",
  'ev.h2':  'Event highlights',
  'ev.p1t': "What is Playtesta",
  'ev.p1': "Playtesta is a gaming showcase dedicated to board games, video games and indie projects. Creators bring their game to the table, players try it out.",
  'ev.p2t': "Who it's for",
  'ev.p2': "For people who make games and video games. For people who love playing them. First time? No worries: we're ready to explain the rules again.",
  'ev.p3t': "Not just playtests",
  'ev.p3': "You'll also find <a href=\"beyblade.html\" class=\"text-link\">Beyblade X</a> tournaments, Mario Kart tournaments, plus activities and events for the community.",
  'ev.p4t': "When & where",
  'ev.p4': "One Thursday a month at <a href=\"https://www.nuovoanfiteatromartesana.org/\" target=\"_blank\" rel=\"noopener\" class=\"text-link\">NAMA – Nuovo Anfiteatro Martesana</a>.",
  'ev.p5t': "How much",
  'ev.p5': "Nothing: the event is free. You need a NAMA membership card to take part, all the details are on the <a href=\"https://www.nuovoanfiteatromartesana.org/\" target=\"_blank\" rel=\"noopener\" class=\"text-link\">NAMA website</a>.",
  'ev.p6t': "Thanks NAMA & Ribes Jam",
  'ev.p6': "Playtesta is hosted by NAMA, with special thanks to <a href=\"https://www.instagram.com/ribesjam/\" target=\"_blank\" rel=\"noopener\" class=\"text-link\">Ribes Jam</a>. In one room you try the participants' games, in the other you enjoy live music.",
  'ev.closeTitle': "Book your spot",
  'ev.closeText': "Send us a DM on Instagram or drop us an email.<br><br>Sold out? Come by anyway and bring your game: as soon as a seat frees up you can join another table.",
  'ev.cta1': "Message us on Instagram",
  'ev.cta2': "Send us an email",

  /* Partecipanti (i nomi dei progetti non si traducono) */
  'pt.eyebrow': '// Participants',
  'pt.title':   'Participants',
  'pt.sub':     'The projects that brought their games to past editions of Playtesta.',
  'pt.h2':  'Project list',
  'pt.all':       'All',
  'pt.tavolo':    'Board games',
  'pt.video':     'Video games',
  'pt.typeTavolo':'Board game',
  'pt.typeVideo': 'Video game',
  'pt.empty':     'No projects in this category yet.',

  /* Galleria */
  'gl.eyebrow': '// Gallery',
  'gl.title':   'Gallery',
  'gl.sub':     'Moments, prototypes and laughs.',
  'gl.h2':  'Event photos',
  'gl.alt1':    'Playtesta – a board game session',
  'gl.alt2':    'Playtesta – video game playtest',
  'gl.alt3':    'Playtesta – chessboard and teddy bear spectator',
  'gl.alt4':    'Playtesta – game station with projector',
  'gl.alt5':    'Playtesta – a player focused on a card game',
  'gl.alt6':    'Playtesta – a card game at the table',
  'gl.alt7':    'Playtesta – Beyblade X tops spinning in the arena',
  'gl.alt8':    'Playtesta – explaining the rules of a card game',
  'gl.alt9':    'Playtesta – bass guitar headstock during the live set',
  'gl.alt10':   'Playtesta – live music with a rapper and DJ',

  /* Contatti */
  'ct.eyebrow': '// Contact',
  'ct.title':   'Let\'s talk',
  'ct.sub':     'Got a game to playtest, want to take part or collaborate? Pick the channel you prefer.',
  'ct.h2':  'Contact channels',
  'ct.ig':      'Instagram',
  'ct.tel':     'Phone',
  'ct.mail':    'Email'
};

/* --------------------------------------------------------------------------
   Logica lingua (non serve toccarla)
   Ordine: ?lang=en nell'URL > scelta salvata > lingua del browser
   -------------------------------------------------------------------------- */
(function () {
  var param = new URLSearchParams(location.search).get('lang');
  var saved = null;
  try { saved = localStorage.getItem('pt-lang'); } catch (e) {}
  var browser = (navigator.language || 'it').toLowerCase().indexOf('it') === 0 ? 'it' : 'en';
  var lang = (param === 'it' || param === 'en') ? param : (saved || browser);
  if (param) { try { localStorage.setItem('pt-lang', lang); } catch (e) {} }

  window.PLAYTESTA_LANG = lang;
  document.documentElement.lang = lang;

  if (lang === 'en') {
    var dict = window.PLAYTESTA_EN;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var t = dict[el.getAttribute('data-i18n')];
      if (t != null) el.innerHTML = t;
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var t = dict[el.getAttribute('data-i18n-alt')];
      if (t != null) el.alt = t;
    });
    var title = dict['title.' + document.body.dataset.page];
    if (title) document.title = title;
  }

  // evidenzia la lingua attiva nei selettori IT / EN
  document.querySelectorAll('[data-lang]').forEach(function (btn) {
    btn.setAttribute('aria-pressed', btn.dataset.lang === lang ? 'true' : 'false');
  });
})();
