// Evento simples no CTA do hero
(function () {
  const wraps = document.querySelectorAll(".ba");
  if (!wraps.length) return;

  // Armazena o último timeout de cada label
  const labelTimers = new WeakMap();

  function updateLabel(wrap) {
    const label = wrap.querySelector('.ba__label-dynamic');
    if (!label) return;

    // Lê --pos via inline ou computed
    let pos = wrap.style.getPropertyValue('--pos');
    if (!pos) {
      pos = getComputedStyle(wrap).getPropertyValue('--pos');
    }

    const percent = parseFloat(pos) || 0;

    // Se estiver no meio, esconde imediatamente e limpa timeout pendente
    if (percent > 5 && percent < 95) {
      label.textContent = '';
      label.style.opacity = '0';
      clearTimeout(labelTimers.get(label));
      return;
    }

    // Verifica o novo valor esperado
    const newText = percent <= 5 ? 'Depois' : 'Antes';

    // Se já estiver com esse texto, não precisa trocar
    if (label.textContent === newText) return;

    // Limpa timeout anterior (se houver)
    clearTimeout(labelTimers.get(label));

    // Cria novo atraso para trocar o texto
    const timeout = setTimeout(() => {
      label.textContent = newText;
      label.style.opacity = '1';
    }, 100); // ⏱ atraso de 300ms (ajustável)

    labelTimers.set(label, timeout);
  }

  // Comparador por arraste
  wraps.forEach((wrap) => {
    let start = parseFloat(wrap.getAttribute("data-start"));
    if (isNaN(start)) start = 50;

    const knob = wrap.querySelector(".ba__knob");

    function rect() {
      return wrap.getBoundingClientRect();
    }
    function clamp(n, min, max) {
      return Math.max(min, Math.min(max, n));
    }
    function setPos(percent) {
      const p = clamp(percent, 0, 100);
      wrap.style.setProperty("--pos", p + "%");
    }
    function move(clientX) {
      const r = rect();
      const p = ((clientX - r.left) / r.width) * 100;
      setPos(p);
      updateLabel(wrap); // Atualiza o rótulo ao mover
    }

    let dragging = false;

    const startDrag = (e) => {
      dragging = true;
      wrap.classList.add("is-dragging");
      const x = e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX;
      move(x);
      if (e.cancelable) e.preventDefault();
    };

    const onDrag = (e) => {
      if (!dragging) return;
      const x = e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX;
      move(x);
      if (e.cancelable) e.preventDefault();
    };

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      wrap.classList.remove("is-dragging");
    };

    knob.addEventListener("mousedown", startDrag);
    knob.addEventListener("touchstart", startDrag, { passive: false });

    window.addEventListener("mousemove", onDrag, { passive: true });
    window.addEventListener("touchmove", onDrag, { passive: false });
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchend", endDrag);
    window.addEventListener("touchcancel", endDrag);

    knob.setAttribute("tabindex", "0");
    knob.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const current =
          parseFloat(getComputedStyle(wrap).getPropertyValue("--pos")) || 50;
        setPos(current + (e.key === "ArrowRight" ? 2 : -2));
        e.preventDefault();
      }
    });

    // Posição inicial e texto inicial
    setPos(start);
    updateLabel(wrap);
  });
})();




// FAQ accordion
document.querySelectorAll(".faq__question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains("open");

    // Fecha todos
    document.querySelectorAll(".faq__item").forEach((i) => {
      i.classList.remove("open");
      i.querySelector(".faq__question").setAttribute("aria-expanded", "false");
    });

    // Abre o clicado se estava fechado
    if (!isOpen) {
      item.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    }
  });
});

// Animação de entrada com IntersectionObserver
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target); // Garante que a animação ocorra apenas uma vez
    }
  });
});

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
