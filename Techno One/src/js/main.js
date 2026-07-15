// Techno One landing page interactions: header scroll state, mobile menu,
// lead modal, floor-plan viewer, payment tabs, FAQ accordion, sticky
// mobile actions, and lead form submission (modal, quick-lead strip,
// dedicated lead-capture section).

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Header scroll state ---------- */
  const header = document.getElementById("siteHeader");
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  menuToggle.addEventListener("click", () => {
    const isOpen = !mobileMenu.hidden;
    mobileMenu.hidden = isOpen;
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
  });
  mobileMenu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      mobileMenu.hidden = true;
      menuToggle.setAttribute("aria-expanded", "false");
    })
  );

  /* ---------- Lead modal ---------- */
  const leadOverlay = document.getElementById("leadModalOverlay");
  const modalTitle = document.getElementById("modalTitle");
  document.querySelectorAll("[data-open-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.modalTitle) modalTitle.textContent = btn.dataset.modalTitle;
      leadOverlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
    });
  });
  const closeLeadModal = () => {
    leadOverlay.classList.remove("is-open");
    document.body.style.overflow = "";
  };
  leadOverlay.querySelectorAll("[data-close-modal]").forEach((b) => b.addEventListener("click", closeLeadModal));
  leadOverlay.addEventListener("click", (e) => {
    if (e.target === leadOverlay) closeLeadModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLeadModal();
  });

  /* ---------- Floor plan viewer ---------- */
  const FLOORS = {
    "rooftop": { title: "Rooftop", type: "F&B", units: "Dining + Terrace", range: "Terrace Restaurant", status: "Coming Soon", img: "img/floorplans/rooftop.jpg" },
    "fourth": { title: "4th Floor", type: "Corporate Office", units: "6 Units", range: "Offices 401–406", status: "Available", img: "img/floorplans/fourth.jpg" },
    "third": { title: "3rd Floor", type: "Corporate Office", units: "6 Units", range: "Offices 301–306", status: "Available", img: "img/floorplans/third.jpg" },
    "second": { title: "2nd Floor", type: "Corporate Office", units: "6 Units", range: "Offices 201–206", status: "Available", img: "img/floorplans/second.jpg" },
    "first": { title: "1st Floor", type: "Retail", units: "6 Units", range: "Shops 101–106", status: "Available", img: "img/floorplans/first.jpg" },
    "mezzanine": { title: "Mezzanine", type: "Retail", units: "6 Units", range: "Shops M-01–M-06", status: "Available", img: "img/floorplans/mezzanine.jpg" },
    "ground": { title: "Ground Floor", type: "Retail", units: "3 Units", range: "Shops G-01–G-03", status: "Available", img: "img/floorplans/ground.jpg" },
    "lower-ground": { title: "Lower Ground", type: "Retail", units: "3 Units", range: "Shops LGS-01–LGS-03", status: "Available", img: "img/floorplans/lower-ground.jpg" },
  };

  const planTitle = document.getElementById("planTitle");
  const planType = document.getElementById("planType");
  const planUnits = document.getElementById("planUnits");
  const planStatus = document.getElementById("planStatus");
  const planImage = document.getElementById("planImage");
  const allFloorButtons = document.querySelectorAll("[data-floor]");

  function selectFloor(key) {
    const f = FLOORS[key];
    if (!f) return;
    planTitle.textContent = f.title;
    planType.textContent = f.type;
    planUnits.textContent = f.units;
    planUnits.nextElementSibling.textContent = f.range;
    planStatus.textContent = f.status;
    planImage.src = f.img;
    planImage.alt = `Techno One ${f.title} floor plan`;
    allFloorButtons.forEach((b) => {
      const isMatch = b.dataset.floor === key;
      b.setAttribute("aria-selected", String(isMatch));
      b.classList.toggle("is-active", isMatch);
    });
  }
  allFloorButtons.forEach((btn) => btn.addEventListener("click", () => selectFloor(btn.dataset.floor)));

  /* ---------- Plan lightbox ---------- */
  const lightbox = document.getElementById("planLightbox");
  const lightboxImg = document.getElementById("planLightboxImage");
  document.getElementById("planExpand").addEventListener("click", () => {
    lightboxImg.src = planImage.src;
    lightboxImg.alt = planImage.alt;
    lightbox.classList.add("is-open");
  });
  document.getElementById("planLightboxClose").addEventListener("click", () => lightbox.classList.remove("is-open"));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.classList.remove("is-open");
  });

  /* ---------- Location pin map ---------- */
  const mapPins = document.querySelectorAll(".map-pin");
  const landmarkChips = document.querySelectorAll(".landmark-chips button");
  function selectPin(key) {
    mapPins.forEach((p) => p.classList.toggle("is-active", p.dataset.pin === key));
    landmarkChips.forEach((c) => c.setAttribute("aria-selected", String(c.dataset.pin === key)));
  }
  mapPins.forEach((pin) => pin.addEventListener("click", () => selectPin(pin.dataset.pin)));
  landmarkChips.forEach((chip) => chip.addEventListener("click", () => selectPin(chip.dataset.pin)));

  /* ---------- Payment tabs (visual — same placeholder data for all categories) ---------- */
  document.querySelectorAll(".tab-btn").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    q.addEventListener("click", () => {
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach((i) => i.classList.remove("open"));
      if (!wasOpen) item.classList.add("open");
    });
  });

  /* ---------- Payment Customization Chips ---------- */
  document.querySelectorAll(".pref-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("is-active");
    });
  });

  /* ---------- Sticky mobile actions ---------- */
  const sticky = document.getElementById("stickyActions");
  const heroEl = document.querySelector(".hero");
  const paymentEl = document.getElementById("payment");
  const finalCtaEl = document.querySelector(".site-footer");
  const stickySecondary = document.getElementById("stickySecondaryBtn");

  function updateSticky() {
    const heroBottom = heroEl.getBoundingClientRect().bottom;
    const finalTop = finalCtaEl.getBoundingClientRect().top;
    const paymentBounds = paymentEl.getBoundingClientRect();
    const inPayment = paymentBounds.top < window.innerHeight * 0.6 && paymentBounds.bottom > 0;

    const pastHero = heroBottom < 0;
    const reachedFinal = finalTop < window.innerHeight * 0.3;

    sticky.classList.toggle("is-visible", pastHero && window.innerWidth <= 1023);
    sticky.classList.toggle("is-collapsed", reachedFinal);

    if (inPayment) {
      stickySecondary.textContent = "Request Custom Plan";
      stickySecondary.dataset.modalTitle = "Request Customized Payment Plan";
    } else {
      stickySecondary.textContent = "Download Brochure";
      stickySecondary.dataset.modalTitle = "Download Brochure";
    }
  }
  window.addEventListener("scroll", updateSticky, { passive: true });
  window.addEventListener("resize", updateSticky);
  updateSticky();

  /* ---------- Forms ---------- */
  async function submitLead(payload, statusEl) {
    statusEl.textContent = "Sending…";
    statusEl.className = "form-status is-visible";
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, pageUrl: location.href, referrer: document.referrer }),
      });
      if (!res.ok) throw new Error("Request failed");
      statusEl.textContent = "Thank you — continuing on WhatsApp.";
      statusEl.className = "form-status is-visible ok";
    } catch (err) {
      statusEl.textContent = "Could not submit right now — continuing on WhatsApp.";
      statusEl.className = "form-status is-visible err";
    } finally {
      window.open(`https://wa.me/923011233333?text=${encodeURIComponent(`Hi, I'm ${payload.name}. I'm interested in Techno One (${payload.interest || payload.want || "general enquiry"}).`)}`, "_blank");
    }
  }

  const leadForm = document.getElementById("leadForm");
  leadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(leadForm).entries());
    data.want = modalTitle.textContent;
    
    // Append custom plan preferences if applicable
    if (data.want === "Request Customized Payment Plan") {
      const activeChips = Array.from(document.querySelectorAll(".pref-chip.is-active")).map(c => c.textContent);
      if (activeChips.length > 0) {
        data.want += ` (Preferences: ${activeChips.join(", ")})`;
      }
    }

    submitLead(data, document.getElementById("leadStatus"));
  });

  const pageLeadForm = document.getElementById("pageLeadForm");
  pageLeadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(pageLeadForm).entries());
    data.want = "Lead Capture Form";
    submitLead(data, document.getElementById("pageLeadStatus"));
  });
});
