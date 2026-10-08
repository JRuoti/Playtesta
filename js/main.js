/* ==========================================================================
   PLAYTESTA — script condiviso
   1. Loader (prima visita) e transizioni tra pagine
   2. Menu mobile
   3. Navbar che si nasconde scrollando giù
   4. Animazioni di entrata del testo (GSAP + ScrollTrigger)
   5. Lazy loading foto con dissolvenza
   6. Lightbox galleria
   ========================================================================== */
/* ✏️ VIDEO DELLA HERO (home + Beyblade X)
   Scrivi solo il NOME DEL FILE caricato nel bucket R2 (es. 'playtesta-hero.mp4').
   Lascia '' per mostrare solo la foto di sfondo. */
const R2_PUBLIC_URL = 'https://pub-f2a9b1001e4c460ba9d83e1135eccffd.r2.dev/';
const HERO_VIDEO_FILE = 'playtestahero.mp4';
const HERO_VIDEO_URL = HERO_VIDEO_FILE ? R2_PUBLIC_URL + encodeURI(HERO_VIDEO_FILE) : '';

(function () {
  'use strict';

  const root = document.documentElement;
  const hasGSAP = typeof window.gsap !== 'undefined';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animate = hasGSAP && !reduceMotion;

  if (hasGSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };
  const wait = ms => new Promise(r => setTimeout(r, ms));

  /* ========================================================================
     1. LOADER + TRANSIZIONI
     ======================================================================== */
  const loader = document.getElementById('loader');
  const pageParts = () => [document.getElementById('main'), document.getElementById('footer')].filter(Boolean);

  // Promise che si risolve quando la pagina è visibile e il testo può entrare
  function runIntro() {
    // --- Prima visita: loader breve con barra a pixel ---
    if (root.classList.contains('show-loader') && loader) {
      store.set('pt-seen', '1');
      if (!animate) { root.classList.remove('show-loader'); return Promise.resolve(); }

      loader.style.animation = 'none';
      const bars = loader.querySelectorAll('.loader-bar span');
      const count = document.getElementById('loader-count');
      const progress = { v: 0 };
      const paint = () => {
        const v = Math.round(progress.v);
        count.textContent = String(v).padStart(3, '0');
        bars.forEach((b, i) => b.classList.toggle('on', i < Math.floor(v / 10)));
      };
      const pageLoaded = new Promise(r => (document.readyState === 'complete' ? r() : window.addEventListener('load', r, { once: true })));

      const fill = gsap.to(progress, { v: 90, duration: .7, ease: 'power1.out', onUpdate: paint });
      return Promise.all([fill.then(), Promise.race([pageLoaded, wait(2500)])])
        .then(() => gsap.to(progress, { v: 100, duration: .15, ease: 'none', onUpdate: paint }).then())
        .then(() => new Promise(resolve => {
          gsap.to(loader, {
            opacity: 0, duration: .4, ease: 'power2.out',
            onComplete() { root.classList.remove('show-loader'); gsap.set(loader, { clearProps: 'all' }); }
          });
          setTimeout(resolve, 150);
        }));
    }

    store.set('pt-seen', '1');

    // --- Arrivo da un'altra pagina: il contenuto entra da destra in dissolvenza ---
    if (root.classList.contains('pt-enter')) {
      const parts = pageParts();
      parts.forEach(el => (el.style.animation = 'none'));
      root.classList.remove('pt-enter');
      if (animate) gsap.fromTo(parts, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: .4, ease: 'power2.out', clearProps: 'transform' });
    }
    return Promise.resolve();
  }

  // Uscita: il contenuto esce verso sinistra in dissolvenza, poi cambia pagina
  function leaveTo(href) {
    store.set('pt-nav', '1');
    if (!animate) { location.href = href; return; }
    gsap.to(pageParts(), {
      opacity: 0, x: -24, duration: .22, ease: 'power2.in',
      onComplete: () => { location.href = href; }
    });
  }

  function isInternalPageLink(a, e) {
    if (!a || e.defaultPrevented || e.button !== 0) return false;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
    if (a.target && a.target !== '_self') return false;
    if (a.hasAttribute('download')) return false;
    const href = a.getAttribute('href') || '';
    if (!href || href.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(href)) return false;
    const url = new URL(a.href, location.href);
    if (url.protocol !== location.protocol || url.host !== location.host) return false;
    if (!/(\.html?$|\/$)/i.test(url.pathname)) return false;      // solo pagine, non PDF/immagini
    if (url.pathname === location.pathname) return false;          // stessa pagina
    return url;
  }

  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    const url = isInternalPageLink(a, e);
    if (!url) return;
    e.preventDefault();
    leaveTo(url.href);
  });

  // Precarica la pagina appena il mouse passa sul link (o il dito lo tocca): cambio quasi istantaneo
  const prefetched = new Set();
  const prefetch = e => {
    const a = e.target.closest && e.target.closest('a');
    if (!a || location.protocol === 'file:') return;
    const url = isInternalPageLink(a, { button: 0 });
    if (!url || prefetched.has(url.href)) return;
    prefetched.add(url.href);
    const l = document.createElement('link');
    l.rel = 'prefetch'; l.href = url.href;
    document.head.appendChild(l);
  };
  document.addEventListener('mouseover', prefetch, { passive: true });
  document.addEventListener('touchstart', prefetch, { passive: true });

  // Tornando indietro col browser (bfcache) il contenuto non deve restare nascosto
  window.addEventListener('pageshow', e => {
    if (!e.persisted) return;
    if (hasGSAP) gsap.set(pageParts(), { clearProps: 'all' });
  });

  /* ========================================================================
     1b. LINGUA IT / EN (i testi sono in js/i18n.js)
     ======================================================================== */
  document.querySelectorAll('[data-lang]').forEach(btn => btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    if (lang === window.PLAYTESTA_LANG) return;
    try { localStorage.setItem('pt-lang', lang); } catch (e) {}
    const url = new URL(location.href);
    url.searchParams.delete('lang');
    leaveTo(url.href);
  }));

  /* ========================================================================
     2. MENU MOBILE
     ======================================================================== */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeBtn = document.getElementById('mobile-menu-close');
  const menuLinks = mobileMenu ? mobileMenu.querySelectorAll('.overflow-hidden > [data-menu-link]') : [];
  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    mobileMenu.classList.remove('translate-x-full');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (animate) {
      gsap.fromTo(menuLinks,
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: .6, ease: 'power3.out', stagger: .08, delay: .2 });
    }
    setTimeout(() => closeBtn && closeBtn.focus(), 50);
  }

  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false;
    mobileMenu.classList.add('translate-x-full');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.focus({ preventScroll: true });
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    mobileMenu.querySelectorAll('[data-menu-link]').forEach(link => link.addEventListener('click', () => {
      // se il link porta alla pagina attuale chiudi soltanto il menu
      if (link.getAttribute('aria-current') === 'page') closeMenu();
    }));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    window.matchMedia('(min-width: 1280px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
  }

  /* ========================================================================
     3. NAVBAR: nascondi scrollando giù, mostra scrollando su
     ======================================================================== */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0, ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const current = window.scrollY;
      if (navbar && !menuOpen) {
        navbar.style.transform = (current > lastScroll && current > 80) ? 'translateY(-100%)' : 'translateY(0)';
      }
      lastScroll = Math.max(current, 0);
      ticking = false;
    });
  }, { passive: true });

  /* ========================================================================
     4. ANIMAZIONI DI TESTO
     data-split="load"  -> titolo animato appena la pagina è visibile
     data-split         -> titolo animato quando entra nello schermo
     data-reveal        -> blocco che sale in dissolvenza (data-delay="0.3")
     ======================================================================== */
  function splitText(el) {
    if (el.dataset.splitDone) return el.querySelectorAll('.split-char');
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    (function walk(node) {
      Array.from(node.childNodes).forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const word = document.createElement('span');
            word.className = 'split-word';
            word.setAttribute('aria-hidden', 'true');
            Array.from(part).forEach(ch => {
              const c = document.createElement('span');
              c.className = 'split-char';
              c.textContent = ch;
              word.appendChild(c);
            });
            frag.appendChild(word);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
          walk(child);
        }
      });
    })(el);
    el.dataset.splitDone = '1';
    return el.querySelectorAll('.split-char');
  }

  function showEverything() {
    root.classList.remove('js-anim');
    document.querySelectorAll('[data-split],[data-reveal]').forEach(el => (el.style.visibility = 'visible'));
  }

  function initAnimations() {
    if (!animate) { showEverything(); return; }
    const hasST = !!window.ScrollTrigger;

    document.querySelectorAll('[data-split]').forEach(el => {
      const chars = splitText(el);
      el.style.animation = 'none';
      gsap.set(el, { visibility: 'visible' });
      const tween = {
        yPercent: 110, rotate: 6, opacity: 0,
        duration: .7, ease: 'power4.out', stagger: .025,
        delay: parseFloat(el.dataset.delay || 0)
      };
      if (el.dataset.split === 'load' || !hasST) gsap.from(chars, tween);
      else gsap.from(chars, { ...tween, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });

    const reveals = gsap.utils.toArray('[data-reveal]');
    reveals.forEach(el => (el.style.animation = 'none'));
    gsap.set(reveals, { visibility: 'visible', opacity: 0, y: 28 });
    const show = batch => gsap.to(batch, {
      opacity: 1, y: 0, duration: .8, ease: 'power3.out', stagger: .1,
      delay: i => parseFloat(batch[i].dataset.delay || 0), overwrite: true
    });
    if (hasST) ScrollTrigger.batch(reveals, { start: 'top 92%', once: true, onEnter: show });
    else show(reveals);
  }

  /* ========================================================================
     5. LAZY LOADING FOTO (loading="lazy" nativo + dissolvenza all'arrivo)
     ======================================================================== */
  function initLazyImages() {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      const done = () => { img.classList.add('is-loaded'); img.parentElement.classList.add('is-loaded'); };
      if (img.complete && img.naturalWidth) done();
      else { img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true }); }
    });
  }

  /* ========================================================================
     6. LIGHTBOX GALLERIA
     ======================================================================== */
  function initLightbox() {
    const box = document.getElementById('lightbox');
    if (!box) return;
    const img = box.querySelector('#lightbox-img');
    const counter = box.querySelector('#lightbox-counter');
    const items = Array.from(document.querySelectorAll('[data-gallery-item]'));
    let index = 0, lastFocus = null;

    function render() {
      const source = items[index].querySelector('img');
      img.src = source.currentSrc || source.src;
      img.alt = source.alt;
      counter.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(items.length).padStart(2, '0');
      if (animate) gsap.fromTo(img, { opacity: 0, scale: .97 }, { opacity: 1, scale: 1, duration: .35, ease: 'power2.out' });
    }
    function open(i) {
      index = i; lastFocus = document.activeElement;
      box.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      render();
      if (animate) gsap.fromTo(box, { opacity: 0 }, { opacity: 1, duration: .25 });
      box.querySelector('[data-lb-close]').focus();
    }
    function close() {
      box.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }
    const go = step => { index = (index + step + items.length) % items.length; render(); };

    items.forEach((item, i) => {
      item.addEventListener('click', () => open(i));
      item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } });
    });
    box.querySelector('[data-lb-close]').addEventListener('click', close);
    box.querySelector('[data-lb-prev]').addEventListener('click', e => { e.stopPropagation(); go(-1); });
    box.querySelector('[data-lb-next]').addEventListener('click', e => { e.stopPropagation(); go(1); });
    box.addEventListener('click', e => { if (e.target === box) close(); });
    document.addEventListener('keydown', e => {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    });
    let startX = 0;
    box.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    });
  }

  /* ========================================================================
     7. VIDEO DI SFONDO DELLA HERO
     - si scarica solo dopo il caricamento della pagina (non rallenta l'entrata)
     - non parte se l'utente preferisce meno movimento o ha il risparmio dati attivo
     - si mette in pausa quando esce dallo schermo
     ======================================================================== */
  function initHeroVideo() {
    const video = document.querySelector('.hero-video');
    if (!video || !HERO_VIDEO_URL) return;
    const conn = navigator.connection || {};
    if (reduceMotion || conn.saveData) return;   // resta la foto

    const toggle = document.querySelector('[data-video-toggle]');
    const en = window.PLAYTESTA_LANG === 'en';
    const labels = en ? ['Pause video', 'Play video'] : ['Metti in pausa il video', 'Riproduci il video'];
    let userPaused = false;

    const setToggle = paused => {
      if (!toggle) return;
      toggle.setAttribute('aria-pressed', paused ? 'true' : 'false');
      toggle.setAttribute('aria-label', paused ? labels[1] : labels[0]);
    };

    const start = () => {
      video.src = HERO_VIDEO_URL;
      video.muted = true;
      video.addEventListener('playing', () => {
        video.classList.add('is-playing');
        if (toggle) toggle.hidden = false;
      }, { once: true });
      video.addEventListener('error', () => video.remove(), { once: true });  // link rotto -> foto
      const p = video.play();
      if (p && p.catch) p.catch(() => {});   // autoplay bloccato -> resta la foto
    };

    if (toggle) toggle.addEventListener('click', () => {
      if (video.paused) { userPaused = false; video.play(); setToggle(false); }
      else { userPaused = true; video.pause(); setToggle(true); }
    });

    // pausa automatica fuori dallo schermo (risparmia batteria)
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        if (!video.src) return;
        if (entry.isIntersecting && !userPaused) video.play().catch(() => {});
        else video.pause();
      }).observe(video);
    }

    if (document.readyState === 'complete') setTimeout(start, 200);
    else window.addEventListener('load', () => setTimeout(start, 200), { once: true });
  }

  /* ========================================================================
     8. FILTRO PARTECIPANTI (Tutti / Giochi da tavolo / Videogiochi)
     ======================================================================== */
  function initParticipantFilter() {
    const list = document.getElementById('participants');
    if (!list) return;
    const items = Array.from(list.children);
    const buttons = document.querySelectorAll('[data-filter]');
    const empty = document.getElementById('participants-empty');

    // contatori nei bottoni
    document.querySelectorAll('[data-count]').forEach(el => {
      const t = el.dataset.count;
      el.textContent = t === 'all' ? items.length : items.filter(li => li.dataset.type === t).length;
    });

    // numerazione automatica 01, 02… sulle righe visibili
    const renumber = () => {
      let n = 0;
      items.forEach(li => { if (!li.hidden) li.querySelector('.participant-num').textContent = String(++n).padStart(2, '0'); });
      if (empty) empty.classList.toggle('hidden', n > 0);
      list.classList.toggle('border-b', n > 0);
    };

    function apply(type) {
      buttons.forEach(b => b.setAttribute('aria-pressed', b.dataset.filter === type ? 'true' : 'false'));
      const show = li => type === 'all' || li.dataset.type === type;
      const visible = () => items.filter(li => !li.hidden);

      const swap = () => {
        items.forEach(li => (li.hidden = !show(li)));
        renumber();
        if (animate) {
          const rows = visible().map(li => li.firstElementChild);
          gsap.fromTo(rows, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .35, ease: 'power2.out', stagger: .05, overwrite: true });
        }
      };
      if (animate && visible().length) {
        gsap.to(visible().map(li => li.firstElementChild), { opacity: 0, y: -8, duration: .15, ease: 'power1.in', overwrite: true, onComplete: swap });
      } else swap();
    }

    buttons.forEach(b => b.addEventListener('click', () => apply(b.dataset.filter)));
    renumber();
  }

  /* ========================================================================
     AVVIO
     ======================================================================== */
  document.querySelectorAll('[data-year]').forEach(el => (el.textContent = new Date().getFullYear()));
  initLazyImages();
  initLightbox();
  initHeroVideo();
  initParticipantFilter();

  const fontsReady = document.fonts && document.fonts.ready
    ? Promise.race([document.fonts.ready, wait(1500)])
    : Promise.resolve();

  Promise.all([runIntro(), fontsReady]).then(initAnimations);
})();
