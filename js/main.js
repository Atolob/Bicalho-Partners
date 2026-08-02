// Scripts principais - Bicalho & Partners

// Atualiza ano no footer
document.querySelectorAll('#year').forEach(function(el) {
  el.textContent = new Date().getFullYear();
});
