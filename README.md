# FluxPay

MVP SaaS B2B para cobranças recorrentes, inadimplência, lembretes e baixa
manual. O projeto usa AdonisJS, React/Inertia, PostgreSQL, Redis e pnpm.

## Pré-requisitos

- Node.js 24+
- Corepack habilitado
- Docker Desktop

## Ambiente local

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm infra:up
corepack pnpm dev
```

`infra:up` também inicia o servidor de desenvolvimento em segundo plano. O
endereço em uso é gravado em `tmp/fluxpay-dev.log`; por padrão é
`http://localhost:3333`.

Serviços locais:

| Serviço | Endereço |
| --- | --- |
| Aplicação | `http://localhost:3333` |
| PostgreSQL | `localhost:5433` |
| Redis | `localhost:6380` |
| Mailpit | `http://localhost:8025` |

## Base de demonstração

O seeder é idempotente: pode executar `corepack pnpm exec node ace db:seed`
quantas vezes precisar. Ele não envia e-mails, não acessa Redis e só cria
endereços no domínio `.test`.

Para encerrar PostgreSQL, Redis e Mailpit:

```powershell
corepack pnpm infra:down
```

Credenciais locais de demonstração:

| Papel | E-mail | Senha |
| --- | --- | --- |
| Administrador da plataforma | `admin@fluxpay.test` | `FluxPay@123` |
| Admin — FluxPay Matriz | `ana@fluxpay-matriz.test` | `FluxPay@123` |
| Operador — FluxPay Matriz | `bruno@fluxpay-matriz.test` | `FluxPay@123` |
| Admin — Distribuidora Norte | `carla@distribuidora-norte.test` | `FluxPay@123` |
| Operador — Distribuidora Norte | `diego@distribuidora-norte.test` | `FluxPay@123` |
| Admin — Saúde Total | `elisa@saude-total.test` | `FluxPay@123` |
| Operador — Saúde Total | `fabio@saude-total.test` | `FluxPay@123` |

Fora do ambiente local, defina `DEMO_PASSWORD` antes de executar o seed. Não
use as credenciais demonstrativas em ambiente público.

O conjunto contém três empresas, 21 clientes PF/PJ nos idiomas `pt`, `en`,
`es`, `fr` e `it`, nove mensalidades, 36 cobranças distribuídas entre todos os
estados, 12 pagamentos, três regras de lembrete, nove logs e seis convites.

## Verificação

```powershell
corepack pnpm test
corepack pnpm run typecheck
corepack pnpm run lint
corepack pnpm run build
```
