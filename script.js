/* Ursus — interactions */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- theme (day / night den) ---------- */
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem("ursus-theme"); } catch (e) {}
  var initial = saved || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  root.setAttribute("data-theme", initial);

  document.getElementById("themeToggle").addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("ursus-theme", next); } catch (e) {}
  });

  /* ---------- nav: scrolled state, burger, scroll progress ---------- */
  var nav = document.getElementById("nav");
  var scrollBar = document.getElementById("scrollBar");
  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 12);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    scrollBar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var burger = document.getElementById("navBurger");
  var navLinks = document.getElementById("navLinks");
  burger.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  navLinks.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- animated counters ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var comma = el.getAttribute("data-format") === "comma";
    var dur = 1800, start = null;
    function fmt(v) {
      var s = v.toFixed(decimals);
      return comma ? Number(s).toLocaleString("en-US") : s;
    }
    if (prefersReduced) { el.textContent = fmt(target) + suffix; return; }
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var statNums = document.querySelectorAll(".stat-num");
  if ("IntersectionObserver" in window) {
    var ioStats = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); ioStats.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    statNums.forEach(function (el) { ioStats.observe(el); });
  } else {
    statNums.forEach(animateCount);
  }

  /* ---------- honey meter fill when visible ---------- */
  var honeyFill = document.querySelector(".honey-meter-fill");
  if (honeyFill && "IntersectionObserver" in window) {
    var ioHoney = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { honeyFill.style.width = "34%"; ioHoney.disconnect(); }
      });
    }, { threshold: 0.4 });
    ioHoney.observe(honeyFill);
  } else if (honeyFill) { honeyFill.style.width = "34%"; }

  /* ---------- marquee: duplicate track for seamless loop ---------- */
  var track = document.getElementById("marqueeTrack");
  track.innerHTML += track.innerHTML;

  /* ---------- overnight-run terminal demo ---------- */
  var termBody = document.getElementById("termBody");
  var scenarios = [
    [
      { cls: "t-cmd", text: '$ ursus run "ship the onboarding flow"' },
      { cls: "t-dim", text: "▸ planning... 6 tasks found" },
      { cls: "t-ok",  text: "✓ wrote migration 0042_add_waitlist.sql" },
      { cls: "t-ok",  text: "✓ updated 14 files, 212 tests passing" },
      { cls: "t-ok",  text: "✓ opened PR #381 — \"Onboarding v2\"" },
      { cls: "t-cost", text: "done while you slept · 3h 12m · $0.41" }
    ],
    [
      { cls: "t-cmd", text: '$ ursus run "fix flaky checkout tests"' },
      { cls: "t-dim", text: "▸ reproducing failure... found race in cart lock" },
      { cls: "t-ok",  text: "✓ patched retry logic in 2 files" },
      { cls: "t-ok",  text: "✓ ran suite 50x — 0 flakes" },
      { cls: "t-ok",  text: "✓ opened PR #382 with root-cause writeup" },
      { cls: "t-cost", text: "done while you slept · 41m · $0.09" }
    ],
    [
      { cls: "t-cmd", text: '$ ursus run "cut inference cost on search"' },
      { cls: "t-dim", text: "▸ profiling 30 days of traffic..." },
      { cls: "t-ok",  text: "✓ routed 71% of queries to a smaller model" },
      { cls: "t-ok",  text: "✓ evals hold: quality delta -0.2%" },
      { cls: "t-ok",  text: "✓ opened PR #383 — expected -38% spend" },
      { cls: "t-cost", text: "done while you slept · 1h 58m · $0.23" }
    ]
  ];

  function typeScenario(lines, done) {
    termBody.innerHTML = "";
    var li = 0;
    function typeLine() {
      if (li >= lines.length) { done(); return; }
      var line = lines[li];
      var span = document.createElement("span");
      span.className = line.cls;
      termBody.appendChild(span);
      var ci = 0;
      (function typeChar() {
        if (ci < line.text.length) {
          span.textContent += line.text[ci++];
          setTimeout(typeChar, prefersReduced ? 0 : 14 + Math.random() * 22);
        } else {
          termBody.appendChild(document.createTextNode("\n"));
          li++;
          setTimeout(typeLine, prefersReduced ? 0 : 160);
        }
      })();
    }
    typeLine();
  }

  function runDemo() {
    var cursor = document.createElement("span");
    cursor.className = "cursor";
    var idx = 0;
    function next() {
      termBody.appendChild(cursor);
      typeScenario(scenarios[idx % scenarios.length], function () {
        setTimeout(function () {
          if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
          idx++;
          setTimeout(next, 2600);
        }, prefersReduced ? 200 : 1400);
      });
    }
    if ("IntersectionObserver" in window) {
      var started = false;
      var ioTerm = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && !started) { started = true; next(); ioTerm.disconnect(); }
        });
      }, { threshold: 0.3 });
      ioTerm.observe(termBody);
    } else { next(); }
  }
  runDemo();

  /* ---------- pricing toggle ---------- */
  var btOpts = document.querySelectorAll(".bt-opt");
  btOpts.forEach(function (btn) {
    btn.addEventListener("click", function () {
      btOpts.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var period = btn.getAttribute("data-period");
      document.querySelectorAll(".price[data-monthly]").forEach(function (p) {
        p.style.opacity = "0";
        setTimeout(function () {
          p.textContent = p.getAttribute("data-" + period);
          p.style.opacity = "1";
        }, 160);
      });
    });
  });

  /* ---------- FAQ: close others when one opens ---------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) faqItems.forEach(function (other) { if (other !== item) other.open = false; });
    });
  });

  /* ---------- CTA form ---------- */
  var form = document.getElementById("ctaForm");
  var msg = document.getElementById("ctaMsg");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("ctaEmail").value.trim();
    if (!email) return;
    msg.textContent = "Welcome to the den, " + email + " — check your inbox for the key.";
    form.reset();
  });

  /* ---------- card tilt ---------- */
  if (finePointer && !prefersReduced) {
    document.querySelectorAll(".tilt").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.classList.add("tilting");
        card.style.transform = "perspective(900px) rotateX(" + (-py * 6).toFixed(2) + "deg) rotateY(" + (px * 6).toFixed(2) + "deg) translateY(-3px)";
      });
      card.addEventListener("pointerleave", function () {
        card.classList.remove("tilting");
        card.style.transform = "";
      });
    });
  }

  /* ---------- magnetic buttons ---------- */
  if (finePointer && !prefersReduced) {
    document.querySelectorAll(".magnetic").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = "translate(" + dx * 0.22 + "px," + dy * 0.22 + "px)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- fireflies canvas (hero) ---------- */
  var canvas = document.getElementById("fireflies");
  var ctx = canvas.getContext("2d");
  var flies = [];
  var running = false;
  var DPR = Math.min(window.devicePixelRatio || 1, 2);

  function sizeCanvas() {
    var hero = canvas.parentElement;
    canvas.width = hero.clientWidth * DPR;
    canvas.height = hero.clientHeight * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  function seed() {
    var hero = canvas.parentElement;
    var n = Math.min(46, Math.floor(hero.clientWidth / 26));
    flies = [];
    for (var i = 0; i < n; i++) {
      flies.push({
        x: Math.random() * hero.clientWidth,
        y: Math.random() * hero.clientHeight,
        r: 1 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.2,
        ph: Math.random() * Math.PI * 2,
        sp: 0.4 + Math.random() * 0.8
      });
    }
  }
  function draw(t) {
    if (!running) return;
    var hero = canvas.parentElement;
    ctx.clearRect(0, 0, hero.clientWidth, hero.clientHeight);
    for (var i = 0; i < flies.length; i++) {
      var f = flies[i];
      f.ph += 0.02 * f.sp;
      f.x += f.vx + Math.sin(f.ph) * 0.3;
      f.y += f.vy + Math.cos(f.ph * 0.7) * 0.22;
      if (f.x < -10) f.x = hero.clientWidth + 10; if (f.x > hero.clientWidth + 10) f.x = -10;
      if (f.y < -10) f.y = hero.clientHeight + 10; if (f.y > hero.clientHeight + 10) f.y = -10;
      var glow = 0.45 + Math.sin(f.ph * 2.2) * 0.4;
      var g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 5);
      g.addColorStop(0, "rgba(255, 205, 96, " + (0.85 * glow).toFixed(3) + ")");
      g.addColorStop(0.4, "rgba(246, 183, 60, " + (0.28 * glow).toFixed(3) + ")");
      g.addColorStop(1, "rgba(246, 183, 60, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r * 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 224, 150, " + (0.9 * glow).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r * 0.55, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  function startFlies() { if (!running && !prefersReduced) { running = true; requestAnimationFrame(draw); } }
  function stopFlies() { running = false; }

  if (!prefersReduced) {
    sizeCanvas(); seed();
    window.addEventListener("resize", function () { sizeCanvas(); seed(); });
    if ("IntersectionObserver" in window) {
      var ioFlies = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { en.isIntersecting ? startFlies() : stopFlies(); });
      }, { threshold: 0.02 });
      ioFlies.observe(canvas.parentElement);
    } else { startFlies(); }
  }

  /* ---------- paw print on click ---------- */
  var PAW = '<svg viewBox="0 0 64 64" width="100%" height="100%"><g fill="currentColor"><ellipse cx="32" cy="42" rx="14" ry="11"/><ellipse cx="14" cy="26" rx="6.5" ry="8.5" transform="rotate(-20 14 26)"/><ellipse cx="26" cy="17" rx="6.5" ry="9" transform="rotate(-8 26 17)"/><ellipse cx="38" cy="17" rx="6.5" ry="9" transform="rotate(8 38 17)"/><ellipse cx="50" cy="26" rx="6.5" ry="8.5" transform="rotate(20 50 26)"/></g></svg>';
  document.addEventListener("pointerdown", function (e) {
    if (prefersReduced) return;
    var s = document.createElement("span");
    s.className = "paw-stamp";
    s.innerHTML = PAW;
    s.style.left = e.clientX + "px";
    s.style.top = e.clientY + "px";
    s.style.rotate = (Math.random() * 70 - 35).toFixed(1) + "deg";
    document.body.appendChild(s);
    setTimeout(function () { s.remove(); }, 950);
  });
})();
