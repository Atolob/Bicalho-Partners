// Chat IA - Bicalho & Partners
(function () {
  const WEBHOOK = "https://atolob.app.n8n.cloud/webhook/chat-atendimento";

  const MENSAGENS_INICIAIS = [
    {
      de: "bot",
      texto:
        "Olá! Sou o assistente virtual da <strong>Bicalho & Partners</strong>. 👋",
    },
    {
      de: "bot",
      texto:
        "Posso te ajudar com dúvidas sobre <strong>abertura de empresa</strong>, <strong>contabilidade</strong>, <strong>planejamento tributário</strong>, <strong>MEI</strong> e muito mais.",
    },
    {
      de: "bot",
      texto: "Como posso te ajudar hoje?",
    },
  ];

  const SUGESTOES = [
    "Quero abrir uma empresa",
    "Como funciona o MEI?",
    "Quero trocar de contador",
    "O que é BPO Financeiro?",
  ];

  // ── Estado ───────────────────────────────────────────────────────────────
  let aberto = false;
  let sessionId = "sess_" + Math.random().toString(36).slice(2, 10);
  let digitando = false;

  // ── HTML do widget ───────────────────────────────────────────────────────
  const widget = document.createElement("div");
  widget.id = "bp-chat-widget";
  widget.innerHTML = `
    <button id="bp-chat-btn" aria-label="Abrir chat de atendimento">
      <span class="bp-chat-icon-open">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <span>Fale com nossa IA</span>
      </span>
      <span class="bp-chat-icon-close" style="display:none">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </span>
    </button>

    <div id="bp-chat-box" aria-live="polite">
      <div id="bp-chat-header">
        <div class="bp-chat-avatar">B</div>
        <div>
          <strong>Assistente Bicalho</strong>
          <span class="bp-chat-status"><span class="bp-dot"></span> Online agora</span>
        </div>
      </div>

      <div id="bp-chat-msgs"></div>

      <div id="bp-chat-sugestoes"></div>

      <div id="bp-chat-footer">
        <input id="bp-chat-input" type="text" placeholder="Digite sua dúvida..." autocomplete="off" maxlength="500" />
        <button id="bp-chat-send" aria-label="Enviar mensagem">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(widget);

  // ── Referências ──────────────────────────────────────────────────────────
  const btn = document.getElementById("bp-chat-btn");
  const box = document.getElementById("bp-chat-box");
  const msgsEl = document.getElementById("bp-chat-msgs");
  const inputEl = document.getElementById("bp-chat-input");
  const sendBtn = document.getElementById("bp-chat-send");
  const sugestoesEl = document.getElementById("bp-chat-sugestoes");
  const iconOpen = btn.querySelector(".bp-chat-icon-open");
  const iconClose = btn.querySelector(".bp-chat-icon-close");

  // ── Abrir / Fechar ───────────────────────────────────────────────────────
  function toggleChat() {
    aberto = !aberto;
    box.classList.toggle("bp-chat-aberto", aberto);
    iconOpen.style.display = aberto ? "none" : "flex";
    iconClose.style.display = aberto ? "flex" : "none";
    if (aberto && msgsEl.children.length === 0) {
      iniciarConversa();
    }
    if (aberto) inputEl.focus();
  }

  btn.addEventListener("click", toggleChat);

  // ── Mensagens ────────────────────────────────────────────────────────────
  function adicionarMensagem(texto, de, atraso = 0) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const div = document.createElement("div");
        div.className = "bp-msg bp-msg-" + de;
        div.innerHTML = '<div class="bp-msg-balao">' + texto + "</div>";
        msgsEl.appendChild(div);
        rolarParaBaixo();
        resolve();
      }, atraso);
    });
  }

  function mostrarDigitando() {
    if (digitando) return;
    digitando = true;
    const div = document.createElement("div");
    div.className = "bp-msg bp-msg-bot bp-digitando";
    div.innerHTML =
      '<div class="bp-msg-balao"><span></span><span></span><span></span></div>';
    msgsEl.appendChild(div);
    rolarParaBaixo();
  }

  function removerDigitando() {
    const el = msgsEl.querySelector(".bp-digitando");
    if (el) el.remove();
    digitando = false;
  }

  function rolarParaBaixo() {
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  // ── Início da conversa ───────────────────────────────────────────────────
  async function iniciarConversa() {
    ocultarSugestoes();
    for (let i = 0; i < MENSAGENS_INICIAIS.length; i++) {
      await adicionarMensagem(MENSAGENS_INICIAIS[i].texto, "bot", i * 600);
    }
    setTimeout(mostrarSugestoes, MENSAGENS_INICIAIS.length * 600 + 200);
  }

  // ── Sugestões ────────────────────────────────────────────────────────────
  function mostrarSugestoes() {
    sugestoesEl.innerHTML = "";
    SUGESTOES.forEach((s) => {
      const btn = document.createElement("button");
      btn.className = "bp-sugestao";
      btn.textContent = s;
      btn.addEventListener("click", () => enviarMensagem(s));
      sugestoesEl.appendChild(btn);
    });
  }

  function ocultarSugestoes() {
    sugestoesEl.innerHTML = "";
  }

  // ── Envio ────────────────────────────────────────────────────────────────
  async function enviarMensagem(texto) {
    texto = (texto || inputEl.value).trim();
    if (!texto || digitando) return;

    inputEl.value = "";
    ocultarSugestoes();
    adicionarMensagem(texto, "usuario");
    mostrarDigitando();
    inputEl.disabled = true;
    sendBtn.disabled = true;

    try {
      const res = await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ human_message: texto, sessionId }),
      });

      if (!res.ok) throw new Error("Erro " + res.status);
      const data = await res.json();

      removerDigitando();

      // Aceita { output }, { response }, { text }, ou string direta
      const resposta =
        (typeof data === "string" ? data : null) ||
        data.output ||
        data.response ||
        data.text ||
        data.message ||
        "Desculpe, não consegui processar sua mensagem agora.";

      await adicionarMensagem(resposta, "bot");

      // Após resposta, oferece atalho pro WhatsApp
      const linkWpp = document.createElement("div");
      linkWpp.className = "bp-msg bp-msg-bot";
      linkWpp.innerHTML = `<div class="bp-msg-balao bp-msg-wpp">Posso te ajudar mais ou prefere falar diretamente com o Filipe? <a href="https://wa.me/5531972599204?text=Ol%C3%A1%20Filipe!%20Vim%20pelo%20site%20e%20tenho%20uma%20d%C3%BAvida." target="_blank" rel="noreferrer">Abrir WhatsApp →</a></div>`;
      msgsEl.appendChild(linkWpp);
      rolarParaBaixo();
    } catch (e) {
      removerDigitando();
      adicionarMensagem(
        'Ops! Houve um problema de conexão. Tente novamente ou fale pelo <a href="https://wa.me/5531972599204" target="_blank">WhatsApp</a>.',
        "bot",
      );
    } finally {
      inputEl.disabled = false;
      sendBtn.disabled = false;
      inputEl.focus();
    }
  }

  sendBtn.addEventListener("click", () => enviarMensagem());
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  });
})();
