// script.js — mobile nav toggle + dark mode toggle (saves to localStorage)
(function(){
  'use strict';

  // DOM helpers
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  // Mobile nav toggle
  function initMobileNav(){
    const btn = $('#navToggle');
    const mobile = $('#mobileNav');
    if(!btn || !mobile) return;
    btn.addEventListener('click', ()=>{
      const open = mobile.style.display === 'block';
      mobile.style.display = open ? 'none' : 'block';
      btn.setAttribute('aria-expanded', String(!open));
      document.body.style.overflow = open ? '' : 'hidden';
    });
    // close when clicking a link
    mobile.addEventListener('click', (e)=>{
      if(e.target.tagName === 'A'){
        mobile.style.display = 'none';
        const btn = document.getElementById('navToggle');
        if(btn) btn.setAttribute('aria-expanded','false');
        document.body.style.overflow = '';
      }
    });
    window.addEventListener('resize', ()=>{
      if(window.innerWidth > 980){
        mobile.style.display = 'none';
        const btn = document.getElementById('navToggle');
        if(btn) btn.setAttribute('aria-expanded','false');
        document.body.style.overflow = '';
      }
    });
  }

  // Dark mode: toggle and persistence
  function initThemeToggle(){
    const toggle = $('#themeToggle');
    if(!toggle) return;
    // apply saved preference
    const saved = localStorage.getItem('ssa_dark_mode');
    if(saved === '1') document.body.classList.add('dark-mode');

    function updateIcon(){
      const isDark = document.body.classList.contains('dark-mode');
      toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      const icon = toggle.querySelector('.icon');
      if(icon){
        icon.innerHTML = isDark ? sunSVG() : moonSVG();
      }
    }

    toggle.addEventListener('click', ()=>{
      const isDark = document.body.classList.toggle('dark-mode');
      localStorage.setItem('ssa_dark_mode', isDark ? '1' : '0');
      updateIcon();
    });

    updateIcon();
  }

  // small SVGs
  function moonSVG(){ return '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/></svg>'; }
  function sunSVG(){ return '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.76 4.84l-1.8-1.79L3.17 4.84 4.97 6.63 6.76 4.84zM1 13h3v-2H1v2zm10 9h2v-3h-2v3zM17.24 4.84l1.8-1.79 1.8 1.79-1.8 1.79-1.8-1.79zM21 11h3v2h-3v-2zM4.97 17.37L3.17 19.17l1.79 1.79 1.8-1.79-1.79-1.79zM20.83 19.17l-1.79-1.79-1.8 1.79 1.8 1.79 1.79-1.79zM12 6a6 6 0 100 12A6 6 0 0012 6z" fill="currentColor"/></svg>'; }

  // init on DOM ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ()=>{ initMobileNav(); initThemeToggle(); });
  } else {
    initMobileNav(); initThemeToggle();
  }

})();
