(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target); // remove se não quiser repetir
      }
    });
  });

  document
    .querySelectorAll("[data-animate]")
    .forEach((el) => observer.observe(el));

  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  // Pega a data atual
  const fechaActual = new Date();
  const dia = fechaActual.getDate();
  const mes = meses[fechaActual.getMonth()]; // getMonth() retorna um número de 0 a 11

  // Formata o texto final da data, por exemplo: "9 de agosto"
  const fechaFormateada = `${dia} de ${mes}`;

  // Encontra o elemento pelo 'id' e insere a data formatada
  document.getElementById("data-automatica").textContent = fechaFormateada;

  // =======================================================
  // CÓDIGO DO CONTADOR REGRESSIVO PARA MEIA-NOITE
  // =======================================================
  document.addEventListener("DOMContentLoaded", function () {
    // 1. Encontra o elemento no HTML onde o contador será exibido.
    const elementoContador = document.getElementById("contador-cupom");

    // Se o elemento não existir na página, o script para aqui para não dar erro.
    if (!elementoContador) return;

    // 2. Inicia o intervalo que vai atualizar o relógio a cada segundo.
    const intervalo = setInterval(function () {
      // 3. Define o alvo: meia-noite do dia seguinte.
      const agora = new Date();
      const meiaNoite = new Date(
        agora.getFullYear(),
        agora.getMonth(),
        agora.getDate() + 1
      );

      // 4. Calcula a diferença de tempo entre agora e a meia-noite (em milissegundos).
      const tempoRestante = meiaNoite - agora;

      // 5. Verifica se o tempo já acabou.
      if (tempoRestante <= 0) {
        clearInterval(intervalo); // Para o relógio
        elementoContador.textContent = "Expirado!"; // Mostra a mensagem final
        return; // Sai da função
      }

      // 6. Converte a diferença de milissegundos para horas, minutos e segundos.
      const horas = Math.floor(tempoRestante / (1000 * 60 * 60));
      const minutos = Math.floor(
        (tempoRestante % (1000 * 60 * 60)) / (1000 * 60)
      );
      const segundos = Math.floor((tempoRestante % (1000 * 60)) / 1000);

      // 7. Formata os números para sempre terem dois dígitos (ex: 09, 08, 07...).
      const horasFormatadas = horas.toString().padStart(2, "0");
      const minutosFormatados = minutos.toString().padStart(2, "0");
      const segundosFormatados = segundos.toString().padStart(2, "0");

      // 8. Atualiza o HTML com o tempo formatado.
      elementoContador.textContent = `${horasFormatadas}:${minutosFormatados}:${segundosFormatados}`;
    }, 1000); // 1000 milissegundos = 1 segundo
  });

  document.querySelectorAll(".faq__question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains("open");

      // Fecha todos
      document.querySelectorAll(".faq__item").forEach((i) => {
        i.classList.remove("open");
        i.querySelector(".faq__question").setAttribute(
          "aria-expanded",
          "false"
        );
      });

      // Abre o clicado se estava fechado
      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  const wraps = document.querySelectorAll(".ba");
  if (!wraps.length) return;

  // Armazena o último timeout de cada label
  const labelTimers = new WeakMap();

  function updateLabel(wrap) {
    const label = wrap.querySelector(".ba__label-dynamic");
    if (!label) return;

    // Lê --pos via inline ou computed
    let pos = wrap.style.getPropertyValue("--pos");
    if (!pos) {
      pos = getComputedStyle(wrap).getPropertyValue("--pos");
    }

    const percent = parseFloat(pos) || 0;

    // Se estiver no meio, esconde imediatamente e limpa timeout pendente
    if (percent > 5 && percent < 95) {
      label.textContent = "";
      label.style.opacity = "0";
      clearTimeout(labelTimers.get(label));
      return;
    }

    // Verifica o novo valor esperado
    const newText = percent <= 5 ? "Depois" : "Antes";

    // Se já estiver com esse texto, não precisa trocar
    if (label.textContent === newText) return;

    // Limpa timeout anterior (se houver)
    clearTimeout(labelTimers.get(label));

    // Cria novo atraso para trocar o texto
    const timeout = setTimeout(() => {
      label.textContent = newText;
      label.style.opacity = "1";
    }, 100); // ⏱ atraso de 300ms (ajustável)

    labelTimers.set(label, timeout);
  }

  // Atualiza todas as .ba a cada 100ms
  setInterval(() => {
    document.querySelectorAll(".ba").forEach(updateLabel);
  }, 100);

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

//ai papai

// Array com os nomes dos meses em espanhol
