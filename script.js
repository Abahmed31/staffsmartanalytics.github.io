// script.js — Mobile nav toggle, form protections, year fill, simple helpers
(function(){
  'use strict';
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  // Fill year placeholders
  function fillYears(){
    $$('[id^="yr"], [id^="year"]').forEach(el => el.textContent = new Date().getFullYear());
  }

  // Mobile nav toggle
  function initMobileNav(){
    const btn = document.getElementById('navToggle');
    const mobile = document.getElementById('mobileNav');
    if(!btn || !mobile) return;
    function setOpen(open){
      mobile.style.display = open ? 'block' : 'none';
      btn.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    }
    btn.addEventListener('click', ()=> setOpen(mobile.style.display !== 'block'));
    // close on link click
    mobile.addEventListener('click', (e)=>{
      if(e.target.tagName === 'A') setOpen(false);
    });
    // close on escape
    document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') setOpen(false); });
  }

  // Form protections: honeypot + basic PII-like check
  function containsSSNLike(text){
    if(!text) return false;
    const ssnDash = /\b\d{3}-\d{2}-\d{4}\b/;
    const ssnPlain = /\b\d{9}\b/;
    return ssnDash.test(text) || ssnPlain.test(text);
  }
  function initFormProtections(){
    $$('form').forEach(form=>{
      form.addEventListener('submit', (e)=>{
        const honeypot = form.querySelector('input[name="website"], input[name="hp"]');
        if(honeypot && honeypot.value.trim() !== ''){
          e.preventDefault(); return false;
        }
        const checkbox = form.querySelector('input[name="no_pii_confirm"]');
        if(checkbox && !checkbox.checked){
          e.preventDefault();
          alert('Please confirm you will not submit PII before sending.');
          return false;
        }
        const msg = form.querySelector('textarea[name="message"], input[name="message"]');
        if(msg && containsSSNLike(msg.value)){
          e.preventDefault();
          alert('Your message appears to contain a number that resembles an SSN. Remove personal identifiers before submitting.');
          return false;
        }
        // allow submission (Formspree will handle)
        return true;
      }, {passive:false});
    });
  }

  // Prevent focus ring annoyance for mouse users
  function initFocusRings(){
    let mouseUsed = false;
    window.addEventListener('mousedown', ()=> mouseUsed = true);
    window.addEventListener('keydown', (e)=> { if(e.key === 'Tab') mouseUsed = false; });
    document.addEventListener('focusin', (e)=> { if(!mouseUsed) e.target.classList.add('focus-ring'); });
    document.addEventListener('focusout', (e)=> { e.target.classList.remove('focus-ring'); });
  }

  // Smooth internal anchor scroll
  function initSmoothScroll(){
    document.addEventListener('click',(e)=>{
      const a = e.target.closest('a[href^="#"]'); if(!a) return;
      const id = a.getAttribute('href').slice(1); if(!id) return;
      const target = document.getElementById(id); if(!target) return;
      e.preventDefault(); target.scrollIntoView({behavior:'smooth',block:'start'});
      try{ target.tabIndex = -1; target.focus(); }catch(err){}
    });
  }

  // init
  function init(){
    fillYears(); initMobileNav(); initFormProtections(); initFocusRings(); initSmoothScroll();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
