// Evento simples no CTA do hero
(function(){
  const cta = document.getElementById('cta-hero');
  if (cta){
    cta.addEventListener('click', function(){
      // Substitua por integração de pixel/analytics se quiser
      console.log('cta_click_hero');
      // Redirecionar para checkout (exemplo):
      // window.location.href = '#checkout';
    });
  }
})();

// Animação de entrada com IntersectionObserver
(function(){
  if (!('IntersectionObserver' in window)) return;
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting){
        e.target.style.animationPlayState='running';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el=>{
    // Pausa a animação até entrar em viewport
    el.style.animationPlayState='paused';
    io.observe(el);
  });
})();



/* ===========================
   Before/After – Comparador Arrastável
   Suporta múltiplas instâncias .ba na página
   =========================== */
/* Before/After com CSS variable + clip-path */
(function(){
  const wraps = document.querySelectorAll('.ba');
  if (!wraps.length) return;

  wraps.forEach((wrap)=>{
    // inicia a posição pela data-start (0–100)
    let start = parseFloat(wrap.getAttribute('data-start'));
    if (isNaN(start)) start = 50;
    setPos(start);

    const knob = wrap.querySelector('.ba__knob');

    function rect(){ return wrap.getBoundingClientRect(); }
    function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

    function setPos(percent){
      const p = clamp(percent, 0, 100);
      wrap.style.setProperty('--pos', p + '%');
    }

    function move(clientX){
      const r = rect();
      const p = ((clientX - r.left) / r.width) * 100;
      setPos(p);
    }

    let dragging = false;

    const startDrag = (e) => {
      dragging = true;
      wrap.classList.add('is-dragging');
      const x = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
      move(x);
    };

    const onDrag = (e) => {
      if (!dragging) return;
      const x = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
      move(x);
    };

    const endDrag = () => {
      dragging = false;
      wrap.classList.remove('is-dragging');
    };

    // Eventos mouse/touch
    ['mousedown','touchstart'].forEach(ev=>{
      wrap.addEventListener(ev, startDrag, { passive:true });
      knob.addEventListener(ev, startDrag, { passive:true });
    });
    ['mousemove','touchmove'].forEach(ev=>{
      window.addEventListener(ev, onDrag, { passive:true });
    });
    ['mouseup','mouseleave','touchend','touchcancel'].forEach(ev=>{
      window.addEventListener(ev, endDrag, { passive:true });
    });

    // Acessibilidade: clique/teclado posiciona a linha
    wrap.addEventListener('click', (e)=>{
      // evita quando clicar no knob disparar 2x
      if (e.target === knob) return;
      move(e.clientX);
    });
    wrap.addEventListener('keydown', (e)=>{
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight'){
        const current = parseFloat(getComputedStyle(wrap).getPropertyValue('--pos')) || 50;
        setPos(current + (e.key === 'ArrowRight' ? 2 : -2));
      }
    });
    knob.setAttribute('tabindex','0');
  });
})();


// FAQ accordion
document.querySelectorAll('.faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');

    // Fecha todos
    document.querySelectorAll('.faq__item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
    });

    // Abre o clicado se estava fechado
    if(!isOpen){
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});


