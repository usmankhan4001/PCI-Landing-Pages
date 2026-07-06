// Header scroll state
const header = document.getElementById('siteHeader');
const onScroll = () => {
  if (window.scrollY > 40) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll);
onScroll();

// FAQ accordion
document.querySelectorAll('.faq-item').forEach((item) => {
  const q = item.querySelector('.faq-q');
  q.addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// Floor plan panel: click a floor on the render, show its plan on the side.
// data-plan images don't exist yet (placeholder paths) — falls back to a
// text placeholder via onerror until real floor plan PNGs are dropped in.
const fpEmpty = document.getElementById('fpEmpty');
const fpContent = document.getElementById('fpContent');
const fpImageWrap = document.getElementById('fpImageWrap');
const fpLvl = document.getElementById('fpLvl');
const fpUse = document.getElementById('fpUse');
document.querySelectorAll('.elev-zone[data-floor]').forEach((floor) => {
  floor.addEventListener('click', () => {
    document.querySelectorAll('.elev-zone.active').forEach((f) => f.classList.remove('active'));
    floor.classList.add('active');

    fpLvl.textContent = floor.dataset.floor.replace(/&#8209;/g, '‑');
    fpUse.textContent = floor.dataset.use;

    const planSrc = floor.dataset.plan;
    fpImageWrap.innerHTML = '';
    const img = document.createElement('img');
    img.src = planSrc;
    img.alt = `${floor.dataset.floor} layout plan`;
    img.onerror = () => {
      fpImageWrap.innerHTML = `<div class="fp-placeholder">Layout plan for ${floor.dataset.floor.replace(/&#8209;/g, '‑')} coming soon.</div>`;
    };
    fpImageWrap.appendChild(img);

    fpEmpty.hidden = true;
    fpContent.hidden = false;
  });
});

// Map routes: tap-to-activate for touch devices (hover doesn't work reliably on mobile)
document.querySelectorAll('.map-route').forEach((route) => {
  route.addEventListener('click', (e) => {
    e.preventDefault();
    const wasActive = route.classList.contains('active');
    document.querySelectorAll('.map-route.active').forEach((r) => r.classList.remove('active'));
    if (!wasActive) route.classList.add('active');
  });
});

// --- Meta Pixel + GA4: loaded dynamically from /api/config so no IDs are
// hardcoded per-environment. Silently does nothing if /api isn't deployed
// (e.g. when previewing this file standalone).
let metaPixelReady = false;
(async () => {
  let config;
  try {
    config = await fetch('/api/config').then((r) => r.json());
  } catch {
    return; // no backend available (e.g. static preview) — skip tracking setup
  }

  if (config.pixelId) {
    /* eslint-disable */
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    fbq('init', config.pixelId);
    fbq('track', 'PageView');
    metaPixelReady = true;
  }

  if (config.ga4Id) {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${config.ga4Id}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      dataLayer.push(arguments);
    };
    gtag('js', new Date());
    gtag('config', config.ga4Id);
  }
})();

// Lead forms (main section + modal): fires Meta Pixel + GA4 client-side,
// then posts to /api/lead which fans out to Meta CAPI, Bitrix, and WAHA.
function wireLeadForm(formId, wrapId, successId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const eventId = (crypto.randomUUID && crypto.randomUUID()) || String(Date.now());

    if (metaPixelReady) fbq('track', 'Lead', {}, { eventID: eventId });
    if (window.gtag) gtag('event', 'generate_lead', { interest: data.interest, budget: data.budget });

    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, eventId }),
      });
    } catch (err) {
      console.error('Lead submission failed:', err);
    }

    document.getElementById(wrapId).style.display = 'none';
    document.getElementById(successId).classList.add('show');
  });
}
wireLeadForm('leadForm', 'leadFormWrap', 'formSuccess');
wireLeadForm('modalLeadForm', 'modalFormWrap', 'modalFormSuccess');

// Lead modal: opened by any [data-open-modal], closed by backdrop/close button/Escape
document.querySelectorAll('[data-open-modal]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const modal = document.getElementById(trigger.dataset.openModal);
    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  });
});
function closeModal(modal) {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
document.querySelectorAll('.modal-overlay').forEach((modal) => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });
  modal.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => closeModal(modal));
  });
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(closeModal);
  }
});
