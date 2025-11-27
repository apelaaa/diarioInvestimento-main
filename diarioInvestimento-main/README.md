# 📊 Diário de Investimentos

Uma aplicação web moderna e completa para gerenciamento de portfólio de investimentos, com sincronização automática de preços em tempo real via APIs externas.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-cyan)
![SQLite](https://img.shields.io/badge/SQLite-3.x-lightgrey)

---

##  Funcionalidades

### Autenticação
- Cadastro e login de usuários
- Criptografia de senhas com bcrypt
- Sessões seguras com express-session
- Gerenciamento de perfil

### Gestão de Ativos
- Cadastro de ativos (Ações, FIIs, Criptomoedas, Renda Fixa)
- Edição e exclusão de ativos
- Visualização em tabela (desktop) e cards (mobile)
- **Sincronização automática de preços** via APIs externas

### Gestão de Transações
- Registro de compras e vendas
- Cálculo automático de preço médio
- Histórico completo de transações
- Validação de dados

### Dashboard Inteligente
- **Valor Total Investido**: Soma de todos os custos de aquisição
- **Valor Atual do Portfólio**: Calculado com preços de mercado em tempo real
- **Lucro/Prejuízo**: Diferença entre valor atual e investido
- **Percentual de Retorno**: Performance total do portfólio
- Cards com gradientes e animações

### Integração com APIs de Preços
- **Brapi**: Preços de ações e FIIs da B3 (PETR4, VALE3, etc.)
- **CoinGecko**: Cotações de criptomoedas em BRL (BTC, ETH, etc.)
- **Auto-sync**: Atualização automática a cada 5 minutos
- **Cálculo de P&L**: Lucro/prejuízo individual por ativo

### Interface 
- Design moderno com Tailwind CSS
- Tema escuro (dark mode)
- Totalmente responsivo (mobile-first)
- Animações suaves e micro-interações
- Gradientes e efeitos glassmorphism

---

## Tecnologias Utilizadas

### Backend
- **Node.js** (v18+)
- **Express.js** - Framework web
- **Sequelize** - ORM para banco de dados
- **SQLite** - Banco de dados (compatível com MySQL/PostgreSQL)
- **bcrypt** - Criptografia de senhas
- **express-session** - Gerenciamento de sessões
- **axios** - Cliente HTTP para APIs

### Frontend
- **EJS** - Template engine
- **Tailwind CSS** - Framework CSS utility-first
- **Font Awesome** - Ícones
- **Google Fonts** (Inter) - Tipografia

### APIs Externas
- **Brapi** - Cotações de ações e FIIs brasileiros
- **CoinGecko** - Preços de criptomoedas

---

## Instalação e Execução

### Pré-requisitos
- Node.js atualizado instalado
- npm ou yarn

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd diarioInvestimento
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Compile o CSS do Tailwind**
   ```bash
   npm run build:css
   ```

4. **Inicie a aplicação**
   
   **Produção:**
   ```bash
   npm start
   ```
   
   **Desenvolvimento (com auto-reload):**
   ```bash
   npm run dev
   ```

5. **Acesse no navegador**
   ```
   http://localhost:3000
   ```

### Scripts Disponíveis

- `npm start` - Inicia o servidor em modo produção
- `npm run dev` - Inicia com nodemon (auto-reload)
- `npm run build:css` - Compila o Tailwind CSS
- `npm run watch:css` - Compila CSS com watch mode

---

## 📁 Estrutura do Projeto

```
diarioInvestimento/
├── config/
│   └── database.js          # Configuração do Sequelize
├── controllers/
│   ├── authController.js    # Lógica de autenticação
│   ├── assetController.js   # Gestão de ativos
│   └── transactionController.js
├── models/
│   ├── index.js            # Configuração dos modelos
│   ├── User.js             # Modelo de usuário
│   ├── Asset.js            # Modelo de ativo
│   └── Transaction.js      # Modelo de transação
├── routes/
│   ├── authRoutes.js       # Rotas de autenticação
│   ├── assetRoutes.js      # Rotas de ativos
│   └── transactionRoutes.js
├── services/
│   └── priceService.js     # Serviço de sincronização de preços
├── views/
│   ├── partials/           # Componentes reutilizáveis
│   ├── auth/               # Páginas de autenticação
│   ├── assets/             # Páginas de ativos
│   ├── transactions/       # Páginas de transações
│   └── dashboard.ejs       # Dashboard principal
├── public/
│   └── css/
│       ├── tailwind.css    # Input do Tailwind
│       └── output.css      # CSS compilado
├── app.js                  # Configuração principal
└── package.json
```

---

## Como Usar

### 1. Criar uma Conta
- Acesse `/auth/register`
- Preencha nome, email e senha
- Faça login com suas credenciais

### 2. Adicionar Ativos
- Clique em "Novo Ativo" no menu
- Preencha:
  - **Nome**: Ex: "Petrobras"
  - **Símbolo**: Ex: "PETR4" (para ações/FIIs) ou "BTC" (para cripto)
  - **Tipo**: Ação, FII, Cripto ou Renda Fixa

### 3. Registrar Transações
- Clique em "Nova Transação"
- Selecione o ativo
- Escolha o tipo (Compra/Venda)
- Informe:
  - **Quantidade**: Número de unidades
  - **Valor por Unidade**: Preço pago/recebido
  - **Data**: Data da transação

### 4. Acompanhar Performance
- O dashboard mostra automaticamente:
  - Total investido
  - Valor atual (com preços de mercado)
  - Lucro/Prejuízo total
- A página de ativos mostra P&L individual de cada ativo

---

## Sincronização de Preços

### Como Funciona
1. Ao visitar o dashboard ou página de ativos
2. O sistema verifica se os preços estão desatualizados (> 5 min)
3. Busca automaticamente os preços atuais nas APIs
4. Atualiza o banco de dados
5. Calcula lucro/prejuízo em tempo real

### APIs Utilizadas

#### Brapi (Ações e FIIs)
- **Endpoint**: `https://brapi.dev/api/quote/{ticker}`
- **Exemplos**: PETR4, VALE3, ITUB4, MXRF11
- **Gratuita**: Sim

#### CoinGecko (Criptomoedas)
- **Endpoint**: `https://api.coingecko.com/api/v3/simple/price`
- **Símbolos suportados**: BTC, ETH, USDT, BNB, SOL, ADA, XRP, DOGE, MATIC, AVAX, LINK
- **Moeda**: BRL (Real Brasileiro)
- **Gratuita**: Sim

### Cálculo de Lucro/Prejuízo

```
Preço Médio = Total Investido ÷ Quantidade
Valor Atual = Quantidade × Preço Atual (da API)
Lucro/Prejuízo = Valor Atual - Total Investido
Percentual = (Lucro/Prejuízo ÷ Total Investido) × 100
```

**Exemplo:**
- Comprou 100 ações PETR4 @ R$ 30,00 = R$ 3.000,00
- Preço atual (API): R$ 35,50
- Valor atual: 100 × R$ 35,50 = R$ 3.550,00
- **Lucro: +R$ 550,00 (+18,33%)** 🟢

---

## Design System

### Cores
- **Background**: Slate-900
- **Cards**: Slate-800
- **Borders**: Slate-700
- **Primary**: Blue (500-600)
- **Secondary**: Purple (500-600)
- **Success**: Emerald (400-500)
- **Danger**: Red (400-500)

### Tipografia
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, 2xl-3xl
- **Body**: Regular, sm-base

### Componentes
- Cards com gradientes
- Hover effects e transitions
- Badges coloridos por tipo
- Tabelas responsivas
- Forms com validação visual

---

## Banco de Dados

### Modelos

#### User
- `id`, `name`, `email`, `password`, `createdAt`

#### Asset
- `id`, `name`, `symbol`, `type`, `userId`
- `currentPrice`, `lastPriceUpdate`, `priceChange`

#### Transaction
- `id`, `assetId`, `userId`, `type`, `quantity`, `price`, `date`

### Relacionamentos
- User → Assets (1:N)
- User → Transactions (1:N)
- Asset → Transactions (1:N)

---

## Segurança

- ✅ Senhas criptografadas com bcrypt
- ✅ Sessões seguras com express-session
- ✅ Validação de dados no backend
- ✅ Proteção contra SQL injection (Sequelize)
- ✅ Sanitização de inputs

---

## Melhorias Futuras

- [ ] Gráficos de performance (Chart.js)
- [ ] Histórico de preços
- [ ] Alertas de preço
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Suporte a dividendos
- [ ] Multi-moeda (USD, EUR)
- [ ] Modo claro (light mode)
- [ ] Notificações push

---

## Integrantes

- **Luis Henrique dos Santos Abrantes**
- **Isaque Estolano**
- **Cauã Almeida Moura**
- **Gustavo Macedo**
- **Luiz Fernando Paiva Borges**


