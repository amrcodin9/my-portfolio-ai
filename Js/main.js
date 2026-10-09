// Portfolio v2 — Amr Abdo
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Footer year
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // ---- Typing effect ----
  var typedEl = document.getElementById("typed");
  var roles = ["Web Developer", "Frontend Developer", "Problem Solver", "Lifelong Learner"];
  if (typedEl) {
    if (reduceMotion) {
      typedEl.textContent = roles[0];
    } else {
      var r = 0, c = 0, deleting = false;
      (function tick() {
        var word = roles[r];
        typedEl.textContent = word.slice(0, c);
        var delay = deleting ? 45 : 95;
        if (!deleting && c === word.length) { deleting = true; delay = 1600; }
        else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 350; }
        c += deleting ? -1 : 1;
        setTimeout(tick, delay);
      })();
    }
  }

  // ---- Reveal on scroll + skill bars ----
  function animateSkill(el) {
    var bar = el.querySelector(".bar span");
    var num = el.querySelector("[data-count]");
    if (bar) bar.style.width = bar.getAttribute("data-level") + "%";
    if (num) {
      var target = +num.getAttribute("data-count");
      if (reduceMotion) { num.textContent = target + "%"; return; }
      var start = null;
      (function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / 1400, 1);
        num.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + "%";
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    }
  }

  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        if (e.target.classList.contains("skill")) animateSkill(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); if (el.classList.contains("skill")) animateSkill(el); });
  }

  // ---- Active nav link ----
  var links = document.querySelectorAll(".nav-link");
  var sections = document.querySelectorAll("[data-section]");
  function setActive(id) {
    links.forEach(function (l) { l.classList.toggle("active", l.getAttribute("data-link") === id); });
  }
  if ("IntersectionObserver" in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) setActive(e.target.getAttribute("data-section")); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { navIO.observe(s); });
  }
  setActive("home");

  // ---- Progress bar + back to top ----
  var progress = document.getElementById("progress");
  var toTop = document.getElementById("toTop");
  var ticking = false;
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    if (progress) progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    if (toTop) toTop.classList.toggle("show", h.scrollTop > 600);
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  if (toTop) toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });
})();
