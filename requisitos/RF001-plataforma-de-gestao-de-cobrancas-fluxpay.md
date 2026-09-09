# RF001 - Plataforma de Gestao de Cobrancas FluxPay

## Objetivo
Disponibilizar uma plataforma SaaS B2B para pequenas e medias empresas de servicos gerenciarem contas a receber recorrentes e avulsas, acompanharem a inadimplencia, registrarem baixas manuais e enviarem lembretes de cobranca no idioma do cliente. Este requisito e a linha de base funcional do produto para orientar os proximos requisitos.

## Campos
- Organizacao: obrigatoria; nome, slug unico e moeda padrao ISO 4217.
- Usuario e Vinculo: usuario com nome, e-mail unico, senha e idioma; vinculo com organizacao e papel de administrador ou operador.
- Cliente: obrigatorio; pessoa fisica ou juridica, nome, identificador fiscal opcional, idioma e contatos geral e financeiro.
- Plano Recorrente: cliente, descricao, valor em centavos, moeda ISO, dia de vencimento, proxima cobranca e situacao ativa/inativa.
- Cobranca: cliente, descricao, valor e valor pago em centavos, moeda ISO, vencimento, plano recorrente opcional e status.
- Pagamento: cobranca, valor em centavos, data, meio de pagamento e referencia opcional.
- Regra e Log de Lembrete: antecedencia e atraso em dias, habilitacao, evento, destinatario, idioma, situacao de envio, data de envio e motivo de falha.

## Regras de Negocio
- Os dados financeiros e cadastrais devem permanecer isolados por organizacao; um usuario de empresa nao pode consultar ou alterar dados de outra empresa.
- A plataforma deve distinguir o administrador da plataforma dos papeis de administrador e operador de cada organizacao.
- Clientes podem ser PF ou PJ e podem ter contato financeiro separado; o contato financeiro tem prioridade como destinatario do lembrete.
- Cobranças devem suportar os status agendada, em aberto, parcialmente paga, paga, em atraso e cancelada.
- Ao registrar pagamento, o total pago da cobranca nao pode superar o valor original; a cobranca fica paga quando o saldo atingir zero, ou parcialmente paga caso contrario.
- Cobrancas em aberto ou parcialmente pagas com vencimento anterior a data corrente devem ser classificadas como em atraso.
- Os valores devem ser armazenados por moeda, sem conversao nem consolidacao entre moedas diferentes.
- Lembretes por e-mail devem usar o idioma do contato financeiro quando informado, ou o idioma do cliente; uma cobranca nao pode gerar o mesmo evento de lembrete mais de uma vez.

## Criterios de Aceite
- Deve permitir que um usuario crie conta, entre e saia da aplicacao.
- Deve permitir manter organizacoes, usuarios vinculados, clientes PF/PJ e seus contatos de cobranca dentro do escopo da organizacao autorizada.
- Deve permitir cadastrar planos recorrentes ativos ou inativos e associar cobrancas recorrentes ou avulsas a um cliente.
- Deve registrar pagamentos parciais ou integrais e refletir corretamente o saldo e o status resultante da cobranca.
- Deve identificar cobranças vencidas como em atraso e apresentar uma fila de acoes prioritarias para o operador.
- Deve apresentar painel com recebidos, valores a receber, valores em atraso, taxa de inadimplencia, fluxo de caixa e principais inadimplentes, sempre sem misturar moedas.
- Deve configurar e acompanhar lembretes por e-mail antes e depois do vencimento, registrando destinatario, idioma, situacao e eventual falha.
- Nao deve incluir no MVP portal do cliente, WhatsApp, Pix, Pix Automatico, conciliacao/liquidacao, juros, cambio ou autoatendimento de assinaturas.

## Observacoes Tecnicas
- A referencia atual usa AdonisJS 7, React/Inertia, PostgreSQL, Redis, Tailwind CSS e shadcn/ui; a interface e os e-mails suportam pt, en, es, fr e it.
- O dashboard atual e uma representacao demonstrativa e deve evoluir para consultar dados persistidos antes de ser considerado uma visao operacional completa.
- Requisitos futuros devem complementar este RF001 sem contradizer as regras de isolamento organizacional e de preservacao da moeda.
