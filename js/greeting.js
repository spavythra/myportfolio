// Purpose: show cookie consent popup on load; if accepted, fetch visitor's org via ipapi.co and display greeting.
// Uses localStorage key "portfolio_consent" to store { personalization: true/false, ts }
// No personal names are collected. Only organization inference when consent is given.

function show(el){ if(!el) return; el.classList.remove('hidden'); el.style.display = ''; }
function hide(el){ if(!el) return; el.classList.add('hidden'); el.style.display = 'none'; }

function getConsent(){
  try {
    const s = localStorage.getItem('portfolio_consent');
    return s ? JSON.parse(s) : null;
  } catch(e) { return null; }
}
function setConsent(obj){
  try { localStorage.setItem('portfolio_consent', JSON.stringify(obj)); } catch(e){}
}

function setOrgGreeting(orgRaw){
  const el = document.getElementById('orgGreeting');
  if(!el) return;
  if(!orgRaw) { hide(el); return; }
  // remove common company suffixes
  let org = orgRaw.replace(/\b(Inc\.?|LLC|Ltd\.?|Limited|Corporation|Corp\.?|LLP)\b/gi, '').trim();
  // shorten if excessively long
  if(org.split(' ').length > 4) org = org.split(' ').slice(0,2).join(' ');
  el.textContent = `Hi there from ${org}`;
  show(el);
}

async function fetchOrgViaIpapi() {
  try {
    const rText = await fetch('https://ipapi.co/org');
    if (rText && rText.ok) {
      const org = (await rText.text()).trim();
      if (org) return org;
    }
  } catch (e) {}
  try {
    const r = await fetch('https://ipapi.co/json/');
    if (!r.ok) return null;
    const j = await r.json();
    return j.org || j.organization || null;
  } catch (e) { return null; }
}

async function runGreetingFlow() {
  const consent = getConsent();
  const banner = document.getElementById('cookieConsentBanner');

  if (!consent) {
    show(banner);
    const acceptBtn = document.getElementById('btnAcceptCookies');
    const rejectBtn = document.getElementById('btnRejectCookies');

    acceptBtn?.addEventListener('click', async function(){
      setConsent({ personalization: true, ts: new Date().toISOString() });
      hide(banner);
      try {
        const org = await fetchOrgViaIpapi();
        if (org) setOrgGreeting(org);
      } catch(e){ }
    });

    rejectBtn?.addEventListener('click', function(){
      setConsent({ personalization: false, ts: new Date().toISOString() });
      hide(banner);
      setOrgGreeting(null);
    });

  } else {
    if (consent.personalization) {
      try {
        const org = await fetchOrgViaIpapi();
        if (org) setOrgGreeting(org);
      } catch(e){ }
    } else {
      setOrgGreeting(null);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runGreetingFlow);
} else {
  runGreetingFlow();
}