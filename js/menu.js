const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".menu");

hamburger.addEventListener("click", function () {
  menu.classList.toggle("open");
  hamburger.classList.toggle("open");

  const estaAberto = menu.classList.contains("open");
  hamburger.setAttribute("aria-expanded", estaAberto);
});

menu.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    menu.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", false);
  });
});
