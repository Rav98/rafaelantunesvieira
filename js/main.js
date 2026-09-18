/* =========================================================
   main.js: tema, idioma, menu mobile, scroll-spy e reveal
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Tema ---------- */
  var themeBtn = document.getElementById('theme-toggle');
  function currentTheme() {
    return root.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  }
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    store.set('theme', t);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'light' ? '#f6f8fb' : '#0b1220');
  }
  if (!root.getAttribute('data-theme')) applyTheme(currentTheme());
  themeBtn && themeBtn.addEventListener('click', function () {
    applyTheme(currentTheme() === 'light' ? 'dark' : 'light');
  });

  /* ---------- Idioma ---------- */
  var dict = window.I18N || {};
  var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
  // Guarda o PT original de cada nó para poder voltar sem recarregar.
  nodes.forEach(function (el) { el.setAttribute('data-i18n-pt', el.innerHTML); });

  var langBtn = document.getElementById('lang-toggle');
  var langCode = document.getElementById('lang-code');
  var titleEl = document.querySelector('title');
  var descEl = document.querySelector('meta[name="description"]');
  var ptTitle = titleEl ? titleEl.textContent : '';
  var ptDesc = descEl ? descEl.getAttribute('content') : '';

  function applyLang(lang) {
    var t = dict[lang] || {};
    nodes.forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      el.innerHTML = lang === 'pt' ? el.getAttribute('data-i18n-pt') : (t[key] || el.getAttribute('data-i18n-pt'));
    });
    root.setAttribute('lang', lang === 'pt' ? 'pt-BR' : 'en');
    if (titleEl) titleEl.textContent = lang === 'pt' ? ptTitle : (t['meta.title'] || ptTitle);
    if (descEl) descEl.setAttribute('content', lang === 'pt' ? ptDesc : (t['meta.desc'] || ptDesc));
    if (langCode) langCode.textContent = lang === 'pt' ? 'EN' : 'PT';
    store.set('lang', lang);
  }

  function initialLang() {
    var q = new URLSearchParams(window.location.search).get('lang');
    if (q === 'en' || q === 'pt') return q;
    var saved = store.get('lang');
    if (saved === 'en' || saved === 'pt') return saved;
    return /^pt/i.test(navigator.language || '') ? 'pt' : 'en';
  }
  var lang = initialLang();
  if (lang !== 'pt') applyLang(lang);
  langBtn && langBtn.addEventListener('click', function () {
    lang = lang === 'pt' ? 'en' : 'pt';
    applyLang(lang);
  });

  /* ---------- Menu mobile ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('nav-burger');
  burger && burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  nav && nav.querySelectorAll('.nav__links a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('is-open');
      burger && burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Scroll-spy ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__links a[href^="#"]'));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealTargets = document.querySelectorAll('.section__head, .about__text, .card, .tl-item, .project, .skill-group, .contact__card, .stat');
  if ('IntersectionObserver' in window && !window.matchMedia('print').matches) {
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) { io.observe(el); });
    // Antes de imprimir, garante que tudo esteja visível.
    window.addEventListener('beforeprint', function () {
      revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
    });
  }

  /* ---------- Ano no rodapé ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
