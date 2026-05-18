/**
 * ================================================================
 * BARBEARIA JUVINO — CHATBOT IA (chatbot.js)
 * ================================================================
 *
 * ⚠️  ARQUIVO DE PLACEHOLDER / MOCK
 *
 * Este arquivo contém a estrutura e interface preparada para
 * integração futura com um Chatbot de Inteligência Artificial.
 *
 * ─── COMO INTEGRAR UM CHATBOT REAL ──────────────────────────────
 *
 * OPÇÃO A — OpenAI (ChatGPT):
 *   1. Instale o SDK: npm install openai
 *   2. Configure sua API Key no backend (NUNCA no frontend)
 *   3. Substitua `respostaMock()` por uma chamada ao seu backend
 *   4. Backend chama: openai.chat.completions.create({ model: "gpt-4o", ... })
 *
 * OPÇÃO B — Dialogflow (Google):
 *   1. Crie um agente no Dialogflow Console
 *   2. Use o SDK `@google-cloud/dialogflow`
 *   3. Substitua `respostaMock()` pela chamada à API
 *
 * OPÇÃO C — Botpress / ManyChat / Tidio:
 *   1. Crie uma conta na plataforma escolhida
 *   2. Substitua `#chatbot-container` pelo widget embed deles
 *   3. Remova este arquivo e adicione o <script> do provedor
 *
 * OPÇÃO D — Anthropic Claude API:
 *   1. Obtenha uma API Key em https://console.anthropic.com
 *   2. Crie um backend (Node.js/Python) para proxy seguro
 *   3. Substitua `respostaMock()` por fetch ao seu backend
 *   Exemplo de backend Node.js:
 *   ```
 *   const Anthropic = require('@anthropic-ai/sdk');
 *   const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
 *   const resposta = await client.messages.create({
 *     model: 'claude-opus-4-5',
 *     max_tokens: 500,
 *     system: 'Você é o assistente da Barbearia Juvino...',
 *     messages: [{ role: 'user', content: mensagemUsuario }]
 *   });
 *   ```
 * ─────────────────────────────────────────────────────────────────
 *
 * ================================================================
 */

/* ================================================================
   CONFIGURAÇÃO DO CHATBOT
   Altere aqui para personalizar o comportamento
   ================================================================ */
const CHATBOT_CONFIG = {
  // Nome exibido no chat
  nome: 'Assistente Juvino',

  // Emoji/avatar
  avatar: '💈',

  // Mensagem de boas-vindas
  boasVindas: 'Olá! Sou o assistente virtual da Barbearia Juvino. Em breve poderei te ajudar a agendar horários, tirar dúvidas sobre serviços e muito mais! 🪒',

  // Número do WhatsApp para fallback
  whatsapp: '5581999999999',

  // Respostas automáticas mock (substitua pela API real)
  respostasMock: {
    padrao: 'Entendido! Para atendimento imediato, entre em contato pelo WhatsApp. Nosso sistema de IA está em desenvolvimento! 😊',
    horario: 'Funcionamos de Segunda a Sábado, das 08h às 18h (com pausa no meio-dia em alguns dias). Domingo estamos fechados.',
    preco: 'Nossos preços: Corte Masculino R$ 25, Barba Completa R$ 20, Sobrancelha R$ 10, Pacote Corte + Barba R$ 40.',
    agendar: 'Para agendar, clique no botão de WhatsApp abaixo e envie uma mensagem. Respondemos rapidinho! 📅',
  },

  // Tempo de simulação de digitação (ms) — remover quando integrar IA real
  tempoDigitacao: 1200,
};

/* ================================================================
   INICIALIZAÇÃO DO CHATBOT
   Chamada automática ao carregar o script
   ================================================================ */

/**
 * iniciarChatbot()
 * Função principal — configura toda a interatividade do chatbot.
 *
 * @TODO Substituir a lógica de `respostaMock` pela chamada real
 *       à API de IA de sua escolha.
 */
function iniciarChatbot() {
  const fab             = document.getElementById('chatbot-fab');
  const janela          = document.getElementById('chatbot-janela');
  const btnFechar       = document.getElementById('chatbot-fechar');

  // Verifica se os elementos existem no DOM
  if (!fab || !janela) {
    console.warn('[Chatbot] Elementos do DOM não encontrados. Verifique o index.html.');
    return;
  }

  /* ── Abrir/fechar a janela do chatbot ── */
  fab.addEventListener('click', () => {
    const estaAberto = janela.classList.contains('ativa');

    if (estaAberto) {
      fecharJanela();
    } else {
      abrirJanela();
    }
  });

  if (btnFechar) {
    btnFechar.addEventListener('click', fecharJanela);
  }

  /* ── Fechar ao pressionar Escape ── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && janela.classList.contains('ativa')) {
      fecharJanela();
    }
  });

  /* ── Inicializa o campo de texto (se existir no HTML) ── */
  // @TODO — Quando integrar IA real, adicione o <input> e <button>
  // no chatbot-janela__corpo do index.html e descomente abaixo:
  //
  // const inputMsg = document.getElementById('chatbot-input');
  // const btnEnviar = document.getElementById('chatbot-enviar');
  // if (inputMsg && btnEnviar) {
  //   btnEnviar.addEventListener('click', () => processarMensagem(inputMsg.value));
  //   inputMsg.addEventListener('keydown', (e) => {
  //     if (e.key === 'Enter') processarMensagem(inputMsg.value);
  //   });
  // }

  console.info('[Chatbot Juvino] Inicializado com sucesso. Aguardando integração IA.');
}

/* ── Abrir janela ── */
function abrirJanela() {
  const fab    = document.getElementById('chatbot-fab');
  const janela = document.getElementById('chatbot-janela');
  if (!janela) return;

  janela.classList.add('ativa');
  janela.setAttribute('aria-hidden', 'false');
  fab.setAttribute('aria-expanded', 'true');

  // Foca no botão fechar (acessibilidade)
  const btnFechar = document.getElementById('chatbot-fechar');
  if (btnFechar) setTimeout(() => btnFechar.focus(), 100);
}

/* ── Fechar janela ── */
function fecharJanela() {
  const fab    = document.getElementById('chatbot-fab');
  const janela = document.getElementById('chatbot-janela');
  if (!janela) return;

  janela.classList.remove('ativa');
  janela.setAttribute('aria-hidden', 'true');
  fab.setAttribute('aria-expanded', 'false');

  // Devolve foco ao FAB
  if (fab) fab.focus();
}

/**
 * processarMensagem(texto)
 * Recebe a mensagem do usuário e retorna uma resposta.
 *
 * @TODO Substitua o corpo desta função pela chamada real à API de IA.
 * @param {string} texto — Mensagem digitada pelo usuário
 */
async function processarMensagem(texto) {
  if (!texto || !texto.trim()) return;

  // Exibe mensagem do usuário na tela
  adicionarMensagem(texto, 'usuario');

  // Simula "está digitando..."
  const indicadorDigitando = mostrarDigitando();

  try {
    // ─── AQUI ENTRA A SUA API DE IA ─────────────────────────────
    // @TODO: Substitua `respostaMock(texto)` por:
    //
    // const resposta = await fetch('/api/chatbot', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ mensagem: texto })
    // });
    // const dados = await resposta.json();
    // const textoResposta = dados.resposta;
    // ─────────────────────────────────────────────────────────────

    // Mock: simula delay de IA
    await esperarMs(CHATBOT_CONFIG.tempoDigitacao);
    const textoResposta = respostaMock(texto);

    // Remove indicador de digitação e exibe resposta
    indicadorDigitando.remove();
    adicionarMensagem(textoResposta, 'bot');

  } catch (erro) {
    indicadorDigitando.remove();
    adicionarMensagem(
      'Desculpe, ocorreu um erro. Tente pelo WhatsApp! 📱',
      'bot'
    );
    console.error('[Chatbot] Erro ao processar mensagem:', erro);
  }
}

/**
 * respostaMock(texto)
 * Gera respostas automáticas simples baseadas em palavras-chave.
 * Esta função será substituída pela chamada real à API de IA.
 *
 * @param {string} texto — Mensagem do usuário
 * @returns {string} Resposta automática
 */
function respostaMock(texto) {
  const textoMinusc = texto.toLowerCase();

  if (textoMinusc.includes('horário') || textoMinusc.includes('hora') || textoMinusc.includes('funciona')) {
    return CHATBOT_CONFIG.respostasMock.horario;
  }
  if (textoMinusc.includes('preço') || textoMinusc.includes('valor') || textoMinusc.includes('quanto')) {
    return CHATBOT_CONFIG.respostasMock.preco;
  }
  if (textoMinusc.includes('agendar') || textoMinusc.includes('marcar') || textoMinusc.includes('reservar')) {
    return CHATBOT_CONFIG.respostasMock.agendar;
  }

  return CHATBOT_CONFIG.respostasMock.padrao;
}

/**
 * adicionarMensagem(texto, tipo)
 * Cria e insere um balão de mensagem na janela do chat.
 *
 * @param {string} texto — Conteúdo da mensagem
 * @param {'bot'|'usuario'} tipo — Quem enviou a mensagem
 */
function adicionarMensagem(texto, tipo) {
  const corpo = document.querySelector('.chatbot-janela__corpo');
  if (!corpo) return;

  const msg = document.createElement('p');
  msg.className = `chatbot-janela__msg chatbot-janela__msg--${tipo}`;
  msg.textContent = texto;

  // Rola para a mensagem mais recente
  corpo.appendChild(msg);
  msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * mostrarDigitando()
 * Exibe o indicador "bot está digitando..."
 *
 * @returns {HTMLElement} O elemento criado (para remover depois)
 */
function mostrarDigitando() {
  const corpo = document.querySelector('.chatbot-janela__corpo');
  const ind = document.createElement('p');
  ind.className = 'chatbot-janela__msg chatbot-janela__msg--bot chatbot-digitando';
  ind.innerHTML = '<em>Digitando...</em>';
  ind.setAttribute('aria-live', 'polite');
  if (corpo) corpo.appendChild(ind);
  return ind;
}

/**
 * esperarMs(ms)
 * Utilitário: pausa assíncrona para simular delay de rede/IA
 *
 * @param {number} ms — Milissegundos para esperar
 * @returns {Promise}
 */
function esperarMs(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ================================================================
   AUTO-INICIALIZAÇÃO
   ================================================================ */
document.addEventListener('DOMContentLoaded', iniciarChatbot);