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
