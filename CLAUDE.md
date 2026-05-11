# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## UI e Estilo

**OBRIGATÓRIO:** Todo código gerado deve SEMPRE consultar o arquivo `docs/ui.md` antes de criar ou modificar qualquer componente, página ou elemento visual. Este arquivo define os padrões de UI do projeto e deve ser seguido rigorosamente.

## Comandos

```bash
npm run dev      # servidor de desenvolvimento em localhost:3000
npm run build    # build de produção
npm run lint     # ESLint (eslint-config-next)
```

Não há testes configurados neste projeto.

## Stack e versões

- **Next.js 16.2.6** — App Router. Leia `node_modules/next/dist/docs/` antes de escrever qualquer código; esta versão tem breaking changes em relação ao Next.js 13–15.
- **React 19.2.4** — APIs e comportamentos podem diferir do treinamento.
- **Tailwind CSS 4** — configuração via `@tailwindcss/postcss`; a sintaxe de configuração mudou em relação ao v3 (sem `tailwind.config.js` por padrão).
- **TypeScript 5** com modo estrito.

## Arquitetura

Todo o código da aplicação fica em `src/app/` seguindo o App Router do Next.js:
- `layout.tsx` — layout raiz com fontes Geist e metadados globais.
- `page.tsx` — rota raiz (`/`).

Novas rotas são pastas dentro de `src/app/` com `page.tsx`. Componentes compartilhados devem ir em `src/components/` (criar conforme necessário).
