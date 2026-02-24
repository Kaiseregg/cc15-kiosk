
const STORAGE_KEYS = { lang:'cc15_lang', cart:'cc15_cart', order:'cc15_order' };

const I18N = {
  de:{ cart:"Warenkorb", checkout:"Kasse", payment:"Zahlung", confirm:"Bestätigung", back:"Zurück",
       emptyCart:"Dein Warenkorb ist leer.", continue:"Weiter einkaufen", toCheckout:"Zur Kasse",
       name:"Name", firstname:"Vorname", phone:"Handy", location:"Ort", time:"Zeitfenster",
       createOrder:"Bestellung erstellen", twintTitle:"TWINT Zahlung", copy:"Kopieren", copied:"Kopiert",
       paid:"Ich habe bezahlt", newOrder:"Neue Bestellung", total:"Total", qty:"Menge", remove:"Entfernen",
       addToCart:"In den Warenkorb", close:"Schliessen", corb:"Corbières", azh:"AZH Romont",
       time1:"09:00", time2:"11:00", time3:"13:30", orderNo:"Bestellnummer",
       notePay:"Bitte TWINT senden. Danach hier bestätigen.", noteData:"Daten werden lokal gespeichert (Testmodus).",
       demo:"Demo / Offline UI"
  },
  fr:{ cart:"Panier", checkout:"Caisse", payment:"Paiement", confirm:"Confirmation", back:"Retour",
       emptyCart:"Votre panier est vide.", continue:"Continuer", toCheckout:"Passer à la caisse",
       name:"Nom", firstname:"Prénom", phone:"Mobile", location:"Lieu", time:"Créneau",
       createOrder:"Créer la commande", twintTitle:"Paiement TWINT", copy:"Copier", copied:"Copié",
       paid:"J'ai payé", newOrder:"Nouvelle commande", total:"Total", qty:"Quantité", remove:"Supprimer",
       addToCart:"Ajouter au panier", close:"Fermer", corb:"Corbières", azh:"AZH Romont",
       time1:"09:00", time2:"11:00", time3:"13:30", orderNo:"Numéro",
       notePay:"Envoyez TWINT, puis confirmez ici.", noteData:"Données enregistrées localement (mode test).",
       demo:"Démo / UI hors ligne"
  }
};

function getLang(){ return localStorage.getItem(STORAGE_KEYS.lang) || 'de'; }
function setLang(l){ localStorage.setItem(STORAGE_KEYS.lang, l); }
function t(key){ const l=getLang(); return (I18N[l] && I18N[l][key]) || key; }

function getCart(){ try{return JSON.parse(localStorage.getItem(STORAGE_KEYS.cart)||'[]')}catch{return []} }
function setCart(items){ localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(items)); }
function cartCount(){ return getCart().reduce((a,it)=>a+it.qty,0); }
function money(n){ return (Math.round(n*100)/100).toFixed(2); }
function cartTotal(){ return getCart().reduce((a,it)=>a + it.qty*it.price,0); }

function syncHeader(){
  const badge=document.querySelector('[data-cart-badge]');
  if(badge){
    const n = cartCount();
    badge.textContent = String(n);
    badge.style.display = n>0 ? 'flex' : 'none';
  }
  document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('active', b.dataset.lang===getLang()));
  document.querySelectorAll('[data-i18n]').forEach(el=>{ el.textContent=t(el.dataset.i18n); });
}

function wireLang(){
  document.querySelectorAll('[data-lang]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ setLang(btn.dataset.lang); syncHeader(); if(window.renderPage) window.renderPage(); });
  });
}

function goto(href){ window.location.href=href; }

function initCommon(){
  wireLang();
  const cartBtn=document.querySelector('[data-cart-btn]');
  if(cartBtn) cartBtn.addEventListener('click', ()=>goto('cart.html'));
  const backBtn=document.querySelector('[data-back]');
  if(backBtn) backBtn.addEventListener('click', ()=> (history.length>1 ? history.back() : goto('index.html')) );
  syncHeader();
}

// Supabase helper (created on-demand). Avoid persistent sessions for kiosk usage.
let __cc15_sb = null;
function getSupabase(){
  if(__cc15_sb) return __cc15_sb;
  const cfg = window.CC15_CONFIG && window.CC15_CONFIG.supabase;
  if(!cfg || !cfg.url || !cfg.anon) throw new Error('Missing Supabase config (url/anon) in config.js');
  if(!window.supabase || !window.supabase.createClient) throw new Error('Supabase JS not loaded');
  __cc15_sb = window.supabase.createClient(cfg.url, cfg.anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return __cc15_sb;
}

window.CC15 = { t, getLang, setLang, getCart, setCart, cartCount, cartTotal, money, syncHeader, goto, initCommon, STORAGE_KEYS, getSupabase };
