# 🚀 Guia de Execução - Agro Forte na Rede Local

## Pré-requisitos

- **Node.js** (versão 14+) - [Download](https://nodejs.org/)
- **npm** (vem com Node.js)
- Um navegador moderno (Chrome, Firefox, Safari, Edge)

## Instalação Rápida

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/gustavooliveirasantos18-dot/agrinho.git
cd agrinho
```

### 2️⃣ Instale as dependências

```bash
npm install
```

### 3️⃣ Inicie o servidor local

**Opção A: Com Webpack Dev Server (Recomendado)**

```bash
npm start
```

Este comando:
- Inicia um servidor em `http://localhost:8080`
- Abre automaticamente no navegador
- Recarrega a página ao fazer alterações no código

**Opção B: Com Python (Simples)**

```bash
# Python 3
python -m http.server 8000

# ou Python 2
python -m SimpleHTTPServer 8000
```

Depois acesse: `http://localhost:8000`

**Opção C: Com Node.js (http-server)**

```bash
npm install -g http-server
http-server
```

Acesse: `http://localhost:8080`

## Acessar de Outro Computador na Rede

Depois de iniciar o servidor, descubra seu **IP local**:

### Windows
```bash
ipconfig
```
Procure por "IPv4 Address" (ex: `192.168.1.100`)

### Mac/Linux
```bash
ifconfig
```
Procure por "inet" (ex: `192.168.1.100`)

### Acessar do outro computador

No navegador de outro computador na mesma rede:

```
http://SEU_IP_LOCAL:8080
```

Exemplo:
```
http://192.168.1.100:8080
```

## Troubleshooting

### ❌ Porta 8080 já está em uso

```bash
# Webpack Dev Server
npm start -- --port 3000

# http-server
http-server -p 3000
```

### ❌ Não consegue acessar de outro computador

1. Verifique se estão na mesma rede WiFi/Ethernet
2. Desabilite temporariamente o firewall
3. Use seu IP real, não `localhost` ou `127.0.0.1`

### ❌ Erros de permissão

```bash
# No Windows (como Administrador)
npm install

# No Mac/Linux
sudo npm install
```

## Estrutura do Projeto

```
agrinho/
├── index.html              # Página principal
├── styles.css              # Estilos
├── package.json            # Dependências
├── README.md               # Documentação
├── NETWORK.md              # Este arquivo
└── js/
    ├── main.js            # Entrada principal
    ├── game.js            # Lógica do jogo
    ├── plant.js           # Sistema de plantas
    ├── disaster.js        # Sistema de desastres
    ├── defense.js         # Sistema de defesas
    └── ui.js              # Interface do usuário
```

## Comandos Úteis

```bash
# Desenvolvimento com recarga automática
npm start

# Build para produção
npm run build

# Build em modo desenvolvimento
npm run dev
```

## Debug no Console

Abra o console do navegador (F12 ou Cmd+Option+I) e execute:

```javascript
gameDebug()
```

Isso mostrará:
- 💰 Dinheiro
- 🌱 Sementes
- 💧 Água
- 📅 Dia do jogo
- 🌾 Total de plantas
- 🛡️ Defesas construídas
- ⚡ Desastres ativos

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```
GAME_SPEED=1
DEBUG=true
PORT=8080
```

## Performance

- Máximo de **100 talhões** (10x10 grid)
- Máximo de **50 plantas** simultâneas recomendado
- Máximo de **20 defesas** simultâneas
- Máximo de **5 desastres** simultâneos

## Suporte

Se encontrar problemas:

1. Abra o Console (F12)
2. Procure por mensagens de erro em vermelho
3. Execute `gameDebug()` para verificar o estado do jogo
4. Verifique se todas as dependências estão instaladas: `npm install`

---

**Divirta-se no Agro Forte!** 🌾🎮
