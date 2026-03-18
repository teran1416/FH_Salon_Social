/* global AOS */

const CONFIG = {
  whatsappPhoneE164: "573166957512", // <- número real en formato internacional sin "+"
  whatsappDefaultMessagePrefix: "Hola FH Salón Social, deseo solicitar una cotización/reserva.",
  emailTo: "", // opcional: "tu-correo@dominio.com" (si lo configuras, el botón enviará mailto como alternativa)
  testimonialAutoplayMs: 6500,
};

function qs(sel, root = document) {
  return root.querySelector(sel);
}

function qsa(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function setYear() {
  const el = qs("#year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function normalizePhone(phone) {
  return String(phone || "").replace(/[^\d+]/g, "").replace(/^\+/, "");
}

function buildWhatsappLink(message) {
  const phone = normalizePhone(CONFIG.whatsappPhoneE164);
  const text = encodeURIComponent(message || CONFIG.whatsappDefaultMessagePrefix);
  return `https://wa.me/${phone}?text=${text}`;
}

function initAOS() {
  if (!window.AOS) return;
  AOS.init({
    once: true,
    duration: 800,
    easing: "ease-out-cubic",
    offset: 40,
  });
}

function initMobileMenu() {
  const btn = qs("#menuBtn");
  const menu = qs("#mobileMenu");
  if (!btn || !menu) return;

  const close = () => {
    menu.classList.add("hidden");
    btn.setAttribute("aria-expanded", "false");
  };

  btn.addEventListener("click", () => {
    const isOpen = !menu.classList.contains("hidden");
    if (isOpen) close();
    else {
      menu.classList.remove("hidden");
      btn.setAttribute("aria-expanded", "true");
    }
  });

  qsa('a[href^="#"]', menu).forEach((a) => a.addEventListener("click", close));
}

function initSmoothScrolling() {
  qsa('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = qs(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: "smooth" });
      history.replaceState(null, "", href);
    });
  });
}

function initActiveNavLinks() {
  const links = qsa('.nav-link[href^="#"]');
  const ids = links
    .map((l) => l.getAttribute("href"))
    .filter(Boolean)
    .filter((h) => h.startsWith("#"))
    .map((h) => h.slice(1));

  const sections = ids
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!sections.length) return;

  const setActive = (id) => {
    links.forEach((l) => {
      const href = l.getAttribute("href");
      const is = href === `#${id}`;
      l.classList.toggle("is-active", is);
    });
  };

  const obs = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
      if (visible?.target?.id) setActive(visible.target.id);
    },
    { root: null, threshold: [0.25, 0.35, 0.5, 0.65] },
  );

  sections.forEach((s) => obs.observe(s));
}

function initWhatsAppCTAs() {
  const href = buildWhatsappLink(CONFIG.whatsappDefaultMessagePrefix);
  const ids = [
    "#whatsappFloating",
    "#ctaWhatsappHero",
    "#ctaWhatsappHeroSecondary",
    "#ctaWhatsappNav",
    "#ctaWhatsappNavMobile",
  ];
  ids.forEach((id) => {
    const el = qs(id);
    if (!el) return;
    el.setAttribute("href", href);
    el.setAttribute("target", "_blank");
  });
}

function initTestimonialsCarousel() {
  const track = qs("#testimonialTrack");
  const prev = qs("#prevTestimonial");
  const next = qs("#nextTestimonial");
  const dots = qsa(".dot");
  if (!track || !prev || !next) return;

  const cards = qsa(".testimonial-card", track);
  const total = cards.length;
  if (!total) return;

  let idx = 0;
  let timer = null;

  const update = (newIdx, { announce = true } = {}) => {
    idx = (newIdx + total) % total;
    const containerWidth = track.parentElement.getBoundingClientRect().width;
    track.style.transform = `translateX(${-idx * containerWidth}px)`;
    dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
    if (announce) track.setAttribute("aria-label", `Testimonio ${idx + 1} de ${total}`);
  };

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
  };
  const start = () => {
    stop();
    timer = window.setInterval(() => update(idx + 1, { announce: false }), CONFIG.testimonialAutoplayMs);
  };

  prev.addEventListener("click", () => {
    update(idx - 1);
    start();
  });
  next.addEventListener("click", () => {
    update(idx + 1);
    start();
  });
  dots.forEach((d) => {
    d.addEventListener("click", () => {
      const i = Number(d.getAttribute("data-dot") || "0");
      update(i);
      start();
    });
  });

  window.addEventListener("resize", () => update(idx, { announce: false }));

  // Arranque
  update(0, { announce: false });
  start();

  // Pausa cuando el usuario interactúa en hover/focus (mejor UX)
  track.addEventListener("mouseenter", stop);
  track.addEventListener("mouseleave", start);
  track.addEventListener("focusin", stop);
  track.addEventListener("focusout", start);
}

function initGalleryLightbox() {
  const box = qs("#lightbox");
  const img = qs("#lightboxImg");
  const closeBtn = qs("#lightboxClose");
  if (!box || !img || !closeBtn) return;

  const open = (src) => {
    img.src = src;
    box.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  };

  const close = () => {
    box.classList.add("hidden");
    img.removeAttribute("src");
    document.body.style.overflow = "";
  };

  qsa(".gallery-item").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const src = a.getAttribute("data-img") || "";
      if (src) open(src);
    });
  });

  closeBtn.addEventListener("click", close);
  box.addEventListener("click", (e) => {
    if (e.target === box) close();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !box.classList.contains("hidden")) close();
  });
}

function validate(form) {
  const get = (id) => qs(`#${id}`, form);
  const setError = (id, msg) => {
    const field = get(id);
    const err = qs(`[data-error-for="${id}"]`, form);
    if (field) field.classList.toggle("is-invalid", Boolean(msg));
    if (err) err.textContent = msg || "";
  };

  const nombre = get("nombre")?.value?.trim() || "";
  const telefono = get("telefono")?.value?.trim() || "";
  const tipo = get("tipo")?.value?.trim() || "";
  const fecha = get("fecha")?.value || "";
  const mensaje = get("mensaje")?.value?.trim() || "";

  let ok = true;

  if (nombre.length < 2) {
    setError("nombre", "Ingresa tu nombre.");
    ok = false;
  } else setError("nombre", "");

  const digits = telefono.replace(/[^\d]/g, "");
  if (digits.length < 7) {
    setError("telefono", "Ingresa un teléfono válido.");
    ok = false;
  } else setError("telefono", "");

  if (!tipo) {
    setError("tipo", "Selecciona el tipo de evento.");
    ok = false;
  } else setError("tipo", "");

  if (!fecha) {
    setError("fecha", "Selecciona una fecha.");
    ok = false;
  } else setError("fecha", "");

  if (mensaje.length < 10) {
    setError("mensaje", "Cuéntanos un poco más (mín. 10 caracteres).");
    ok = false;
  } else setError("mensaje", "");

  return {
    ok,
    values: { nombre, telefono, tipo, fecha, mensaje },
  };
}

function initQuoteForm() {
  const form = qs("#quoteForm");
  const status = qs("#formStatus");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const result = validate(form);
    if (!result.ok) {
      if (status) status.textContent = "Revisa los campos marcados e inténtalo de nuevo.";
      const firstInvalid = qs(".field.is-invalid", form);
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const { nombre, telefono, tipo, fecha, mensaje } = result.values;
    const msg =
      `${CONFIG.whatsappDefaultMessagePrefix}\n\n` +
      `Nombre: ${nombre}\n` +
      `Teléfono: ${telefono}\n` +
      `Tipo de evento: ${tipo}\n` +
      `Fecha: ${fecha}\n` +
      `Mensaje: ${mensaje}\n`;

    const wa = buildWhatsappLink(msg);
    if (status) status.textContent = "Listo. Abriendo WhatsApp para enviar tu solicitud…";
    window.open(wa, "_blank", "noopener");

    if (CONFIG.emailTo) {
      const subject = encodeURIComponent("Solicitud de cotización - FH Salón Social");
      const body = encodeURIComponent(msg);
      const mailto = `mailto:${CONFIG.emailTo}?subject=${subject}&body=${body}`;
      setTimeout(() => window.open(mailto, "_blank"), 450);
    }

    form.reset();
  });
}

function boot() {
  setYear();
  initAOS();
  initMobileMenu();
  initSmoothScrolling();
  initActiveNavLinks();
  initWhatsAppCTAs();
  initTestimonialsCarousel();
  initGalleryLightbox();
  initQuoteForm();
}

document.addEventListener("DOMContentLoaded", boot);

