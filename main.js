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
/* Before/After – arrasta SOMENTE pelo knob (botão redondo) */
(function () {
  const wraps = document.querySelectorAll('.ba');
  if (!wraps.length) return;

  wraps.forEach((wrap) => {
    // posição inicial (0–100)
    let start = parseFloat(wrap.getAttribute('data-start'));
    if (isNaN(start)) start = 50;
    setPos(start);

    const knob = wrap.querySelector('.ba__knob');

    function rect() { return wrap.getBoundingClientRect(); }
    function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
    function setPos(percent) {
      const p = clamp(percent, 0, 100);
      wrap.style.setProperty('--pos', p + '%');
    }
    function move(clientX) {
      const r = rect();
      const p = ((clientX - r.left) / r.width) * 100;
      setPos(p);
    }

    let dragging = false;

    // inicia arraste SÓ pelo knob
    const startDrag = (e) => {
      dragging = true;
      wrap.classList.add('is-dragging');
      const x = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
      move(x);
      // impede rolagem da página enquanto arrasta o knob
      if (e.cancelable) e.preventDefault();
    };

    const onDrag = (e) => {
      if (!dragging) return;
      const x = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
      move(x);
      if (e.cancelable) e.preventDefault();
    };

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      wrap.classList.remove('is-dragging');
    };

    // 🔒 Eventos SOMENTE no knob
    knob.addEventListener('mousedown', startDrag);
    knob.addEventListener('touchstart', startDrag, { passive: false });

    window.addEventListener('mousemove', onDrag, { passive: true });
    window.addEventListener('touchmove', onDrag, { passive: false });
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
    window.addEventListener('touchcancel', endDrag);

    // Acessibilidade: setas do teclado movem a linha quando o knob está focado
    knob.setAttribute('tabindex', '0');
    knob.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const current = parseFloat(getComputedStyle(wrap).getPropertyValue('--pos')) || 50;
        setPos(current + (e.key === 'ArrowRight' ? 2 : -2));
        e.preventDefault();
      }
    });

    // Importante: NÃO há click no container .ba → rolagem vertical funciona normalmente
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

// (function () {
//   const autos = document.querySelectorAll('.ba--auto');
//   autos.forEach((wrap) => {
//     let pos = 0;
//     let direction = 1;

//     setInterval(() => {
//       pos += direction * 1; // velocidade
//       if (pos >= 100 || pos <= 0) direction *= -1;

//       wrap.style.setProperty('--pos', `${pos}%`);
//     }, 20); // menor valor = mais suave
//   });
// })();


