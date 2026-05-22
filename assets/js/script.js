/**
 * ================================================================
 * BARBEARIA JUVINO — SCRIPT PRINCIPAL (script.js)
 * ================================================================
 * Módulos incluídos:
 * 1. Inicialização geral
 * 2. Header: sombra ao rolar
 * 3. Menu Hambúrguer (mobile)
 * 4. Tema Claro / Escuro (com LocalStorage)
 * 5. Marcação do dia atual nos horários
 * 6. Status atual de funcionamento
 * 7. Smooth scroll para âncoras
 * 8. Link ativo na navegação
 * 9. Animações de entrada (Intersection Observer)
 * 10. Atualização do ano no footer
 * ================================================================
 */

/* ================================================================
   1. INICIALIZAÇÃO — aguarda o DOM estar completamente carregado
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  inicializarTheme();
  inicializarHeader();
  inicializarMenuMobile();
  inicializarBtnTema();
  marcarDiaAtualHorarios();
  exibirStatusAtual();
  inicializarScrollSuave();
  inicializarNavAtiva();
  inicializarAnimacoesEntrada();
  atualizarAnoCopyright();
});


/* ================================================================
   2. HEADER — efeito de sombra ao rolar a página
   ================================================================ */
function inicializarHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  // Usa IntersectionObserver para performance (evita scroll listener pesado)
  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:1px;left:0;width:1px;height:1px;';
  document.body.prepend(sentinel);

  const observer = new IntersectionObserver(
    ([entry]) => {
      // Quando o sentinel sai da viewport (usuário rolou), adiciona classe
      header.classList.toggle('header--scrolled', !entry.isIntersecting);
    },
    { threshold: 0 }
  );

  observer.observe(sentinel);
}


/* ================================================================
   3. MENU HAMBÚRGUER — drawer lateral mobile
   ================================================================ */
function inicializarMenuMobile() {
  const btnHamburger = document.getElementById('btn-hamburger');
  const navMobile    = document.getElementById('nav-mobile');
  const navOverlay   = document.getElementById('nav-overlay');

  if (!btnHamburger || !navMobile || !navOverlay) return;

  // Função para abrir o menu
  function abrirMenu() {
    btnHamburger.classList.add('ativo');
    navMobile.classList.add('ativo');
    navOverlay.classList.add('ativo');

    // Atualiza atributos ARIA para acessibilidade
    btnHamburger.setAttribute('aria-expanded', 'true');
    btnHamburger.setAttribute('aria-label', 'Fechar menu de navegação');
    navMobile.setAttribute('aria-hidden', 'false');
    navOverlay.setAttribute('aria-hidden', 'false');

    // Impede scroll do body enquanto menu está aberto
    document.body.style.overflow = 'hidden';

    // Foca no primeiro link do menu (acessibilidade)
    const primeiroLink = navMobile.querySelector('.nav-mobile__link');
    if (primeiroLink) primeiroLink.focus();
  }

  // Função para fechar o menu
  function fecharMenu() {
    btnHamburger.classList.remove('ativo');
    navMobile.classList.remove('ativo');
    navOverlay.classList.remove('ativo');

    btnHamburger.setAttribute('aria-expanded', 'false');
    btnHamburger.setAttribute('aria-label', 'Abrir menu de navegação');
    navMobile.setAttribute('aria-hidden', 'true');
    navOverlay.setAttribute('aria-hidden', 'true');

    // Restaura scroll do body
    document.body.style.overflow = '';

    // Devolve foco ao botão hambúrguer
    btnHamburger.focus();
  }

  // Toggle ao clicar no hambúrguer
  btnHamburger.addEventListener('click', () => {
    const estaAberto = btnHamburger.classList.contains('ativo');
    estaAberto ? fecharMenu() : abrirMenu();
  });

  // Fechar ao clicar no overlay
  navOverlay.addEventListener('click', fecharMenu);

  // Fechar ao clicar em qualquer link do menu mobile
  navMobile.querySelectorAll('.nav-mobile__link, .nav-mobile__cta').forEach(link => {
    link.addEventListener('click', fecharMenu);
  });

  // Fechar ao pressionar Escape (acessibilidade)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMobile.classList.contains('ativo')) {
      fecharMenu();
    }
  });
}


/* ================================================================
   4. TEMA CLARO / ESCURO
   - Salva a preferência no localStorage
   - Respeita prefers-color-scheme do sistema operacional
   ================================================================ */

// Detecta a preferência inicial (localStorage > sistema > claro)
function inicializarTheme() {
  const temaArmazenado  = localStorage.getItem('barbearia-juvino-tema');
  const prefereEscuro   = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const temaInicial     = temaArmazenado || (prefereEscuro ? 'dark' : 'light');

  aplicarTema(temaInicial);
}

// Aplica o tema ao documento
function aplicarTema(tema) {
  document.documentElement.setAttribute('data-theme', tema);
}

// Inicializa o botão toggle
function inicializarBtnTema() {
  const btn = document.getElementById('btn-tema');
  if (!btn) return;

  // Atualiza aria-pressed com base no tema atual
  function atualizarBotao() {
    const temaAtual   = document.documentElement.getAttribute('data-theme');
    const estaEscuro  = temaAtual === 'dark';
    btn.setAttribute('aria-pressed', String(estaEscuro));
    btn.setAttribute('aria-label', estaEscuro ? 'Ativar tema claro' : 'Ativar tema escuro');
  }

  atualizarBotao();

  btn.addEventListener('click', () => {
    const temaAtual = document.documentElement.getAttribute('data-theme');
    const novoTema  = temaAtual === 'dark' ? 'light' : 'dark';

    aplicarTema(novoTema);
    localStorage.setItem('barbearia-juvino-tema', novoTema);
    atualizarBotao();
  });

  // Reage a mudanças de preferência do sistema (ex: usuário muda macOS/Windows)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Só altera automaticamente se o usuário não definiu manualmente
    if (!localStorage.getItem('barbearia-juvino-tema')) {
      aplicarTema(e.matches ? 'dark' : 'light');
      atualizarBotao();
    }
  });
}


/* ================================================================
   5. HORÁRIOS — marca a linha do dia atual na tabela
   ================================================================ */
function marcarDiaAtualHorarios() {
  // Obtém o número do dia atual: 0=Dom, 1=Seg, ..., 6=Sáb
  const hoje     = new Date().getDay();
  const linhas   = document.querySelectorAll('#tabela-horarios tr[data-dia]');

  linhas.forEach(linha => {
    const diaDaLinha = parseInt(linha.getAttribute('data-dia'), 10);

    if (diaDaLinha === hoje) {
      linha.classList.add('dia-atual');

      // Adiciona indicador visual acessível
      const nomeDia = linha.querySelector('.dia-semana-nome');
      if (nomeDia) {
        // Adiciona " (Hoje)" ao texto — lido por leitores de tela
        const span = document.createElement('span');
        span.textContent = ' (Hoje)';
        span.style.cssText = `
          font-size: 0.8em;
          font-weight: 700;
          color: var(--cor-primaria);
          background: var(--cor-detalhe);
          padding: 1px 6px;
          border-radius: 999px;
          margin-left: 4px;
        `;
        span.setAttribute('aria-label', 'hoje');
        nomeDia.appendChild(span);
      }

      // Rola a tabela até a linha de hoje (suave)
      linha.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}


/* ================================================================
   6. STATUS ATUAL — exibe se a barbearia está aberta ou fechada
   ================================================================ */
function exibirStatusAtual() {
  const containerStatus = document.getElementById('status-atual');
  if (!containerStatus) return;

  // Configuração dos horários (para verificar status em tempo real)
  const horarios = {
    0: null,                                    // Domingo: fechado
    1: [{ a: '08:00', f: '12:00' }],           // Segunda
    2: [{ a: '08:00', f: '12:00' }, { a: '14:00', f: '17:40' }],  // Terça
    3: [{ a: '08:00', f: '12:00' }],           // Quarta
    4: [{ a: '08:00', f: '12:00' }, { a: '14:00', f: '17:40' }],  // Quinta
    5: [{ a: '08:00', f: '12:00' }, { a: '14:00', f: '18:00' }],  // Sexta
    6: [{ a: '08:00', f: '12:00' }, { a: '14:00', f: '18:00' }],  // Sábado
  };

  const agora       = new Date();
  const diaSemana   = agora.getDay();
  const horaAtual   = agora.getHours() * 60 + agora.getMinutes(); // em minutos

  // Converte "HH:MM" para minutos desde meia-noite
  function horaParaMinutos(horaStr) {
    const [h, m] = horaStr.split(':').map(Number);
    return h * 60 + m;
  }

  const periodosHoje = horarios[diaSemana];

  let estaAberto = false;
  let mensagem   = '';

  if (!periodosHoje) {
    // Domingo
    mensagem = '🔴 Hoje estamos <strong>fechados</strong>. Voltamos na segunda-feira às 08h!';
  } else {
    // Verifica se está dentro de algum período aberto
    estaAberto = periodosHoje.some(periodo => {
      const inicio = horaParaMinutos(periodo.a);
      const fim    = horaParaMinutos(periodo.f);
      return horaAtual >= inicio && horaAtual < fim;
    });

    if (estaAberto) {
      // Encontra quando fecha
      const periodoAtivo = periodosHoje.find(periodo => {
        const inicio = horaParaMinutos(periodo.a);
        const fim    = horaParaMinutos(periodo.f);
        return horaAtual >= inicio && horaAtual < fim;
      });
      mensagem = `🟢 Estamos <strong>abertos agora</strong>! Fechamos às ${periodoAtivo.f}. Venha nos visitar! 💈`;
    } else {
      // Verifica se ainda abre hoje
      const proximoPeriodo = periodosHoje.find(periodo => {
        return horaParaMinutos(periodo.a) > horaAtual;
      });

      if (proximoPeriodo) {
        mensagem = `🟡 Abriremos hoje às <strong>${proximoPeriodo.a}</strong>. Aguarde! ☕`;
      } else {
        mensagem = '🔴 Já <strong>encerramos</strong> por hoje. Volte amanhã! 💈';
      }
    }
  }

  containerStatus.innerHTML = mensagem;
}


/* ================================================================
   7. SCROLL SUAVE — previne comportamento padrão abrupto
   e adiciona offset para compensar o header fixo
   ================================================================ */
function inicializarScrollSuave() {
  const alturaHeader = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--altura-header'),
    10
  ) || 72;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href   = anchor.getAttribute('href');
      const alvo   = document.querySelector(href);
      if (!alvo) return;

      e.preventDefault();

      // Calcula posição com offset do header
      const posicaoAlvo = alvo.getBoundingClientRect().top + window.scrollY - alturaHeader;

      window.scrollTo({
        top: posicaoAlvo,
        behavior: 'smooth'
      });

      // Atualiza URL sem recarregar a página
      history.pushState(null, '', href);

      // Foca no elemento alvo (acessibilidade)
      alvo.setAttribute('tabindex', '-1');
      alvo.focus({ preventScroll: true });
    });
  });
}


/* ================================================================
   8. LINK ATIVO NA NAVEGAÇÃO
   Usa IntersectionObserver para detectar qual seção está visível
   ================================================================ */
function inicializarNavAtiva() {
  const secoes    = document.querySelectorAll('section[id], main section[id]');
  const linksNav  = document.querySelectorAll('.nav__link');

  if (!secoes.length || !linksNav.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const idAtivo = entry.target.id;

        linksNav.forEach(link => {
          const ehAtivo = link.getAttribute('href') === `#${idAtivo}`;
          link.classList.toggle('ativo', ehAtivo);
          link.setAttribute('aria-current', ehAtivo ? 'true' : 'false');
        });
      });
    },
    {
      // Considera a seção "ativa" quando ocupa mais de 40% da tela
      threshold: 0.4,
      rootMargin: `-${72}px 0px 0px 0px` // Compensar header fixo
    }
  );

  secoes.forEach(secao => observer.observe(secao));
}


/* ================================================================
   9. ANIMAÇÕES DE ENTRADA (Fade + Slide up)
   Usa IntersectionObserver — sem biblioteca externa
   ================================================================ */
function inicializarAnimacoesEntrada() {
  // Seleciona elementos que devem animar ao entrar na viewport
  const elementos = document.querySelectorAll(`
    .servico-card,
    .galeria__item,
    .diferencial,
    .contato__card,
    .secao-header,
    .sobre__visual,
    .sobre__texto
  `);

  if (!elementos.length) return;

  // Adiciona estado inicial (invisível + deslocado para baixo)
  elementos.forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.05}s, transform 0.6s ease ${i * 0.05}s`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Anima para o estado final (visível + posição normal)
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
          // Para de observar depois que animou (performance)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  elementos.forEach(el => observer.observe(el));
}


/* ================================================================
   10. ATUALIZA ANO NO COPYRIGHT DO FOOTER
   Automaticamente exibe o ano atual
   ================================================================ */
function atualizarAnoCopyright() {
  const spanAno = document.getElementById('ano-atual');
  if (spanAno) {
    spanAno.textContent = new Date().getFullYear();
  }
}