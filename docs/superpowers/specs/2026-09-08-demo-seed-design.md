# FluxPay — Seed de demonstração

## Objetivo

Disponibilizar uma base PostgreSQL segura e coerente para demonstrar e testar
o MVP. O seed deve preencher todas as entidades do domínio sem enviar e-mails,
acessar serviços externos ou criar duplicatas quando executado novamente.

## Execução

- Comando: `pnpm exec node ace db:seed`
- Ambiente: PostgreSQL configurado em `.env`.
- Reexecução: os registros de demonstração são identificados por e-mails,
  slugs, documentos de teste, descrição e referências determinísticas. O seed
  atualiza ou reutiliza esses registros e não multiplica relações, pagamentos
  ou logs.
- Segurança: todos os e-mails usam exclusivamente `*.test`; senhas de
  demonstração são passadas pelo hash do Adonis e nunca são exibidas pelo
  comando.

## Conjunto de dados

### Plataforma e organizações

| Entidade | Registros |
| --- | --- |
| Administrador de plataforma | `admin@fluxpay.test` |
| Organizações | FluxPay Matriz, Distribuidora Norte e Saúde Total |
| Usuários de empresa | Um administrador e um operador por organização |
| Memberships | Papel `admin` ou `operator`, sempre associados à própria organização |

### Clientes

Cada organização terá clientes PF e PJ, contatos gerais e financeiros,
telefones, idioma e documento de teste. O conjunto conterá pelo menos 20
clientes, distribuídos entre `pt`, `en`, `es`, `fr` e `it`. O e-mail financeiro
será diferente do geral na maior parte dos casos para exercitar a prioridade de
destinatário.

### Mensalidades e cobranças

As três organizações terão mensalidades ativas e inativas em BRL. As cobranças
usarão a mesma moeda por organização e representarão todos os estados do MVP:

| Estado | Cenário |
| --- | --- |
| `scheduled` | Próximo ciclo ainda não exigível |
| `open` | Cobrança a vencer ou vencendo hoje |
| `partially_paid` | Valor recebido menor que o valor original |
| `paid` | Cobrança quitada e data de pagamento preenchida |
| `overdue` | Vencimento anterior a hoje com saldo em aberto |
| `cancelled` | Cobrança cancelada, sem pagamento |

O dataset terá pelo menos 36 cobranças: série histórica de recebimentos,
cobranças de hoje, itens vencidos há 3, 5, 8, 9 e 11 dias e itens futuros. As
cobranças em atraso produzirão a lista e os valores do dashboard de forma
crível; os pagamentos parciais terão saldo remanescente calculável.

### Pagamentos e lembretes

- Pagamentos manuais incluem dinheiro, transferência, boleto e Pix, com data,
  referência e valor em unidade monetária menor.
- Cada organização recebe regras de lembrete configuráveis para D-3, D0 e
  D+3.
- Logs incluem envios bem-sucedidos, pendentes e uma falha controlada. Cada
  combinação `(charge_id, event_key)` é única e reflete a proteção de
  idempotência do domínio.

## Integridade e isolamento

- Todo registro dependente carrega o `organization_id` correto.
- Uma cobrança referencia cliente, mensalidade quando recorrente, e pagamentos
  da mesma organização.
- Valores monetários são inteiros em centavos e a moeda é sempre `BRL`.
- Não há conversão cambial, e-mails reais, chamadas SMTP, Redis ou APIs.

## Implementação proposta

1. Criar um seeder Adonis com helpers pequenos para usuário, organização,
   cliente, cobrança, pagamento e logs.
2. Usar chaves naturais de demonstração para buscar ou criar cada registro.
3. Executar os dados em transação, respeitando a ordem de chaves estrangeiras.
4. Criar teste de integração que rode o seeder duas vezes e verifique contagens
   estáveis, presença de todos os estados de cobrança e isolamento de dados.
5. Documentar credenciais e comandos de demonstração no README.

## Critérios de aceite

- `pnpm exec node ace db:seed` funciona após as migrations.
- Duas execuções mantêm as mesmas contagens.
- Há dados em todos os estados de cobrança e em todas as entidades do MVP.
- Os e-mails são somente `.test`.
- Os testes, tipos, lint e build continuam passando.
