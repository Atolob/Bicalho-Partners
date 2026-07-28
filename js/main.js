// Scripts principais - Bicalho & Partners

document.getElementById('year').textContent=new Date().getFullYear();
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('show')}),{threshold:.12});
    document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=(i%4)*55+'ms';io.observe(el)});

// ===== JORNADA =====
const jnavDots = document.querySelectorAll(".jnav-dot");
const jstages = document.querySelectorAll(".jornada-stage");

if (jnavDots.length && jstages.length) {
  jnavDots.forEach(dot => {
    dot.addEventListener("click", () => {
      const target = document.querySelector("[data-jstage=\"" + dot.dataset.target + "\"]");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const jObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = entry.target.dataset.jstage;
        jnavDots.forEach(d => d.classList.remove("active"));
        const active = document.querySelector(".jnav-dot[data-target=\"" + idx + "\"]");
        if (active) active.classList.add("active");
      }
    });
  }, { threshold: 0.4 });

  jstages.forEach(s => jObs.observe(s));
}
// ===== FIM JORNADA =====

