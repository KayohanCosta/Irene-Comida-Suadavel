# 🌿 Irene Comida Saudável

[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/) [![TypeScript 5.8](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Vite 7](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev/) [![Tailwind CSS 4](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/) [![TanStack Start](https://img.shields.io/badge/TanStack%20Start-1.167-FF4154)](https://tanstack.com/start) [![Supabase](https://img.shields.io/badge/Supabase-2.106-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/) [![License MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Plataforma web para apresentar o cardápio da Irene Comida Saudável, facilitar a montagem de pedidos e oferecer uma experiência digital integrada a Supabase e inteligência artificial.

## Visão geral

O Irene Comida Saudável é uma aplicação web desenvolvida para uma operação de alimentação saudável, com foco em apresentação de produtos, experiência mobile, montagem de kits e atendimento digital.

O projeto combina uma interface responsiva em React com TanStack Start, persistência via Supabase e um assistente virtual integrado ao OpenRouter.

## O problema

A experiência precisava concentrar em um único ambiente:

- apresentação do cardápio;
- descoberta e seleção de produtos;
- montagem de kits;
- comunicação com a Irene via WhatsApp;
- gerenciamento administrativo;
- suporte por inteligência artificial.

Além disso, a integração com IA precisava evitar a exposição de credenciais privadas no navegador.

## Solução

A aplicação organiza a experiência em uma landing page responsiva, cardápio interativo, assistente virtual, área administrativa e integração com serviços externos.

A integração com OpenRouter foi corrigida para utilizar um **proxy server-side**, mantendo `OPENROUTER_API_KEY` exclusivamente no ambiente do servidor.

A arquitetura técnica dessa solução está documentada em [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Stack e por quê

| Tecnologia | Uso |
|---|---|
| **React 19** | Construção da interface e componentes interativos |
| **TypeScript 5.8** | Tipagem estática e segurança no desenvolvimento |
| **Vite 7** | Desenvolvimento e build da aplicação |
| **TanStack Start** | Runtime e integração server/client |
| **TanStack Router** | Roteamento baseado em arquivos |
| **TanStack Query** | Gerenciamento de estado assíncrono |
| **Tailwind CSS 4** | Sistema visual e responsividade |
| **Supabase** | Persistência e integração com dados |
| **OpenRouter** | Integração de inteligência artificial |
| **Radix UI** | Primitivos acessíveis para componentes de interface |
| **Lucide React** | Sistema de ícones |

## Arquitetura e estrutura

```text
src/
├── assets/          # Imagens e recursos visuais
├── components/      # Componentes reutilizáveis da interface
├── hooks/           # Hooks específicos da aplicação
├── lib/             # Integrações e utilitários
├── routes/          # Rotas da aplicação
│   ├── api/         # Endpoints server-side
│   ├── admin.tsx    # Área administrativa
│   └── index.tsx    # Página principal
├── main.tsx         # Entrada da aplicação
├── router.tsx       # Configuração do router
└── styles.css       # Estilos globais
```

A arquitetura detalhada, incluindo fluxo de dados, integração com Supabase e o proxy seguro do OpenRouter, está em [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Qualidade e engenharia

O projeto utiliza uma stack moderna baseada em React + TypeScript e separa responsabilidades entre componentes, rotas, hooks e integrações.

Entre os principais pontos técnicos:

- roteamento baseado em arquivos com TanStack Router;
- integração server/client através do TanStack Start;
- persistência utilizando Supabase;
- componentes reutilizáveis;
- interface responsiva;
- integração com IA através de endpoint server-side;
- credencial privada do OpenRouter fora do código client-side;
- variáveis de ambiente para configuração de serviços externos;
- ESLint e Prettier configurados no projeto.

## Deploy

O projeto possui configuração para deploy utilizando Vercel.

O código também referencia o domínio:

**https://irenecomidasaudavel.com.br**

> Status público atual do domínio não foi confirmado durante esta auditoria. Por isso, o endereço não é apresentado como “site ativo”.

## Como rodar localmente

### Pré-requisitos

- Node.js
- npm

### Instalação

```bash
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` com as variáveis necessárias:

```env
OPENROUTER_API_KEY=sua_chave_privada
VITE_OPENROUTER_MODEL=openai/gpt-oss-120b:free

VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_do_supabase
```

A chave `OPENROUTER_API_KEY` deve permanecer exclusivamente no ambiente do servidor.

### Desenvolvimento

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Resultado

O projeto reúne uma experiência digital para uma operação de alimentação saudável, combinando apresentação de produtos, montagem de pedidos, administração de conteúdo, persistência de dados e assistência por IA.

O diferencial técnico do projeto está também na evolução da integração com inteligência artificial: a credencial privada do OpenRouter foi retirada do fluxo client-side e passou a ser utilizada por um proxy server-side.

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [`LICENSE`](LICENSE) para mais detalhes.
