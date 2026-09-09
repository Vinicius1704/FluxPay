# FluxPay Demo Seed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar um seed PostgreSQL idempotente e seguro que entregue uma base de demonstração completa do FluxPay.

**Architecture:** Um `BaseSeeder` orquestra um catálogo determinístico e persiste cada registro por Lucid, usando chaves naturais para reusar dados. Não chama Mail ou Redis. O teste funcional executa o seeder duas vezes no PostgreSQL de teste e consulta as tabelas reais para comprovar idempotência e isolamento.

**Tech Stack:** AdonisJS 7, Lucid ORM, PostgreSQL 17, Japa, TypeScript, Luxon e pnpm 10.

**Spec:** `docs/superpowers/specs/2026-09-08-demo-seed-design.md`

## Global Constraints

- Executar apenas contra PostgreSQL; não reintroduzir SQLite nem `better-sqlite3`.
- Usar somente e-mails terminados em `.test`.
- Usar valores inteiros em centavos e moeda `BRL`.
- Não disparar SMTP, Redis, filas ou serviços externos durante o seed.
- Reexecutar sem duplicar registros ou relações.
- Propagar o `organization_id` correto em toda relação dependente.

---

## File structure

| Arquivo | Responsabilidade |
| --- | --- |
| `database/demo_seed_catalog.ts` | Dados determinísticos de organizações, usuários, clientes, planos e cobranças. |
| `database/seeders/demo_seeder.ts` | Orquestra criação e reuso transacional com Lucid. |
| `tests/unit/database/demo_seed_catalog.spec.ts` | Cobertura do catálogo sem banco. |
| `tests/functional/database/demo_seeder.spec.ts` | Idempotência, estados, e-mails seguros e isolamento. |
| `README.md` | Comandos e credenciais para o ambiente de demonstração. |

### Task 1: Catálogo determinístico de demonstração

**Files:**
- Create: `database/demo_seed_catalog.ts`
- Test: `tests/unit/database/demo_seed_catalog.spec.ts`

**Interfaces:**
- Produces `DemoChargeStatus`, `demoOrganizations`, `demoUsers`, `demoCustomers`, `demoRecurringPlans`, and `demoCharges`.
- `DemoCharge` fields: `organizationSlug`, `customerTaxId`, `description`, `amountMinor`, `paidMinor`, `status`, `dueDateOffset`, `recurringDescription?`, `paymentMethod?`, `paymentReference?`.

- [ ] **Step 1: Write the failing test**

```ts
import { test } from '@japa/runner'
import { demoCharges, demoCustomers } from '#database/demo_seed_catalog'

test('catalog covers every charge state with test-only emails', ({ assert }) => {
  assert.sameMembers(
    [...new Set(demoCharges.map((charge) => charge.status))].sort(),
    ['cancelled', 'open', 'overdue', 'paid', 'partially_paid', 'scheduled']
  )
  assert.isAbove(demoCharges.length, 35)
  assert.isTrue(demoCustomers.every((customer) => customer.generalEmail.endsWith('.test')))
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec node ace test unit --files tests/unit/database/demo_seed_catalog.spec.ts`

Expected: FAIL because the catalog module does not exist.

- [ ] **Step 3: Write the catalog**

```ts
export type DemoChargeStatus =
  | 'scheduled' | 'open' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled'

export const demoOrganizations = [
  { name: 'FluxPay Matriz', slug: 'fluxpay-matriz' },
  { name: 'Distribuidora Norte', slug: 'distribuidora-norte' },
  { name: 'Saúde Total', slug: 'saude-total' },
] as const
```

Define 21 clientes PF/PJ nos cinco idiomas, nove mensalidades e 36 ou mais
cobranças relativas a `DateTime.now().startOf('day')`. Inclua D-11, D-9, D-8,
D-5, D-3, D0 e futuras; use apenas `.test`, descrições e referências estáveis.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec node ace test unit --files tests/unit/database/demo_seed_catalog.spec.ts`

Expected: PASS; seis estados, 36+ cobranças e todos os e-mails `.test`.

- [ ] **Step 5: Commit**

```bash
git add database/demo_seed_catalog.ts tests/unit/database/demo_seed_catalog.spec.ts
git commit -m "feat: add deterministic demo seed catalog"
```

### Task 2: Identidade, empresas e clientes idempotentes

**Files:**
- Create: `database/seeders/demo_seeder.ts`
- Modify: `app/models/organization.ts`
- Modify: `app/models/customer.ts`
- Modify: `app/models/membership.ts`
- Modify: `app/models/user.ts`
- Test: `tests/functional/database/demo_seeder.spec.ts`

**Interfaces:**
- Consumes `demoOrganizations`, `demoUsers`, `demoCustomers`.
- Produces `export default class DemoSeeder extends BaseSeeder` with `run(): Promise<void>`.

- [ ] **Step 1: Write the failing functional test**

```ts
test('creates platform identity, companies and customers once', async ({ assert }) => {
  await new DemoSeeder(app).run()
  await new DemoSeeder(app).run()
  const organizationCount = await db.from('organizations').count('* as total').first()
  const customerCount = await db.from('customers').count('* as total').first()
  assert.equal(Number(organizationCount!.total), 3)
  assert.equal(Number(customerCount!.total), 21)
  assert.exists(await db.from('users').where('email', 'admin@fluxpay.test').first())
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec node ace test functional --files tests/functional/database/demo_seeder.spec.ts`

Expected: FAIL because `DemoSeeder` is absent.

- [ ] **Step 3: Implement persistence helpers**

```ts
private async organization(input: DemoOrganization) {
  return Organization.firstOrCreate({ slug: input.slug }, {
    name: input.name, slug: input.slug, defaultCurrency: 'BRL',
  })
}

private async user(input: DemoUser) {
  return User.firstOrCreate({ email: input.email }, {
    fullName: input.fullName, email: input.email,
    password: process.env.DEMO_PASSWORD ?? 'FluxPay@123',
    locale: input.locale, isPlatformAdmin: input.isPlatformAdmin,
  })
}
```

Use `firstOrCreate` for users, organizations, memberships and customers;
membership is naturally unique by `(organization_id, user_id)`. Passwords use
the `User` model's configured hashing flow.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec node ace test functional --files tests/functional/database/demo_seeder.spec.ts`

Expected: PASS with exactly 3 companies, 21 clients and one platform admin after two runs.

- [ ] **Step 5: Commit**

```bash
git add database/seeders/demo_seeder.ts app/models tests/functional/database/demo_seeder.spec.ts
git commit -m "feat: seed demo identity and customers"
```

### Task 3: Mensalidades, cobranças e pagamentos

**Files:**
- Modify: `database/seeders/demo_seeder.ts`
- Modify: `tests/functional/database/demo_seeder.spec.ts`

**Interfaces:**
- Consumes `demoRecurringPlans`, `demoCharges` and IDs da Task 2.
- Produces planos, cobranças e pagamentos da mesma empresa.

- [ ] **Step 1: Extend the failing test**

```ts
test('creates every financial scenario without duplicate payments', async ({ assert }) => {
  await new DemoSeeder(app).run()
  await new DemoSeeder(app).run()
  const statuses = await db.from('charges').distinct('status').orderBy('status')
  assert.sameMembers(statuses.map((row) => row.status), [
    'cancelled', 'open', 'overdue', 'paid', 'partially_paid', 'scheduled',
  ])
  assert.isAbove(Number((await db.from('charges').count('* as total').first())!.total), 35)
  assert.equal(Number((await db.from('payments').where('amount_minor', '<=', 0).count('* as total').first())!.total), 0)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec node ace test functional --files tests/functional/database/demo_seeder.spec.ts`

Expected: FAIL because no plans, charges or payments are created.

- [ ] **Step 3: Implement financial persistence**

```ts
const charge = await Charge.firstOrCreate(
  { organizationId, customerId, description: input.description, dueDate },
  { recurringPlanId, amountMinor: input.amountMinor, paidMinor: input.paidMinor,
    currency: 'BRL', status: input.status, paidAt, cancelledAt }
)

if (input.paidMinor > 0) {
  await Payment.firstOrCreate(
    { chargeId: charge.id, reference: input.paymentReference },
    { organizationId, chargeId: charge.id, amountMinor: input.paidMinor,
      paidOn, method: input.paymentMethod ?? 'pix', reference: input.paymentReference }
  )
}
```

Create nine monthly plans (including inactive plans). Paid charges have
`paidMinor === amountMinor`; partial charges have `0 < paidMinor < amountMinor`;
cancelled charges have `cancelledAt` and no payment.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec node ace test functional --files tests/functional/database/demo_seeder.spec.ts`

Expected: PASS; all statuses exist, there are 36+ charges and all payments are positive and unique.

- [ ] **Step 5: Commit**

```bash
git add database/seeders/demo_seeder.ts tests/functional/database/demo_seeder.spec.ts
git commit -m "feat: seed recurring charges and payments"
```

### Task 4: Lembretes, convites e isolamento

**Files:**
- Modify: `database/seeders/demo_seeder.ts`
- Modify: `tests/functional/database/demo_seeder.spec.ts`

**Interfaces:**
- Consumes charges vencidas e contatos financeiros das Tasks 2-3.
- Produces uma regra por empresa, nove logs idempotentes e dois convites por empresa.

- [ ] **Step 1: Extend the failing test**

```ts
test('keeps reminders safe, unique and tenant-isolated', async ({ assert }) => {
  await new DemoSeeder(app).run()
  await new DemoSeeder(app).run()
  assert.equal(Number((await db.from('reminder_rules').count('* as total').first())!.total), 3)
  assert.equal(Number((await db.from('reminder_logs').whereNotLike('recipient_email', '%.test').count('* as total').first())!.total), 0)
  const mismatches = await db.from('charges').join('customers', 'customers.id', 'charges.customer_id').whereRaw('charges.organization_id <> customers.organization_id')
  assert.lengthOf(mismatches, 0)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec node ace test functional --files tests/functional/database/demo_seeder.spec.ts`

Expected: FAIL because reminder rules and logs are absent.

- [ ] **Step 3: Implement reminders and invitations**

```ts
await ReminderRule.firstOrCreate(
  { organizationId }, { organizationId, daysBefore: 3, daysAfter: 3, enabled: true }
)
await ReminderLog.firstOrCreate(
  { chargeId, eventKey: input.eventKey },
  { organizationId, chargeId, eventKey: input.eventKey, recipientEmail,
    locale, status: input.status, failureReason, sentAt }
)
```

Seed logs `queued`, `sent` and `failed` for three charges, choosing financial
email first. Seed one valid and one accepted invitation per organization with
deterministic tokens, `.test` e-mails and dates.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec node ace test functional --files tests/functional/database/demo_seeder.spec.ts`

Expected: PASS with 3 rules, 9 logs, no non-`.test` recipient and no tenant mismatch.

- [ ] **Step 5: Commit**

```bash
git add database/seeders/demo_seeder.ts tests/functional/database/demo_seeder.spec.ts
git commit -m "feat: seed demo reminders and invitations"
```

### Task 5: Operação documentada e verificação

**Files:**
- Create: `README.md`
- Modify: `tests/functional/database/demo_seeder.spec.ts`

**Interfaces:**
- Consumes `DemoSeeder` e Docker Compose.
- Produces onboarding reproduzível e teste de reexecução integral.

- [ ] **Step 1: Add a final failing reexecution assertion**

```ts
test('does not increase seeded table counts after a second run', async ({ assert }) => {
  await new DemoSeeder(app).run()
  const before = await db.from('charges').count('* as total').first()
  await new DemoSeeder(app).run()
  const after = await db.from('charges').count('* as total').first()
  assert.equal(after!.total, before!.total)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec node ace test functional --files tests/functional/database/demo_seeder.spec.ts`

Expected: FAIL before every natural key in Tasks 2-4 has idempotent persistence.

- [ ] **Step 3: Document operation**

```markdown
pnpm install --frozen-lockfile
docker compose up -d
pnpm exec node ace migration:run
pnpm exec node ace db:seed
```

Document PostgreSQL port 5433, Redis 6380, Mailpit 8025, platform admin
`admin@fluxpay.test`, local password `FluxPay@123`, and `DEMO_PASSWORD` for
non-local environments.

- [ ] **Step 4: Run final verification**

Run: `pnpm install --frozen-lockfile && pnpm exec node ace migration:run && pnpm exec node ace db:seed && pnpm exec node ace db:seed && pnpm test && pnpm run typecheck && pnpm run lint && pnpm run build`

Expected: all commands exit 0 and repeated seed counts remain stable.

- [ ] **Step 5: Commit**

```bash
git add README.md tests/functional/database/demo_seeder.spec.ts
git commit -m "docs: document FluxPay demo environment"
```
