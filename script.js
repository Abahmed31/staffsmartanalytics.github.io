// script.js
// Site-wide behavior: mobile nav, theme toggle, form protections, small UX helpers.

(function () {
  'use strict';

  /* ---------- Helpers ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Year fillers ---------- */
  function fillYears() {
    const els = $$('[id^="yr"], [id="year"], [id^="year"]');
    const year = new Date().getFullYear();
    els.forEach(el => { try { el.textContent = year; } catch(e){} });
  }

  /* ---------- Mobile nav toggle ---------- */
  function initMobileNav() {
    const btn = document.getElementById('navToggle');
    const panel = document.getElementById('mobileNav');
    if (!btn || !panel) return;

    function setOpen(open) {
      panel.classList.toggle('open', open);
      const expanded = !!open;
      btn.setAttribute('aria-expanded', String(expanded));
      panel.setAttribute('aria-hidden', String(!expanded));
      document.body.style.overflow = expanded ? 'hidden' : '';
    }

    btn.addEventListener('click', () => {
      setOpen(!panel.classList.contains('open'));
    });

    // close mobile nav on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('open')) setOpen(false);
    });

    // close when clicking a link
    panel.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') setOpen(false);
    });
  }

  /* ---------- Theme (dark/light) with persistence ---------- */
  const THEME_KEY = 'ssa_theme_preference'; // Staff Smart Analytics

  function applyTheme(name) {
    try {
      if (name === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    } catch (e) { /* noop */ }
  }

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  }

  function initThemeToggle() {
    // If there is a toggle element with id 'themeToggle', wire it.
    const toggle = document.getElementById('themeToggle');
    const preferred = getPreferredTheme();
    applyTheme(preferred);

    if (!toggle) return;
    // Set initial aria-pressed state
    toggle.setAttribute('aria-pressed', preferred === 'dark' ? 'true' : 'false');

    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
      toggle.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
    });
  }

  /* ---------- Smooth in-page scrolling for anchor links ---------- */
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (href === '#' || href === '#0') return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // update focus for accessibility
        try { target.tabIndex = -1; target.focus(); } catch (err) {}
      }
    });
  }

  /* ---------- Simple PII detector (SSN-like patterns) ----------
     This is intentionally conservative: it's only a user-warning to prevent accidental submission of SSN-like strings.
     It does not catch all PII and should not be relied on for compliance.
  */
  function containsSSNLike(text) {
    if (!text) return false;
    // common SSN formats: 123-45-6789 or 123456789
    const ssnDash = /\b\d{3}-\d{2}-\d{4}\b/;
    const ssnPlain = /\b\d{9}\b/;
    return ssnDash.test(text) || ssnPlain.test(text);
  }

  /* ---------- Form protections: honeypot + PII check ---------- */
  function initFormProtections() {
    const forms = $$('form');

    forms.forEach((form) => {
      // intercept submit
      form.addEventListener('submit', (e) => {
        // basic honeypot check: hidden field named "website" (or similar)
        const honeypot = form.querySelector('input[name="website"], input[name="hp"], input[name="hidden_field"]');
        if (honeypot && honeypot.value && honeypot.value.trim() !== '') {
          // likely bot — cancel submission silently
          e.preventDefault();
          console.warn('Honeypot triggered on form, submission blocked.');
          return false;
        }

        // ensure user confirmed no PII if checkbox exists
        const piCheckbox = form.querySelector('input[name="no_pii_confirm"]');
        if (piCheckbox && !piCheckbox.checked) {
          e.preventDefault();
          alert('Please confirm you will not submit personally identifiable information (PII) before sending.');
          return false;
        }

        // quick PII-like pattern check in message fields (warn & block)
        const messageField = form.querySelector('textarea[name="message"], input[name="message"], input[name="comments"], textarea');
        if (messageField && containsSSNLike(messageField.value)) {
          e.preventDefault();
          alert('It looks like your message contains a number that resembles an SSN or similar personal identifier. For your safety and ours, please remove any personal identifiers before submitting.');
          return false;
        }

        // Allow submission to proceed (Formspree will handle delivery)
        return true;
      }, { passive: false });
    });
  }

  /* ---------- Small UI polish: focus outlines for keyboard users ---------- */
  function initFocusRings() {
    let mouseUsed = false;
    window.addEventListener('mousedown', ()=> mouseUsed = true);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') mouseUsed = false;
    });
    document.addEventListener('focusin', (e) => {
      if (!mouseUsed && e.target) e.target.classList.add('focus-ring');
    });
    document.addEventListener('focusout', (e) => {
      if (e.target) e.target.classList.remove('focus-ring');
    });
  }

  /* ---------- init all ---------- */
  function init() {
    fillYears();
    initMobileNav();
    initThemeToggle();
    initSmoothScroll();
    initFormProtections();
    initFocusRings();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // expose utilities for debugging in console (optional)
  window.ssa = {
    applyTheme,
    getPreferredTheme,
    containsSSNLike
  };

})();
