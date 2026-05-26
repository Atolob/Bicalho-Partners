// Scripts principais - Bicalho & Partners

document.getElementById('year').textContent=new Date().getFullYear();
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('show')}),{threshold:.12});
    document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=(i%4)*55+'ms';io.observe(el)});
