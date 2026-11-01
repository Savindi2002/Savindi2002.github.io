(() => {
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const progress = document.getElementById("progress");
  const updateProgress = () => {
    const root = document.documentElement;
    const max = root.scrollHeight - root.clientHeight;
    if (progress) progress.style.width = `${max > 0 ? (root.scrollTop / max) * 100 : 0}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  const menuButton = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      menuButton.textContent = isOpen ? "✕" : "☰";
    });
    nav.addEventListener("click", event => {
      if (event.target.closest("a")) {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        menuButton.textContent = "☰";
      }
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add("in"));

  const navLinks = [...document.querySelectorAll(".nav a")];
  const observedSections = navLinks.map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle("active", link.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: "-38% 0px -55% 0px" });
    observedSections.forEach(section => sectionObserver.observe(section));
  }

  const typed = document.getElementById("typed");
  const roles = ["Machine Learning & AI", "Data Analytics", "Business Analysis", "NLP & Intelligent Systems"];
  if (typed) {
    if (reduceMotion) typed.textContent = roles.join(" · ");
    else {
      let roleIndex = 0, charIndex = 0, deleting = false;
      const type = () => {
        const word = roles[roleIndex];
        typed.textContent = word.slice(0, charIndex);
        let delay = deleting ? 35 : 65;
        if (!deleting && charIndex === word.length) { deleting = true; delay = 1500; }
        else if (deleting && charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 350; }
        else charIndex += deleting ? -1 : 1;
        window.setTimeout(type, delay);
      };
      type();
    }
  }

  const canvas = document.getElementById("network");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let width = 0, height = 0, nodes = [], frame = 0, visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width; height = rect.height;
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(24, Math.min(65, Math.floor(width * height / 21000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25
      }));
    };
    const draw = () => {
      if (!visible || reduceMotion) return;
      ctx.clearRect(0, 0, width, height);
      nodes.forEach((node, i) => {
        node.x += node.vx; node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j], dx = node.x - other.x, dy = node.y - other.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 135) {
            ctx.strokeStyle = `rgba(111,157,255,${.17 * (1 - distance / 135)})`;
            ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(node.x, node.y); ctx.lineTo(other.x, other.y); ctx.stroke();
          }
        }
        ctx.fillStyle = "rgba(85,214,194,.7)";
        ctx.beginPath(); ctx.arc(node.x, node.y, 1.7, 0, Math.PI * 2); ctx.fill();
      });
      frame = requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener("resize", resize);
    if ("IntersectionObserver" in window) {
      const heroObserver = new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (visible && !reduceMotion && !frame) draw();
        if (!visible && frame) { cancelAnimationFrame(frame); frame = 0; }
      });
      heroObserver.observe(document.getElementById("home"));
    }
    if (!reduceMotion) draw();
  }

  // Load the user's supplied gallery images even when their file extensions differ.
  const galleryExtensions = [".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG", ".WEBP"];
  document.querySelectorAll("img[data-image-base]").forEach(img => {
    const base = img.dataset.imageBase;
    let index = 0;
    const tryNext = () => {
      if (index >= galleryExtensions.length) {
        const figure = img.closest(".gallery-slot");
        if (figure) figure.remove();
        return;
      }
      img.src = base + galleryExtensions[index++];
    };
    img.addEventListener("error", tryNext);
    tryNext();
  });

  const form = document.getElementById("contactForm");
  if (form) form.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const subject = `Portfolio message from ${name}`;
    const body = `${message}\n\n— ${name} (${email})`;
    window.location.href = `mailto:hewagesavindi@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();

/* =====================================
   FINAL HOME SECTION ALIGNMENT
   ===================================== */

.hero.section {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 850px;
    padding: 125px 0 85px;
    overflow: hidden;
}

/* Keep the entire hero inside a centred container */
.hero-grid {
    position: relative;
    z-index: 2;

    width: min(1160px, calc(100% - 80px));
    max-width: 1160px;
    margin: 0 auto;

    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    align-items: center;
    gap: 55px;
}

/* Introduction */
.hero-copy {
    width: 100%;
    max-width: 610px;
    min-width: 0;
    margin: 0;
    text-align: left;
}

.hero-copy .eyebrow {
    margin-bottom: 18px;
}

.hero-copy .intro {
    margin-bottom: 3px;
    font-size: 1.15rem;
}

.hero-copy h1 {
    font-size: clamp(3.8rem, 5.5vw, 5.8rem);
    line-height: 1.08;
    letter-spacing: -0.065em;
    margin: 0 0 20px;
}

.hero-copy .role {
    min-height: 2.2em;
    line-height: 1.5;
    margin-bottom: 15px;
}

.hero-copy .summary {
    max-width: 570px;
    line-height: 1.9;
    margin: 0;
}

.hero-copy .actions {
    margin-top: 28px;
    margin-bottom: 22px;
}

/* Larger circular profile photo */
.portrait-wrap {
    position: relative;
    isolation: isolate;

    width: 100%;
    max-width: 480px;
    min-height: 470px;
    margin: 0 auto;
    padding: 25px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.portrait-frame {
    position: relative;
    z-index: 2;

    width: 370px;
    max-width: 100%;
    aspect-ratio: 1 / 1;
    height: auto;

    padding: 9px;
    margin: 0;
    border-radius: 50%;
    overflow: hidden;

    background: linear-gradient(
        135deg,
        #fff0a8,
        #e5ad20,
        #fff1ad,
        #9b6b08
    );

    box-shadow:
        0 25px 70px rgba(0,0,0,.5),
        0 0 0 9px rgba(244,197,66,.08),
        0 0 45px rgba(244,197,66,.2);

    transform: none;
}

.portrait-frame img,
.portrait-frame .portrait-fallback {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    object-position: center 22%;
}

.portrait-orbit {
    position: absolute;
    z-index: -1;

    width: 430px;
    max-width: 100%;
    aspect-ratio: 1 / 1;

    top: 46%;
    left: 50%;
    transform: translate(-50%, -50%);

    border: 1px solid rgba(255,217,90,.5);
    border-radius: 50%;

    box-shadow:
        0 0 0 16px rgba(244,197,66,.04),
        0 0 0 34px rgba(244,197,66,.025),
        0 0 55px rgba(244,197,66,.12);

    pointer-events: none;
}

.portrait-tag {
    position: relative;
    z-index: 3;
    margin-top: 23px;
    text-align: center;
}

/* Tablet */
@media (max-width: 1000px) {
    .hero-grid {
        width: calc(100% - 55px);
        grid-template-columns: minmax(0, 1fr) minmax(0, .85fr);
        gap: 25px;
    }

    .portrait-frame {
        width: min(320px, 34vw);
    }

    .portrait-wrap {
        min-height: 400px;
    }

    .portrait-orbit {
        width: min(380px, 95%);
    }
}

/* Mobile */
@media (max-width: 800px) {
    .hero.section {
        min-height: auto;
        padding: 105px 0 75px;
    }

    .hero-grid {
        width: calc(100% - 38px);
        grid-template-columns: minmax(0, 1fr);
        gap: 20px;
    }

    .portrait-wrap {
        order: 0;
        min-height: auto;
        padding: 15px 0 25px;
    }

    .portrait-frame {
        width: min(300px, 72vw);
    }

    .portrait-orbit {
        width: min(350px, 85vw);
    }

    .hero-copy {
        order: 1;
        max-width: 620px;
        margin: 0 auto;
        text-align: center;
    }

    .hero-copy .summary {
        margin-inline: auto;
    }

    .hero-copy .actions,
    .hero-copy .social-mini {
        justify-content: center;
    }
}

/* Small mobile */
@media (max-width: 480px) {
    .hero-grid {
        width: calc(100% - 32px);
    }

    .hero-copy h1 {
        font-size: 3.4rem;
    }

    .portrait-frame {
        width: min(260px, 72vw);
    }
}
