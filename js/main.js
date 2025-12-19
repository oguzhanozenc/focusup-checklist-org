document.addEventListener("DOMContentLoaded", () => {
  /* =========================
   *  HELPERS
   * ========================= */
  const header = document.querySelector(".site-header");

  function getHeaderOffset() {
    if (!header) return 0;
    return header.getBoundingClientRect().height;
  }

  /* =========================
   *  1) MENÚ HAMBURGUESA
   * ========================= */
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav-toggle");

  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.classList.toggle("is-open");
      nav.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // cerrar al clickear un item (mobile)
    nav.addEventListener("click", (e) => {
      const link = e.target.closest("a[data-scroll]");
      if (!link) return;

      if (window.innerWidth <= 768) {
        navToggle.classList.remove("is-open");
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  /* =========================
   *  2) SMOOTH SCROLL CON OFFSET
   * ========================= */
  function smoothScrollTo(targetId) {
    const el = document.getElementById(targetId);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetY = rect.top + scrollTop - getHeaderOffset();

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  }

  document.querySelectorAll("a[data-scroll]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      e.preventDefault();
      smoothScrollTo(href.substring(1));
    });
  });

  /* =========================
   *  3) HEADER SHRINK ON SCROLL
   * ========================= */
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!header || ticking) return;

    ticking = true;
    requestAnimationFrame(() => {
      header.classList.toggle("is-scrolled", window.scrollY > 10);
      ticking = false;
    });
  });

/* =========================
 *  4) MODAL CONTACT (Bootstrap)
 * ========================= */
const contactForm = document.getElementById("contact-form");
const contactMessage = document.getElementById("contact-message");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullNameInput = contactForm.querySelector("#full-name");
    const emailInput = contactForm.querySelector("#email");
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();

    // Reset errores visuales
    fullNameInput.classList.remove("is-invalid");
    emailInput.classList.remove("is-invalid");

    let hasError = false;

    // Validación simple de requeridos
    if (fullName.length < 2) {
      hasError = true;
      fullNameInput.classList.add("is-invalid");
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      hasError = true;
      emailInput.classList.add("is-invalid");
    }

    if (hasError) {
      showContactMessage(
        "Please complete the required fields marked with *.",
        false
      );
      return;
    }

    // Deshabilitar botón mientras se envía
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Network error");

      const text = await response.text();
      if (text.trim() !== "OK") {
        throw new Error("Server error: " + text);
      }

      contactForm.reset();
      showContactMessage("Thank you! Your message has been sent.", true);

      submitBtn.disabled = false;
      submitBtn.textContent = originalText;

      // Opcional: cerrar modal después de un tiempo
      // const modalEl = document.getElementById("contactModal");
      // const modalInstance = bootstrap.Modal.getInstance(modalEl);
      // setTimeout(() => modalInstance?.hide(), 2000);
    } catch (err) {
      console.error(err);
      showContactMessage(
        "There was a problem sending your message. Please try again.",
        false
      );
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

function showContactMessage(message, isSuccess) {
  if (!contactMessage) return;
  contactMessage.textContent = message;
  contactMessage.hidden = false;
  contactMessage.classList.toggle("modal-message--success", isSuccess);
  contactMessage.classList.toggle("modal-message--error", !isSuccess);
}


  /* =========================
   *  5) REVEAL ON SCROLL
   * ========================= */
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }

  /* =========================
   *  6) FACTS CARD (slider)
   * ========================= */
const factsCard = document.querySelector("[data-facts-card]");
const factsTitleEl = document.querySelector("[data-facts-title]");
const factsBodyEl = document.querySelector("[data-facts-body]");
const factsNextBtn = document.querySelector("[data-facts-next]");

if (factsCard && factsTitleEl && factsBodyEl && factsNextBtn) {
  const factsSlides = [
      {
        title: `<h2 class="problem-title white">Car crashes are <span class="accent">the second leading cause of death for U.S. teenagers.</span></h2>`,
        body: `<h3 class="problem-title white">New drivers <span class="accent">(ages 16–19)</span> are a small fraction of the driving population…<br/>
        …but they’re involved in <span class="accent">25% of all crashes.</span></h3>`,
      },
      {
        title: `<h3 class="problem-title white">In 2023, U.S. roadways saw:</h3>`,
        body: `
          <ul class="facts-list">
            <li><span class="accent">42,514</span> deaths</li>
            <li><span class="accent">4.6 million</span> serious injuries</li>
            <li><span class="accent">6+ million</span> crashes</li>
          </ul>
        `,
      },
      {
        title: `<h3 class="problem-title white">These crashes cost Americans:</h3>`,
        body: `
          <ul class="facts-list">
            <li><span class="accent">$432 billion</span> tangible losses</li>
            <li><span class="accent">$1.4 trillion</span> quality-of-life impacts</li>
          </ul>
        `,
      },
      {
        title: `<h2 class="problem-title white"><span class="accent">94%</span> of crashes are caused <span class="accent">by human choice, error or mistake</span> —</h2>`,
        body: `
          <ul class="facts-list">
            <li><span class="accent">33%</span> impairment</li>
            <li><span class="accent">32%</span> speeding</li>
            <li><span class="accent">29%</span> distraction</li>
          </ul>
        `,
      },
      {
        title: `<h2 class="problem-title white">Teen drivers have a fatal crash rate <span class="accent">3x higher than drivers aged 20+</span> (per mile driven).</h2>`,
        body: ``,
      },
      {
        title: `<h2 class="problem-title white">This isn’t just data — it’s a chance to change the story.</h2>`,
        body: `<h2 class="problem-title white">With <span class="accent">one simple checklist</span>, we can make roads safer.</h2>`,
      },
    ];

let index = 0;
  let isSwitching = false;
  const TRANSITION_MS = 400;

  function lockPageScroll() {
    document.body.style.overflow = "hidden";
  }

  function unlockPageScroll() {
    document.body.style.overflow = "";
  }

  function renderFact(i) {
    const slide = factsSlides[i];
    if (!slide) return;

    isSwitching = true;

    const currentItem = factsBodyEl.querySelector(".facts-body-item");
    if (currentItem) {
      currentItem.classList.remove("is-visible");
    }

    setTimeout(() => {
      factsTitleEl.innerHTML = slide.title;

      const wrapper = document.createElement("div");
      wrapper.className = "facts-body-item";
      wrapper.innerHTML = slide.body;

      factsBodyEl.innerHTML = "";
      factsBodyEl.appendChild(wrapper);

      void wrapper.offsetWidth;
      wrapper.classList.add("is-visible");

      factsNextBtn.classList.toggle(
        "is-disabled",
        i === factsSlides.length - 1
      );

      setTimeout(() => {
        isSwitching = false;
      }, TRANSITION_MS);
    }, currentItem ? TRANSITION_MS : 0);
  }

  function nextFact() {
    if (isSwitching || index >= factsSlides.length - 1) return;

    index++;
    renderFact(index);

    if (index < factsSlides.length - 1) {
      // Todavía hay slides internos: seguimos bloqueando el scroll de la página
      lockPageScroll();
    } else {
      // Último slide: liberar el scroll global
      unlockPageScroll();
    }
  }

  // Inicial
  renderFact(index);

  // Click en el botón "Next"
  factsNextBtn.addEventListener("click", nextFact);

  // Wheel suave con acumulación
  let wheelAccumulator = 0;
  const WHEEL_THRESHOLD = 60; // más sensible que 120

  function onWheel(e) {
    // Si ya estamos en el último slide, dejar que la página scrollee normal
    if (index >= factsSlides.length - 1) {
      unlockPageScroll();
      return;
    }

    // Mientras haya slides internos, consumimos el scroll aquí
    e.preventDefault();
    lockPageScroll();

    if (isSwitching) return;

    wheelAccumulator += e.deltaY;

    if (wheelAccumulator >= WHEEL_THRESHOLD) {
      wheelAccumulator = 0;
      nextFact();
    }
  }

  factsCard.addEventListener("wheel", onWheel, { passive: false });

  // Por seguridad, si el usuario se va de la card y ya está en el último slide,
  // asegurarse de no dejar el body bloqueado
  factsCard.addEventListener("mouseleave", () => {
    if (index >= factsSlides.length - 1) {
      unlockPageScroll();
    }
  });
}

  /* =========================
   *  7) ROAD SVG SCROLL ANIMATION
   * ========================= */
  const roadWrapper = document.querySelector(".road-wrapper");
  const yellowLine = document.getElementById("yellow-line");

  if (roadWrapper && yellowLine) {
    const dashSize = 40;
    const gapSize = 40;

    yellowLine.style.strokeDasharray = `${dashSize} ${gapSize}`;

    let lastScrollY = window.scrollY;
    let targetSpeed = 0;
    let currentSpeed = 0;
    let offset = 0;
    let lastTime = null;

    function onScroll() {
      const deltaY = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      targetSpeed = deltaY ? -Math.sign(deltaY) * 0.3 * Math.min(Math.abs(deltaY), 60) : 0;
    }

    function animate(time) {
      if (!lastTime) lastTime = time;
      const dt = (time - lastTime) / 16.67;
      lastTime = time;

      currentSpeed += (targetSpeed - currentSpeed) * 0.15 * dt;
      offset += currentSpeed * dt;

      const max = dashSize + gapSize;
      offset = ((offset % max) + max) % max;

      yellowLine.style.strokeDashoffset = offset;
      requestAnimationFrame(animate);
    }

    document.addEventListener("scroll", onScroll, { passive: true });
    requestAnimationFrame(animate);
  }

  /* =========================
   *  8) VEHICLE ANIMATIONS
   * ========================= */
//   function setupScrollAnimation(el, animation, duration, delay = 0, minInterval = 8000) {
//     if (!el) return;

//     let lastStart = 0;
//     let isAnimating = false;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (!entry.isIntersecting) return;

//         const now = performance.now();
//         if (isAnimating || now - lastStart < minInterval) return;

//         isAnimating = true;
//         lastStart = now;

//         setTimeout(() => {
//           el.style.animation = "none";
//           void el.offsetWidth;
//           el.style.animation = `${animation} ${duration}ms linear forwards`;

//           setTimeout(() => (isAnimating = false), duration);
//         }, delay);
//       },
//       { threshold: 0.3 }
//     );

//     observer.observe(el);
//   }

//   setupScrollAnimation(document.querySelector(".bike"), "bike-ride", 4000, 2000, 12000);
//   setupScrollAnimation(document.querySelector(".bus"), "bus-ride", 5000, 2000, 15000);

/* =========================
 *  8) VEHICLE ANIMATIONS
 * ========================= */
function setupLoopAnimation(el, animation, durationMs, intervalMs, initialDelayMs = 0) {
  if (!el) return;

  let isAnimating = false;

  function runOnce() {
    if (isAnimating) return;
    isAnimating = true;

    // Reiniciar animación CSS
    el.style.animation = "none";
    void el.offsetWidth; // forzar reflow
    el.style.animation = `${animation} ${durationMs}ms linear forwards`;

    // Al terminar la animación, liberar flag
    setTimeout(() => {
      isAnimating = false;
    }, durationMs);
  }

  // Primera pasada (con delay opcional)
  setTimeout(runOnce, initialDelayMs);

  // Pasadas siguientes en bucle
  setInterval(runOnce, intervalMs);
}

// Bici: anima 4s, pasa cada 5s (ajusta a gusto)
setupLoopAnimation(
  document.querySelector(".bike"),
  "bike-ride",
  4000,   // duración animación
  5000,   // intervalo entre inicios
  1000    // delay inicial opcional
);

// Bus: anima 5s, pasa cada 7s, por ejemplo
setupLoopAnimation(
  document.querySelector(".bus"),
  "bus-ride",
  5000,
  7000,
  2000
);
});


