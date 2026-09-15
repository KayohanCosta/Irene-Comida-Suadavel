# Architecture — Irene Comida Saudável

## 1. Visão geral

O Irene Comida Saudável é uma aplicação web construída com React, TypeScript, Vite e TanStack Start.

A aplicação combina:

- interface responsiva;
- cardápio interativo;
- montagem de kits;
- área administrativa;
- persistência de dados com Supabase;
- assistente virtual;
- integração com OpenRouter;
- processamento server-side através do TanStack Start.

A arquitetura separa a camada de apresentação das integrações externas e utiliza rotas server-side para operações que exigem credenciais privadas.

## 2. Stack

### Frontend

- React 19
- TypeScript 5.8
- Vite 7
- Tailwind CSS 4
- Radix UI
- Lucide React
- React Hook Form
- Recharts

### Application runtime

- TanStack Start
- TanStack Router
- TanStack React Query

### Backend / services

- Supabase
- OpenRouter
- TanStack Start server handlers

### Tooling

- ESLint
- Prettier
- TypeScript
- Vite plugins

## 3. Estrutura da aplicação

```text
src/
├── assets/
├── components/
│   ├── cardapio/
│   └── ui/
├── hooks/
├── lib/
├── routes/
│   ├── __root.tsx
│   ├── admin.tsx
│   ├── index.tsx
│   └── api/
│       └── openrouter.ts
├── main.tsx
├── router.tsx
├── routeTree.gen.ts
└── styles.css
```

### `components/`

Contém os componentes reutilizáveis da interface.

Entre eles está o `VirtualAssistant`, responsável pela experiência conversacional e pelo fluxo de montagem de kits.

### `hooks/`

Concentra hooks específicos utilizados para encapsular comportamentos da aplicação.

### `lib/`

Centraliza integrações e utilitários.

O cliente do Supabase é inicializado em `src/lib/supabase.ts`.

### `routes/`

Contém as rotas da aplicação utilizando o sistema de file-based routing do TanStack Router.

A área administrativa está em `admin.tsx`.

A página principal está em `index.tsx`.

A integração server-side com OpenRouter está isolada em:

```text
src/routes/api/openrouter.ts
```

## 4. Fluxo da aplicação

De forma simplificada:

```text
                    ┌─────────────────────┐
                    │      Browser        │
                    │                     │
                    │ React + TanStack    │
                    │ Router + UI         │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼─────────────────┐
              │                │                 │
              ▼                ▼                 ▼
        Aplicação         Supabase        API interna
        / Rotas           Client          /api/openrouter
              │                │                 │
              │                │                 ▼
              │                │          OpenRouter API
              │                │
              └────────────────┴─────────────────
```

O browser pode utilizar as integrações públicas destinadas ao cliente, enquanto operações que exigem uma credencial privada passam pela camada server-side.

# 5. Arquitetura de segurança do OpenRouter

## Problema original

A integração inicial utilizava:

```text
VITE_OPENROUTER_API_KEY
```

no contexto client-side.

Variáveis `VITE_*` fazem parte do ambiente destinado ao bundle do frontend. Portanto, utilizar uma chave privada dessa forma permitiria que a credencial fosse disponibilizada ao código executado no navegador.

Isso criava um problema arquitetural: o cliente poderia acessar diretamente a API externa utilizando a credencial privada.

## Correção implementada

A solução foi mover a credencial para:

```text
OPENROUTER_API_KEY
```

e criar um endpoint server-side:

```text
POST /api/openrouter
```

Implementado em:

```text
src/routes/api/openrouter.ts
```

O endpoint utiliza:

```ts
const apiKey = process.env.OPENROUTER_API_KEY;
```

A credencial é então utilizada pelo servidor para realizar a chamada ao endpoint de chat completions do OpenRouter.

```text
Servidor
   │
   │ Authorization: Bearer <private key>
   ▼
OpenRouter API
```

O navegador não precisa receber a chave privada.

## Fluxo seguro

```text
┌──────────────┐
│   Browser    │
│              │
│ Virtual      │
│ Assistant    │
└──────┬───────┘
       │
       │ POST /api/openrouter
       │
       ▼
┌──────────────────────┐
│ TanStack Start       │
│ Server Handler       │
│                      │
│ process.env.         │
│ OPENROUTER_API_KEY   │
└──────────┬───────────┘
           │
           │ Authorization: Bearer <private key>
           ▼
┌──────────────────────┐
│      OpenRouter      │
│      API             │
└──────────────────────┘
```

Esse desenho estabelece uma separação clara entre:

- código executado pelo usuário;
- endpoint interno da aplicação;
- credencial privada;
- serviço externo de IA.

## Responsabilidade do proxy

O endpoint server-side atualmente:

1. verifica se `OPENROUTER_API_KEY` está configurada;
2. recebe o payload da requisição;
3. encaminha o payload para o endpoint de chat completions do OpenRouter;
4. adiciona a autorização utilizando a chave privada;
5. devolve a resposta do OpenRouter ao cliente;
6. retorna `500` quando a chave não está configurada;
7. retorna `502` quando ocorre falha de comunicação com o OpenRouter.

O proxy também define `HTTP-Referer` e `X-Title` na chamada externa.

## 6. Supabase

O projeto utiliza `@supabase/supabase-js`.

O cliente é inicializado em:

```text
src/lib/supabase.ts
```

As configurações públicas são obtidas através de variáveis de ambiente destinadas ao frontend:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

A integração com Supabase é distinta da credencial privada do OpenRouter: a arquitetura não trata uma configuração pública/anon do Supabase da mesma forma que uma secret key de serviço.

## 7. TanStack Start e roteamento

A aplicação utiliza TanStack Start integrado ao Vite.

A configuração do projeto registra:

- TanStack Start;
- TanStack Router;
- React;
- Tailwind CSS;
- resolução de paths via `vite-tsconfig-paths`.

As rotas são organizadas em:

```text
src/routes/
```

O `routeTree.gen.ts` representa a árvore de rotas gerada pelo TanStack Router.

## 8. Área administrativa

A aplicação possui uma rota administrativa:

```text
/admin
```

implementada em:

```text
src/routes/admin.tsx
```

A área administrativa concentra funcionalidades relacionadas ao gerenciamento do conteúdo do projeto.

## 9. Assistente virtual

O assistente está implementado em:

```text
src/components/cardapio/VirtualAssistant.tsx
```

Além da interação conversacional, o componente possui um fluxo de montagem de kits baseado em estados e opções sequenciais.

O fluxo permite selecionar informações como:

- plano;
- linha de produtos;
- porção;
- restrições;
- ações relacionadas ao cardápio;
- contato via WhatsApp.

Quando a integração com IA é utilizada, a comunicação externa deve passar pelo proxy server-side descrito anteriormente.

## 10. Configuração de ambiente

As principais configurações utilizadas pelo projeto incluem:

```env
OPENROUTER_API_KEY=
VITE_OPENROUTER_MODEL=

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### Regra importante

A seguinte variável contém uma credencial privada:

```env
OPENROUTER_API_KEY=
```

Ela deve existir somente no ambiente do servidor.

Não deve ser convertida em variável `VITE_*`.

## 11. Build e desenvolvimento

Instalação:

```bash
npm install
```

Desenvolvimento:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Os scripts estão definidos no `package.json`.

## 12. Deploy

O repositório possui configuração específica para Vercel através de:

```text
vercel.json
```

O arquivo atualmente define uma regra de rewrite para direcionar as requisições para a aplicação.

O código também referencia:

```text
https://irenecomidasaudavel.com.br
```

como `HTTP-Referer` na integração com OpenRouter.

O status público atual desse domínio não foi considerado comprovado durante esta auditoria e, portanto, não deve ser documentado como deploy ativo sem uma validação posterior.

## 13. Considerações de segurança

A principal correção arquitetural do projeto foi retirar a credencial privada do OpenRouter do ambiente client-side.

### Antes

```text
Browser
   │
   ├── API key privada
   │
   └──────────────► OpenRouter
```

### Depois

```text
Browser
   │
   │ sem API key privada
   ▼
/api/openrouter
   │
   │ API key armazenada no servidor
   ▼
OpenRouter
```

Essa mudança reduz a superfície de exposição da credencial e estabelece uma fronteira clara entre frontend e integração privada com serviço externo.

## 14. Limitações conhecidas

Esta documentação descreve somente comportamentos comprovados no código atual.

Não são assumidos:

- testes automatizados inexistentes;
- métricas de performance não medidas;
- disponibilidade do deploy sem validação;
- cobertura de testes;
- garantias de segurança além do fluxo efetivamente implementado;
- funcionalidades que não estejam presentes na implementação atual.

A documentação deve permanecer sincronizada com a implementação real do projeto.
