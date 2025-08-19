(function () {
  /* ============================
   *  ANIMAÇÕES DE ENTRADA
   * ============================ */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  });
  document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));

  /* ============================
   *  DATA "HOJE" (ES)
   * ============================ */
  const meses = [
    "enero","febrero","marzo","abril","mayo","junio",
    "julio","agosto","septiembre","octubre","noviembre","diciembre",
  ];
  const fechaActual = new Date();
  const dia = fechaActual.getDate();
  const mes = meses[fechaActual.getMonth()];
  const fechaFormateada = `${dia} de ${mes}`;
  const dataAutoEl = document.getElementById("data-automatica");
  if (dataAutoEl) dataAutoEl.textContent = fechaFormateada;

  /* ============================
   *  CONTADOR ATÉ MEIA-NOITE
   * ============================ */
  document.addEventListener("DOMContentLoaded", function () {
    const elementoContador = document.getElementById("contador-cupom");
    if (!elementoContador) return;

    const intervalo = setInterval(function () {
      const agora = new Date();
      const meiaNoite = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 1);
      const tempoRestante = meiaNoite - agora;

      if (tempoRestante <= 0) {
        clearInterval(intervalo);
        elementoContador.textContent = "Expirado!";
        return;
      }

      const horas = Math.floor(tempoRestante / (1000 * 60 * 60));
      const minutos = Math.floor((tempoRestante % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((tempoRestante % (1000 * 60)) / 1000);

      const horasFormatadas = horas.toString().padStart(2, "0");
      const minutosFormatados = minutos.toString().padStart(2, "0");
      const segundosFormatados = segundos.toString().padStart(2, "0");

      elementoContador.textContent = `${horasFormatadas}:${minutosFormatados}:${segundosFormatados}`;
    }, 1000);
  });

  /* ============================
   *  FAQ
   * ============================ */
  document.querySelectorAll(".faq__question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement;
    const answer = item.querySelector(".faq__answer");
    const isOpen = item.classList.contains("open");

    // fecha todos e zera altura
    document.querySelectorAll(".faq__item").forEach((i) => {
      i.classList.remove("open");
      i.querySelector(".faq__question").setAttribute("aria-expanded", "false");
      const a = i.querySelector(".faq__answer");
      if (a) a.style.maxHeight = 0;
    });

    if (!isOpen) {
      item.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
      // calcula a altura real do conteúdo
      requestAnimationFrame(() => {
        answer.style.maxHeight = answer.scrollHeight + "px";
      });
    }
  });
});

// re-calcula se a janela mudar (evita cortes)
window.addEventListener("resize", () => {
  document.querySelectorAll(".faq__item.open .faq__answer").forEach((ans) => {
    ans.style.maxHeight = ans.scrollHeight + "px";
  });
});

  /* ============================
   *  COMPARADOR .ba (se existir)
   * ============================ */
  (function initBA(){
    const wraps = document.querySelectorAll(".ba");
    if (!wraps.length) return; // <- só encerra este bloco, não o arquivo inteiro

    // Armazena o último timeout de cada label
    const labelTimers = new WeakMap();

    function updateLabel(wrap) {
      const label = wrap.querySelector(".ba__label-dynamic");
      if (!label) return;

      // Lê --pos via inline ou computed
      let pos = wrap.style.getPropertyValue("--pos");
      if (!pos) pos = getComputedStyle(wrap).getPropertyValue("--pos");
      const percent = parseFloat(pos) || 0;

      if (percent > 5 && percent < 95) {
        label.textContent = "";
        label.style.opacity = "0";
        clearTimeout(labelTimers.get(label));
        return;
      }

      const newText = percent <= 5 ? "DESPUÉS" : "Antes";
      if (label.textContent === newText) return;

      clearTimeout(labelTimers.get(label));
      const timeout = setTimeout(() => {
        label.textContent = newText;
        label.style.opacity = "1";
      }, 100);
      labelTimers.set(label, timeout);
    }

    // Atualiza todas as .ba a cada 100ms
    setInterval(() => {
      document.querySelectorAll(".ba").forEach(updateLabel);
    }, 100);

    // Drag / teclado
    wraps.forEach((wrap) => {
      let start = parseFloat(wrap.getAttribute("data-start"));
      if (isNaN(start)) start = 50;

      const knob = wrap.querySelector(".ba__knob");

      function rect() { return wrap.getBoundingClientRect(); }
      function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
      function setPos(percent) {
        const p = clamp(percent, 0, 100);
        wrap.style.setProperty("--pos", p + "%");
      }
      function move(clientX) {
        const r = rect();
        const p = ((clientX - r.left) / r.width) * 100;
        setPos(p);
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

      if (knob) {
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
            const delta = e.key === "ArrowRight" ? 2 : -2;
            setPos(current + delta);
            e.preventDefault();
          }
        });
      }

      // Posição inicial
      setPos(start);
      updateLabel(wrap);
    });
  })();

  /* ==========================================
   *  COMPARADOR .xics (auto + tarja dinâmica)
   *  - Preload das imagens (data-src -> background-image)
   *  - Tarja "Antes/Después" sincronizada com a LINHA
   *    (mede a posição real da .xics__line no container)
   * ========================================== */
  (function initXICS(){
    const blocks = document.querySelectorAll(".xics");
    if (!blocks.length) return;

    // 1) Preload (idempotente)
    blocks.forEach(block => {
      block.querySelectorAll(".xics__img").forEach(el => {
        const src = el.getAttribute("data-src");
        if (!src) return;
        // evita recarregar se já setado
        if (el.style.backgroundImage && el.style.backgroundImage.includes(src)) return;

        const pre = new Image();
        pre.decoding = "async";
        pre.fetchPriority = "high";
        pre.onload = () => { el.style.backgroundImage = `url("${src}")`; };
        pre.onerror = () => { el.style.backgroundImage = `url("${src}")`; };
        pre.src = src;
      });
    });

    // 2) Tarja dinâmica (lê a posição da linha)
    const THRESHOLD = 0.05; // 5% em cada extremo
    function updateTagFor(block){
      const tag  = block.querySelector(".xics__tag");
      const line = block.querySelector(".xics__line");
      if (!tag || !line) return;

      const rc = block.getBoundingClientRect();
      const rl = line.getBoundingClientRect();
      // posição da linha no container (0..1)
      const mid = rl.left + rl.width/2;
      const progress = (mid - rc.left) / rc.width;
      const p = Math.max(0, Math.min(1, progress));

      if (p <= THRESHOLD) {
        if (tag.textContent !== "Antes") tag.textContent = "Antes";
        tag.style.opacity = "1";
      } else if (p >= 1 - THRESHOLD) {
        if (tag.textContent !== "Después") tag.textContent = "Después";
        tag.style.opacity = "1";
      } else {
        // no meio, some (opcional)
        if (tag.textContent !== "") tag.textContent = "";
        tag.style.opacity = "0";
      }
    }

    function loop(){
      blocks.forEach(updateTagFor);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  })();

  /* ============ LISTA DE BUNDLES (render no FAQ) ============ */
document.addEventListener("DOMContentLoaded", () => {
  const data = [
    { n: "Wedding Day", c: 14 },
    { n: "Beach Day", c: 10 },
    { n: "Dark Moody", c: 14 },
    { n: "Skin Retouch", c: 24 },
    { n: "Golden Sunset", c: 10 },
    { n: "Black & White", c: 12 },
    { n: "Food Retouch", c: 22 },
    { n: "Vintage", c: 18 },
    { n: "Autumn Tones", c: 14 },
    { n: "Cinematic Moody", c: 20 },
    { n: "Cars", c: 20 },
    { n: "Summer", c: 14 },
    { n: "Bright & Cream", c: 10 },
    { n: "Minimal White", c: 12 },
    { n: "Moody Wedding", c: 12 }
  ];

  const ul = document.getElementById("bundles-list");
  if (!ul) return;

  ul.innerHTML = "";
  data.forEach(({ n, c }) => {
    const li = document.createElement("li");
    li.className = "bundle";
    li.innerHTML = `<span class="bundle__name">${n}</span>
                    <span class="bundle__count">${c} presets</span>`;
    ul.appendChild(li);
  });
});

const PX_PER_SEC = 50; // ajuste fino da “velocidade” (px por segundo)

  function setMarqueeDurations() {
    document.querySelectorAll('.marquee__row .marquee__track').forEach(track => {
      // distância por ciclo = 50% da trilha
      const distancePx = track.scrollWidth * 0.5;
      const durSec = distancePx / PX_PER_SEC;
      track.style.setProperty('--dur', `${durSec}s`);
    });
  }

  function imagesReady(container) {
    const imgs = container.querySelectorAll('img');
    let pending = imgs.length;
    if (!pending) return Promise.resolve();
    return new Promise(resolve => {
      imgs.forEach(img => {
        if (img.complete) {
          if (--pending === 0) resolve();
        } else {
          img.addEventListener('load', () => { if (--pending === 0) resolve(); });
          img.addEventListener('error', () => { if (--pending === 0) resolve(); });
        }
      });
    });
  }

  function initMarqueeSync() {
    const root = document;
    imagesReady(root).then(() => {
      setMarqueeDurations();
    });

    // recalcula ao redimensionar
    window.addEventListener('resize', () => {
      setMarqueeDurations();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMarqueeSync);
  } else {
    initMarqueeSync();
  }



})();
