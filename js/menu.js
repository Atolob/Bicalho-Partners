/* ===== MENU — Bicalho & Partners ===== */

// DOM Elements
const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".menu");
const megaWrap = document.querySelector(".mega-wrap");
const megaBtn = megaWrap.querySelector("button");
const header = document.querySelector("header");

// ===== HAMBURGER TOGGLE =====
hamburger.addEventListener("click", function (e) {
  e.stopPropagation();
  menu.classList.toggle("open");
  hamburger.classList.toggle("open");
  const isOpen = menu.classList.contains("open");
  hamburger.setAttribute("aria-expanded", isOpen);
  
  // Previne scroll quando menu abrir
  if (isOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});

// ===== CLOSE MENU ON LINK CLICK =====
menu.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    menu.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", false);
    megaWrap.classList.remove("open");
    document.body.style.overflow = "";
  });
});

// ===== MEGA MENU DROPDOWN (Mobile) =====
megaBtn.addEventListener("click", function (e) {
  if (window.innerWidth <= 900) {
    e.stopPropagation();
    megaWrap.classList.toggle("open");
  }
});

// Fechar dropdown ao clicar em um link dentro dele
const megaLinks = megaWrap.querySelectorAll("a");
megaLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    megaWrap.classList.remove("open");
  });
});

// ===== HEADER SCROLL EFFECT =====
let lastScrollY = 0;
const headerScrollThreshold = 5;

window.addEventListener("scroll", function () {
  lastScrollY = window.scrollY;
  
  if (lastScrollY > headerScrollThreshold) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}, { passive: true });

// ===== CLOSE MENU ON OUTSIDE CLICK =====
document.addEventListener("click", function (e) {
  if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
    menu.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", false);
    document.body.style.overflow = "";
  }
});

// ===== CLOSE ON ESCAPE KEY =====
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    menu.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", false);
    megaWrap.classList.remove("open");
    document.body.style.overflow = "";
  }
});
