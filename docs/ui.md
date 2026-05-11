# Padrões de UI

## Componentes

**Utilize exclusivamente componentes shadcn/ui.** Nenhum componente personalizado pode ser criado.

- Instale componentes via `npx shadcn@latest add <componente>`
- Importe sempre de `@/components/ui/<componente>`
- Não crie wrappers, variantes customizadas ou componentes próprios — adapte o layout e a composição usando apenas os componentes disponíveis no shadcn/ui

## Formatação de datas

Todas as datas devem ser formatadas com **date-fns** no formato brasileiro `dd/MM/yyyy`.

```ts
import { format } from "date-fns"

format(new Date(), "dd/MM/yyyy") // Ex.: 02/11/2025
```

Exemplos válidos: `02/11/2025`, `15/02/2026`, `23/11/2025`

Nunca exiba datas em outros formatos (ISO, americano, timestamp, etc.).
