# 💈 Barbearia Juvino — Site Oficial

Site institucional completo da **Barbearia Juvino**, desenvolvido com HTML5, CSS3 e JavaScript puro, com foco em performance, SEO, acessibilidade e design profissional.

---

## 🚀 Como Rodar o Projeto

### Opção 1 — Direto no navegador
Abra o arquivo `index.html` diretamente no seu navegador. Não requer servidor.

### Opção 2 — Com servidor local (recomendado)

**VS Code + Live Server:**
1. Instale a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Clique com botão direito em `index.html` → **Open with Live Server**

**Python:**
```bash
# Python 3
python -m http.server 8000
# Acesse: http://localhost:8000
```

**Node.js:**
```bash
npx serve .
# ou
npx http-server .
```

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|---|---|---|
| HTML5 | — | Estrutura semântica + acessibilidade WAI-ARIA |
| CSS3 | — | Estilização, variáveis, animações, responsividade |
| JavaScript | ES2020+ | Interatividade, menu, tema, horários |
| Google Fonts | — | Playfair Display + DM Sans |
| Schema.org | — | Rich Snippets para negócio local |

Sem frameworks, sem dependências, sem npm. 100% vanilla.

---

## 🎨 Paleta de Cores (Azul Premium)

```css
--cor-primaria:   #0F4C81;  /* Azul principal */
--cor-secundaria: #0A3A63;  /* Azul escuro */
--cor-detalhe:    #D9E6F2;  /* Azul claro / destaque */
--cor-clara:      #FFFFFF;  /* Branco puro */
--cor-escura:     #0D0D0D;  /* Preto */
```

---

## 🌙 Como Ativar o Tema Escuro

### Automaticamente
O site detecta a preferência do sistema operacional via `prefers-color-scheme`.

### Manualmente
Clique no ícone ☀️/🌙 no canto superior direito do header.

### Via JavaScript
```javascript
document.documentElement.setAttribute('data-theme', 'dark');
localStorage.setItem('barbearia-juvino-tema', 'dark');
```

### Via CSS (forçar escuro)
```css
html { --data-theme: dark; }
```

A preferência é salva no **LocalStorage** com a chave `barbearia-juvino-tema`.

---

## 📁 Estrutura de Pastas

```
/barbearia-juvino
│
├── index.html              ← Arquivo principal (único HTML)
├── README.md               ← Esta documentação
│
├── /assets
│   ├── /css
│   │   └── style.css       ← Estilos + tema escuro + responsivo
│   ├── /js
│   │   ├── script.js       ← Lógica principal do site
│   │   └── chatbot.js      ← Placeholder do Chatbot IA
│   └── /img
│       ├── logo.svg        ← Logo da barbearia
│       ├── ambiente1.svg   ← Imagem galeria (principal)
│       ├── ambiente2.svg   ← Imagem galeria
│       ├── ambiente3.svg   ← Imagem galeria
│       ├── ambiente4.svg   ← Imagem galeria
│       ├── ambiente5.svg   ← Imagem galeria
│       └── ambiente6.svg   ← Imagem galeria
│
└── /components             ← Componentes HTML para referência
    ├── header.html
    ├── footer.html
    └── horarios.html
```

---

## 🕒 Como Personalizar os Horários

### 1. Na tabela HTML (`index.html`)
Localize a `<section id="horarios">` e edite as células `<td>`:

```html
<tr data-dia="1"> <!-- 0=Dom, 1=Seg, ..., 6=Sáb -->
  <td>Segunda-feira</td>
  <td>08:00 – 12:00</td>  ← Manhã
  <td>–</td>              ← Tarde (use – se fechado)
  <td>...</td>
</tr>
```

### 2. No JavaScript (`assets/js/script.js`)
Localize o objeto `horarios` na função `exibirStatusAtual()`:

```javascript
const horarios = {
  0: null,                                    // Domingo: null = fechado
  1: [{ a: '08:00', f: '12:00' }],           // Segunda: só manhã
  2: [{ a: '08:00', f: '12:00' }, { a: '14:00', f: '17:40' }],  // Terça: manhã + tarde
  // ...
};
```

- `a` = hora de abertura
- `f` = hora de fechamento
- `null` = dia fechado

---

## 🤖 Como Integrar o Chatbot IA

O arquivo `assets/js/chatbot.js` está preparado para receber a integração.

### Passo 1 — Escolha seu provedor de IA

| Provedor | Dificuldade | Custo |
|---|---|---|
| OpenAI (ChatGPT) | Média | Pago por uso |
| Anthropic Claude | Média | Pago por uso |
| Google Dialogflow | Alta | Gratuito até certo limite |
| Tidio / Botpress | Baixa | Freemium |

### Passo 2 — Crie um backend seguro

**NUNCA** coloque sua API Key diretamente no JavaScript do frontend. Crie um endpoint no seu servidor:

```javascript
// backend/api/chatbot.js (Node.js + Express)
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post('/api/chatbot', async (req, res) => {
  const { mensagem } = req.body;

  const resposta = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 500,
    system: `Você é o assistente da Barbearia Juvino. 
             Responda sobre horários, preços e serviços.
             Horários: Seg-Sáb 08h-18h, Dom fechado.
             Preços: Corte R$25, Barba R$20, Sobrancelha R$10, Combo R$40.
             Seja simpático e use emojis ocasionalmente.`,
    messages: [{ role: 'user', content: mensagem }]
  });

  res.json({ resposta: resposta.content[0].text });
});
```

### Passo 3 — Atualize `chatbot.js`

Substitua a função `respostaMock()` no `chatbot.js`:

```javascript
// ANTES (mock):
const textoResposta = respostaMock(texto);

// DEPOIS (API real):
const res = await fetch('/api/chatbot', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ mensagem: texto })
});
const dados = await res.json();
const textoResposta = dados.resposta;
```

### Passo 4 — Adicione o campo de input no HTML

No `index.html`, dentro de `.chatbot-janela__corpo`, adicione:

```html
<div class="chatbot-input-area">
  <input type="text" id="chatbot-input" 
         placeholder="Digite sua mensagem..."
         aria-label="Campo de mensagem para o assistente" />
  <button id="chatbot-enviar" aria-label="Enviar mensagem">➤</button>
</div>
```

---

## ♿ Acessibilidade

O site segue as diretrizes **WCAG 2.1 AA**:

- Todos os elementos interativos têm `aria-label` e `aria-expanded`
- Navegação por teclado funcional (Tab, Enter, Escape)
- Skip link para pular direto ao conteúdo
- Imagens com `alt` descritivos
- Contraste de cores verificado
- `aria-live` para conteúdo dinâmico (status chatbot, horários)
- Suporte a `prefers-reduced-motion`

---

## 📊 SEO

- Meta tags completas (description, keywords, author)
- Open Graph para Facebook/LinkedIn
- Twitter Cards
- Schema.org `HairSalon` para Rich Snippets
- Hierarquia de headings correta (único H1, H2 por seção, H3 para itens)
- `alt` em todas as imagens
- `rel="canonical"` configurado
- Performance: imagens lazy-loaded, fontes preconnect

---

## 🔧 Personalização Rápida

### Mudar o número do WhatsApp
Busque por `5581999999999` no `index.html` e substitua pelo número real (com DDI).

### Mudar endereço
Localize `Rua Exemplo, 123` no `index.html` e atualize.

### Mudar o link do Google Maps
Na seção de contato, substitua o `src` do `<iframe>`:
1. Abra [maps.google.com](https://maps.google.com)
2. Pesquise o endereço da barbearia
3. Clique em **Compartilhar** → **Incorporar mapa**
4. Copie o `src` do iframe e cole no `index.html`

### Mudar preços dos serviços
Localize os elementos `.servico-card__preco` na seção `#servicos`.

---

## 📝 Licença

Projeto desenvolvido para uso exclusivo da Barbearia Juvino.  
Sinta-se à vontade para adaptar para outras barbearias.

---

*Feito com ♥ e muito café ☕*