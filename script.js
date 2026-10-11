(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- photo fallback if photo.jpg is missing ---------- */
  var img = document.getElementById("photoImg");
  var inner = document.getElementById("photoInner");
  img.addEventListener("error", function () { inner.classList.add("no-photo"); });

  /* ---------- scroll progress bar ---------- */
  var bar = document.getElementById("progress");
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var menuBtn = document.getElementById("menuBtn");
  var nav = document.getElementById("nav");
  menuBtn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- reveal on scroll (also triggers mark highlights) ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.18 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- active nav link ---------- */
  var links = document.querySelectorAll(".nav a");
  var sections = Array.prototype.map.call(links, function (a) {
    return document.querySelector(a.getAttribute("href"));
  });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { if (s) spy.observe(s); });
  }

  /* ---------- typing effect ---------- */
  var typed = document.getElementById("typed");
  var words = ["Data Scientist", "ML & AI Engineer", "Business Analyst"];
  if (reduce) {
    typed.textContent = words.join(" · ");
  } else {
    var w = 0, c = 0, deleting = false;
    (function tick() {
      var word = words[w];
      typed.textContent = word.slice(0, c);
      var delay = deleting ? 45 : 90;
      if (!deleting && c === word.length) { deleting = true; delay = 1600; }
      else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 350; }
      else { c += deleting ? -1 : 1; }
      setTimeout(tick, delay);
    })();
  }

  /* ---------- hero: interactive data-network canvas ---------- */
  var canvas = document.getElementById("network");
  var ctx = canvas.getContext("2d");
  var nodes = [], W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  var mouse = { x: -9999, y: -9999 };
  var running = true;

  function resize() {
    var r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = Math.max(28, Math.min(80, Math.floor((W * H) / 20000)));
    nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8, t: Math.random() < 0.5 ? 0 : 1
      });
    }
  }

  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    var maxD = 140;
    for (var i = 0; i < nodes.length; i++) {
      var a = nodes[i];
      if (!reduce) {
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;
        var mx = mouse.x - a.x, my = mouse.y - a.y, md = Math.sqrt(mx * mx + my * my);
        if (md < 160) { a.x += mx * 0.004; a.y += my * 0.004; }
      }
      for (var j = i + 1; j < nodes.length; j++) {
        var b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < maxD) {
          ctx.strokeStyle = "rgba(131,146,255," + (0.22 * (1 - d / maxD)).toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.fillStyle = a.t ? "rgba(79,216,196,0.85)" : "rgba(131,146,255,0.85)";
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  var hero = document.getElementById("home");
  hero.addEventListener("mousemove", function (e) {
    var r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  hero.addEventListener("mouseleave", function () { mouse.x = mouse.y = -9999; });

  // pause drawing when the hero is off-screen
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      var visible = entries[0].isIntersecting;
      if (visible && !running) { running = true; draw(); }
      running = visible;
    }).observe(hero);
  }
  draw();

  /* ---------- contact form: opens the visitor's email app ---------- */
  document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    var subject = "Portfolio message from " + f.name.value;
    var body = f.message.value + "\n\n— " + f.name.value + " (" + f.email.value + ")";
    window.location.href = "mailto:hewagesavindi@gmail.com?subject=" +
      encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });
})();
