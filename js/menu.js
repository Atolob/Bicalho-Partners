const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".menu");

// Hambúrguer — abre e fecha o menu
hamburger.addEventListener("click", function () {
  menu.classList.toggle("open");
  hamburger.classList.toggle("open");
  const estaAberto = menu.classList.contains("open");
  hamburger.setAttribute("aria-expanded", estaAberto);
});

// Fecha o menu ao clicar em links normais
menu.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    menu.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", false);
  });
});

// Dropdown de Serviços no mobile
const megaWrap = document.querySelector(".mega-wrap");
const megaBtn = megaWrap.querySelector("button");

megaBtn.addEventListener("click", function (e) {
  // Impede o clique de fechar o menu
  e.stopPropagation();

  // Abre ou fecha o dropdown
  megaWrap.classList.toggle("open");
});
