// Header scroll state
const header = document.getElementById('siteHeader');
const onScroll = () => {
  if (window.scrollY > 40) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll);
onScroll();

// Mobile navigation
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (menuToggle && mobileMenu) {
  const setMenu = (open) => {
    menuToggle.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  };
  menuToggle.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
  mobileMenu.querySelectorAll('a, button').forEach((item) => item.addEventListener('click', () => setMenu(false)));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
}

// FAQ accordion
document.querySelectorAll('.faq-item').forEach((item) => {
  const q = item.querySelector('.faq-q');
  q.addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// Location map + distance list: reveal together on scroll into view.
const locationGrid = document.querySelector('.location-grid');
const mapCard = document.querySelector('.map-card');
const distanceList = document.querySelector('.distance-list');
if (locationGrid && mapCard && distanceList) {
  new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        mapCard.classList.add('in-view');
        distanceList.classList.add('in-view');
        obs.unobserve(locationGrid);
      }
    });
  }, { threshold: 0.25 }).observe(locationGrid);
}

// Floor plan panel: match its height to the render photo beside it.
const elevationPhoto = document.querySelector('.elevation-photo');
const floorPlanPanel = document.querySelector('.floor-plan-panel');
if (elevationPhoto && floorPlanPanel) {
  const syncPanelHeight = () => {
    if (window.innerWidth < 980) {
      floorPlanPanel.style.height = '';
    } else {
      floorPlanPanel.style.height = `${elevationPhoto.offsetHeight}px`;
    }
  };
  new ResizeObserver(syncPanelHeight).observe(elevationPhoto);
  window.addEventListener('resize', syncPanelHeight);
}

// Floor plan widget: floor tabs + render zones both drive the same plan panel.
const fpEmpty = document.getElementById('fpEmpty');
const fpContent = document.getElementById('fpContent');
const fpImageWrap = document.getElementById('fpImageWrap');
const fpLvl = document.getElementById('fpLvl');
const fpUse = document.getElementById('fpUse');
const floorTriggers = document.querySelectorAll('.elev-zone[data-floor], .floor-tab[data-floor]');

function selectFloor(floorKey, { scroll } = {}) {
  const matches = document.querySelectorAll(`[data-floor="${CSS.escape(floorKey)}"]`);
  if (!matches.length) return;
  const source = matches[0];

  floorTriggers.forEach((el) => el.classList.toggle('active', el.dataset.floor === floorKey));

  fpLvl.textContent = floorKey.replace(/&#8209;/g, '‑');
  fpUse.textContent = source.dataset.use;

  const planSrc = source.dataset.plan;
  fpImageWrap.innerHTML = '';
  const img = document.createElement('img');
  img.src = planSrc;
  img.alt = `${floorKey} layout plan`;
  img.onerror = () => {
    fpImageWrap.innerHTML = `<div class="fp-placeholder">Layout plan for ${floorKey.replace(/&#8209;/g, '‑')} coming soon.</div>`;
  };
  fpImageWrap.appendChild(img);
  fpImageWrap.dataset.planSrc = planSrc;
  fpImageWrap.dataset.planAlt = img.alt;

  fpEmpty.hidden = true;
  fpContent.hidden = false;

  if (scroll && window.innerWidth < 980) {
    document.querySelector('.floor-plan-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

floorTriggers.forEach((el) => {
  el.addEventListener('click', () => selectFloor(el.dataset.floor, { scroll: true }));
});

const initialFloor = document.querySelector('.elev-zone.active, .floor-tab.active');
if (initialFloor) selectFloor(initialFloor.dataset.floor);

// Floor plan lightbox: click the plan to open a zoomable, pannable fullscreen view.
const planLightbox = document.getElementById('planLightbox');
const lightboxStage = document.getElementById('lightboxStage');
const lightboxImg = document.getElementById('lightboxImg');
const fpZoom = document.getElementById('fpZoom');
if (planLightbox && lightboxStage && lightboxImg && fpZoom) {
  let scale = 1, panX = 0, panY = 0, dragging = false, lastX = 0, lastY = 0;

  const applyTransform = () => {
    lightboxImg.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
  };
  const resetTransform = () => { scale = 1; panX = 0; panY = 0; applyTransform(); };

  const openLightbox = () => {
    if (!fpImageWrap.dataset.planSrc) return;
    lightboxImg.src = fpImageWrap.dataset.planSrc;
    lightboxImg.alt = fpImageWrap.dataset.planAlt || '';
    resetTransform();
    planLightbox.classList.add('open');
    planLightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  fpZoom.addEventListener('click', openLightbox);
  fpImageWrap.addEventListener('click', () => { if (fpImageWrap.querySelector('img')) openLightbox(); });

  lightboxStage.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    scale = Math.min(4, Math.max(1, scale + delta));
    if (scale === 1) { panX = 0; panY = 0; }
    applyTransform();
  }, { passive: false });

  lightboxStage.addEventListener('mousedown', (e) => {
    if (scale === 1) return;
    dragging = true; lastX = e.clientX; lastY = e.clientY;
    lightboxStage.classList.add('grabbing');
  });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    panX += e.clientX - lastX; panY += e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    applyTransform();
  });
  window.addEventListener('mouseup', () => { dragging = false; lightboxStage.classList.remove('grabbing'); });

  let pinchDist = null;
  lightboxStage.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      pinchDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    } else if (e.touches.length === 1 && scale > 1) {
      dragging = true; lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
    }
  }, { passive: true });
  lightboxStage.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && pinchDist !== null) {
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      scale = Math.min(4, Math.max(1, scale * (dist / pinchDist)));
      pinchDist = dist;
      if (scale === 1) { panX = 0; panY = 0; }
      applyTransform();
    } else if (e.touches.length === 1 && dragging) {
      panX += e.touches[0].clientX - lastX; panY += e.touches[0].clientY - lastY;
      lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
      applyTransform();
    }
  }, { passive: true });
  lightboxStage.addEventListener('touchend', () => { dragging = false; pinchDist = null; });
}

// --- Meta Pixel + GA4: loaded dynamically from /api/config so no IDs are
// hardcoded per-environment. Silently does nothing if /api isn't deployed
// (e.g. when previewing this file standalone).
let metaPixelReady = false;
let salesWhatsAppNumber = '923011233333';

function getCookie(name) {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
}

function getAttributionData() {
  const params = new URLSearchParams(window.location.search);
  return {
    pageUrl: window.location.href,
    pageTitle: document.title,
    referrer: document.referrer || '',
    fbp: getCookie('_fbp') || '',
    fbc: getCookie('_fbc') || '',
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
    utm_term: params.get('utm_term') || '',
  };
}

function updateWhatsAppLinks(number) {
  const clean = String(number || '').replace(/[^\d]/g, '');
  if (!clean) return;
  salesWhatsAppNumber = clean;
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach((link) => {
    link.href = `https://wa.me/${clean}`;
  });
}

(async () => {
  let config;
  try {
    config = await fetch('/api/config').then((r) => r.json());
  } catch {
    return; // no backend available (e.g. static preview) — skip tracking setup
  }

  if (config.salesWhatsAppNumber) updateWhatsAppLinks(config.salesWhatsAppNumber);

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
  const submit = form.querySelector('[type="submit"]');
  const error = document.createElement('div');
  error.className = 'form-error';
  form.appendChild(error);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.classList.remove('show');
    error.textContent = '';
    if (submit) {
      submit.disabled = true;
      submit.dataset.originalText = submit.textContent;
      submit.textContent = 'Sending...';
    }

    const data = Object.fromEntries(new FormData(form).entries());
    const eventId = (window.crypto?.randomUUID && window.crypto.randomUUID()) || String(Date.now());
    const payload = { ...data, ...getAttributionData(), eventId };

    if (metaPixelReady) fbq('track', 'Lead', {}, { eventID: eventId });
    if (window.gtag) gtag('event', 'generate_lead', { interest: data.interest, budget: data.budget });

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Lead API returned an error');
    } catch (err) {
      console.error('Lead submission failed:', err);
      error.textContent = `We could not submit the form. Please WhatsApp us directly at +${salesWhatsAppNumber}.`;
      error.classList.add('show');
      if (submit) {
        submit.disabled = false;
        submit.textContent = submit.dataset.originalText || 'Submit';
      }
      return;
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
