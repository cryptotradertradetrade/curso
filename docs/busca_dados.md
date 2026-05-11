# Padrões de Busca de Dados

## Regra Principal

**TODAS as buscas de dados da aplicação DEVEM ser feitas exclusivamente em Server Components.**

Nunca busque dados em arquivos de cliente (`'use client'`). Componentes de cliente recebem dados como props, passados por Server Components.

## Isolamento de Dados por Usuário

Esta é a regra mais crítica de segurança da aplicação:

**O usuário autenticado deve ter acesso EXCLUSIVAMENTE aos seus próprios dados.**

- Toda query ao banco de dados DEVE incluir o filtro pelo `userId` do usuário logado.
- Nunca confie em parâmetros de URL, body ou query string para identificar o dono dos dados — use sempre a sessão autenticada.
- Antes de retornar qualquer registro, valide que ele pertence ao usuário da sessão atual.

### Exemplo correto

```ts
// src/app/dashboard/page.tsx (Server Component)
import { auth } from '@/lib/auth'
import { getTransacoesByUsuario } from '@/lib/data/transacoes'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const transacoes = await getTransacoesByUsuario(session.user.id)
  return <DashboardClient transacoes={transacoes} />
}
```

### Exemplo errado — NUNCA faça isso

```ts
// ❌ busca de dados em Client Component
'use client'
useEffect(() => {
  fetch('/api/transacoes?userId=123').then(...)
}, [])

// ❌ confiar no userId vindo do cliente
async function getTransacoes(userId: string) { // userId vem de params/body
  return db.select().from(transacoes).where(eq(transacoes.userId, userId))
}
```

## Funções Helper com Drizzle ORM

Todas as funções de busca devem ser implementadas como helpers em `src/lib/data/`. **Nunca** escreva queries Drizzle diretamente nas páginas ou layouts.

### Estrutura dos helpers

```ts
// src/lib/data/transacoes.ts
import { db } from '@/lib/db'
import { transacoes } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function getTransacoesByUsuario(userId: string) {
  return db
    .select()
    .from(transacoes)
    .where(eq(transacoes.userId, userId))
}

export async function getTransacaoPorId(id: string, userId: string) {
  const [result] = await db
    .select()
    .from(transacoes)
    .where(and(eq(transacoes.id, id), eq(transacoes.userId, userId)))
  return result ?? null
}
```

- Todo helper que busca um registro por ID **deve** receber o `userId` e aplicar o filtro com `and(eq(...id), eq(...userId))`.
- Helpers nunca lançam exceções não tratadas — retorne `null` ou array vazio em vez de deixar propagar erros de "não encontrado".

## Fluxo Correto de Dados

```
Banco de Dados
     │
     ▼
Helper (src/lib/data/*.ts)   ← única camada que toca o Drizzle
     │
     ▼
Server Component (page.tsx / layout.tsx)   ← única camada que chama os helpers
     │
     ▼  (props)
Client Component ('use client')   ← apenas exibe, nunca busca
```

## Checklist antes de criar ou revisar uma busca de dados

- [ ] A busca está em um Server Component (sem `'use client'` no arquivo)?
- [ ] A função helper está em `src/lib/data/`?
- [ ] A query usa Drizzle ORM via helper — sem SQL raw ou chamadas diretas ao `db` fora dos helpers?
- [ ] O `userId` vem da sessão autenticada (não de parâmetros externos)?
- [ ] Toda query filtra por `userId` para garantir isolamento dos dados?
- [ ] Buscas por ID validam que o registro pertence ao usuário logado?
