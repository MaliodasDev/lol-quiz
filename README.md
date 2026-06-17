# Quiz do Invocador — League of Legends

Joguinho de perguntas sobre LoL em **Next.js (React) + MongoDB Atlas**, pronto pra subir no **GitHub** e publicar na **Vercel**. Tem login, banco de dados real na nuvem e ranking que dura 24 horas.

- **Frontend:** React (Next.js 14, App Router) + TypeScript
- **Backend:** API Routes do próprio Next.js
- **Banco:** MongoDB Atlas (online) — 3 collections: `usuarios`, `perguntas`, `ranking`
- **Deploy:** Vercel (conectada ao GitHub)

---

## Roteiro de como arrumar tudo

Siga na ordem. Dá pra fazer tudo em ~20 minutos.

### Passo 1 — Pré-requisitos

Tenha o **Node.js 18 ou mais novo** instalado. Confira com:

```bash
node -v
```

### Passo 2 — Criar o banco no MongoDB Atlas (de graça)

1. Crie uma conta em **https://www.mongodb.com/atlas** e faça login.
2. Crie um **cluster gratuito** (tipo **M0**, opção "Free"). Escolha qualquer região perto do Brasil.
3. Em **Database Access** → **Add New Database User**: crie um usuário e senha (anote os dois — vão na connection string). Dê a permissão **Read and write to any database**.
4. Em **Network Access** → **Add IP Address** → escolha **Allow access from anywhere** (`0.0.0.0/0`). Isso é necessário pra Vercel conseguir acessar.
5. Volte em **Database** → botão **Connect** → **Drivers** → copie a **connection string**. Ela se parece com:
   ```
   mongodb+srv://SEU_USUARIO:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Troque `<password>` pela senha real e adicione `/lolquiz` antes do `?`, ficando assim:
   ```
   mongodb+srv://SEU_USUARIO:SUA_SENHA@cluster0.xxxxx.mongodb.net/lolquiz?retryWrites=true&w=majority
   ```

### Passo 3 — Configurar o projeto local

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie o arquivo `.env.local` (copie do exemplo) e cole sua connection string:
   ```bash
   cp .env.local.example .env.local
   ```
   Abra o `.env.local` e ponha sua string em `MONGODB_URI`.

### Passo 4 — Popular o banco (seed)

Rode uma vez pra inserir as perguntas e criar o índice de 24h:

```bash
npm run seed
```

Deve aparecer algo como `✓ 12 perguntas inseridas` e `✓ Índice TTL de 24h criado`.

### Passo 5 — Rodar localmente

```bash
npm run dev
```

Abra **http://localhost:3000**. Crie uma conta, jogue e veja o ranking. Pronto, já está funcionando com o banco online!

---

## Subir no GitHub

```bash
git init
git add .
git commit -m "Quiz de League of Legends com Next.js e MongoDB"
git branch -M main
git remote add origin https://github.com/erickdevz/lol-quiz.git
git push -u origin main
```

> O `.gitignore` já está configurado pra **não** subir o `.env.local` (sua senha do banco) nem o `node_modules`.

---

## Publicar na Vercel

1. Acesse **https://vercel.com** e entre com sua conta do GitHub.
2. **Add New → Project** e importe o repositório `lol-quiz`.
3. Antes de clicar em **Deploy**, abra **Environment Variables** e adicione:
   - **Name:** `MONGODB_URI`
   - **Value:** a mesma connection string do `.env.local`
4. Clique em **Deploy**. Em ~1 minuto seu jogo estará no ar num link `.vercel.app`.

> Se você ainda não rodou o `npm run seed` (Passo 4), rode pelo menos uma vez localmente apontando pro mesmo banco — assim as perguntas e o índice ficam prontos pra versão online também.

---

## Como mostrar o banco de dados (pra apresentação)

No painel do **MongoDB Atlas** → **Database** → **Browse Collections**. Lá aparecem as três collections do banco `lolquiz`:

- **`usuarios`** — cada conta criada (a senha aparece como hash, não em texto puro).
- **`perguntas`** — as perguntas do quiz.
- **`ranking`** — cada partida jogada. Repare no campo `data`: o MongoDB apaga sozinho os registros com mais de 24h (índice TTL).

Dá pra jogar uma partida e atualizar a tela do Atlas pra mostrar o documento novo aparecendo na collection `ranking` ao vivo — fica ótimo na defesa do trabalho.

---

## Como funciona o ranking de 24 horas

São duas camadas trabalhando juntas:

1. **Índice TTL no MongoDB** (criado no seed): o banco apaga automaticamente qualquer pontuação com mais de 24h.
2. **Filtro na consulta** (`/api/ranking`): por garantia, a query só considera partidas das últimas 24h e mostra a melhor pontuação de cada jogador (top 10).

Pra testar rápido sem esperar um dia, dá pra baixar o `expireAfterSeconds` no `scripts/seed.mjs` (ex.: `60` = 1 minuto), rodar o seed de novo e ver os registros sumindo sozinhos.

---

## Como adicionar ou editar perguntas

As perguntas ficam na lista `PERGUNTAS` dentro de `scripts/seed.mjs`. Cada uma tem o formato:

```js
{ q: "Texto da pergunta?", opcoes: ["A", "B", "C", "D"], correta: 1 }
```

O campo `correta` é a **posição** da resposta certa começando do 0 (`0`=A, `1`=B, `2`=C, `3`=D). Depois de editar, rode `npm run seed` de novo pra atualizar o banco.

---

## Estrutura do projeto

```
lol-quiz/
├── app/
│   ├── api/
│   │   ├── cadastro/route.ts    → cria conta (senha com hash)
│   │   ├── login/route.ts       → valida login
│   │   ├── perguntas/route.ts   → lista as perguntas do banco
│   │   ├── pontuacao/route.ts   → grava o resultado da partida
│   │   └── ranking/route.ts     → monta o ranking das últimas 24h
│   ├── globals.css              → visual (tema Hextech do LoL)
│   ├── layout.tsx               → estrutura base da página
│   └── page.tsx                 → o jogo (React: telas e lógica)
├── lib/
│   └── mongodb.ts               → conexão com o MongoDB Atlas
├── scripts/
│   └── seed.mjs                 → popula perguntas + cria índice de 24h
├── .env.local.example           → modelo da variável de ambiente
└── package.json
```
