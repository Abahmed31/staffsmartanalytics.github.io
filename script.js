// script.js - mobile nav toggle + small helpers
(function(){
  'use strict';
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // MOBILE NAV TOGGLE
  function initMobileNav(){
    const btn = $('#navToggle');
    const mobile = $('#mobileNav');
    if(!btn || !mobile) return;
    btn.addEventListener('click', ()=>{
      const isOpen = mobile.style.display === 'block';
      mobile.style.display = isOpen ? 'none' : 'block';
      btn.setAttribute('aria-expanded', String(!isOpen));
      // lock scroll when open
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    });
    // close on link click (mobile)
    mobile.addEventListener('click', (e)=>{
      if(e.target.tagName === 'A'){
        mobile.style.display = 'none';
        btn.setAttribute('aria-expanded','false');
        document.body.style.overflow = '';
      }
    });
    // close on escape
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape') {
        mobile.style.display = 'none';
        if(btn) btn.setAttribute('aria-expanded','false');
        document.body.style.overflow = '';
      }
    });
  }

  // accessibility: hide mobile nav if screen resizes to desktop
  function initResizeWatcher(){
    let lastW = window.innerWidth;
    window.addEventListener('resize', ()=>{
      const w = window.innerWidth;
      if(w > 980 && lastW <= 980){
        const mobile = document.getElementById('mobileNav');
        if(mobile) mobile.style.display = 'none';
        const btn = document.getElementById('navToggle');
        if(btn) btn.setAttribute('aria-expanded','false');
        document.body.style.overflow = '';
      }
      lastW = w;
    });
  }

  // run on DOM ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ()=>{ initMobileNav(); initResizeWatcher(); });
  } else {
    initMobileNav(); initResizeWatcher();
  }
})();
