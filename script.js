// script.js - mobile nav toggle + resize watcher
(function(){
  'use strict';
  const $ = sel => document.querySelector(sel);

  function initMobileNav(){
    const btn = $('#navToggle');
    const mobile = $('#mobileNav');
    if(!btn || !mobile) return;
    btn.addEventListener('click', ()=>{
      const isOpen = mobile.style.display === 'block';
      mobile.style.display = isOpen ? 'none' : 'block';
      btn.setAttribute('aria-expanded', String(!isOpen));
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    });
    mobile.addEventListener('click', (e)=>{
      if(e.target.tagName === 'A'){
        mobile.style.display = 'none';
        btn.setAttribute('aria-expanded','false');
        document.body.style.overflow = '';
      }
    });
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape') {
        mobile.style.display = 'none';
        if(btn) btn.setAttribute('aria-expanded','false');
        document.body.style.overflow = '';
      }
    });
  }

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

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ()=>{ initMobileNav(); initResizeWatcher(); });
  } else {
    initMobileNav(); initResizeWatcher();
  }
})();
