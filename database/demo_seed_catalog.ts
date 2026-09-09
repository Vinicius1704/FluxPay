export type DemoLocale = 'pt' | 'en' | 'es' | 'fr' | 'it'
export type DemoChargeStatus =
  'scheduled' | 'open' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled'

export type DemoOrganization = {
  name: string
  slug: string
}

export type DemoUser = {
  fullName: string
  email: string
  locale: DemoLocale
  isPlatformAdmin: boolean
  organizationSlug?: string
  role?: 'admin' | 'operator'
}

export type DemoCustomer = {
  organizationSlug: string
  kind: 'pf' | 'pj'
  displayName: string
  taxId: string
  locale: DemoLocale
  generalContactName: string
  generalEmail: string
  generalPhone: string
  financeContactName: string | null
  financeEmail: string | null
  financePhone: string | null
}

export type DemoRecurringPlan = {
  organizationSlug: string
  customerTaxId: string
  description: string
  amountMinor: number
  dueDay: number
  nextChargeOffset: number
  active: boolean
}

export type DemoCharge = {
  organizationSlug: string
  customerTaxId: string
  recurringDescription: string | null
  description: string
  amountMinor: number
  paidMinor: number
  status: DemoChargeStatus
  dueDateOffset: number
  paymentMethod: 'pix' | 'boleto' | 'transferencia' | 'dinheiro' | null
  paymentReference: string | null
}

export const demoOrganizations: DemoOrganization[] = [
  { name: 'FluxPay Matriz', slug: 'fluxpay-matriz' },
  { name: 'Distribuidora Norte', slug: 'distribuidora-norte' },
  { name: 'Saúde Total', slug: 'saude-total' },
]

export const demoUsers: DemoUser[] = [
  {
    fullName: 'Administrador da Plataforma',
    email: 'admin@fluxpay.test',
    locale: 'pt',
    isPlatformAdmin: true,
  },
  {
    fullName: 'Ana Ferreira',
    email: 'ana@fluxpay-matriz.test',
    locale: 'pt',
    isPlatformAdmin: false,
    organizationSlug: 'fluxpay-matriz',
    role: 'admin',
  },
  {
    fullName: 'Bruno Costa',
    email: 'bruno@fluxpay-matriz.test',
    locale: 'pt',
    isPlatformAdmin: false,
    organizationSlug: 'fluxpay-matriz',
    role: 'operator',
  },
  {
    fullName: 'Carla Mendes',
    email: 'carla@distribuidora-norte.test',
    locale: 'es',
    isPlatformAdmin: false,
    organizationSlug: 'distribuidora-norte',
    role: 'admin',
  },
  {
    fullName: 'Diego Ramos',
    email: 'diego@distribuidora-norte.test',
    locale: 'en',
    isPlatformAdmin: false,
    organizationSlug: 'distribuidora-norte',
    role: 'operator',
  },
  {
    fullName: 'Elisa Moreau',
    email: 'elisa@saude-total.test',
    locale: 'fr',
    isPlatformAdmin: false,
    organizationSlug: 'saude-total',
    role: 'admin',
  },
  {
    fullName: 'Fabio Ricci',
    email: 'fabio@saude-total.test',
    locale: 'it',
    isPlatformAdmin: false,
    organizationSlug: 'saude-total',
    role: 'operator',
  },
]

export const demoCustomers: DemoCustomer[] = [
  {
    organizationSlug: 'fluxpay-matriz',
    kind: 'pj',
    displayName: 'Metalúrgica Almeida LTDA',
    taxId: '10000000000101',
    locale: 'pt',
    generalContactName: 'Marcos Almeida',
    generalEmail: 'contato@metalurgica-almeida.test',
    generalPhone: '+55 11 4000-1001',
    financeContactName: 'Paula Almeida',
    financeEmail: 'financeiro@metalurgica-almeida.test',
    financePhone: '+55 11 4000-1101',
  },
  {
    organizationSlug: 'fluxpay-matriz',
    kind: 'pj',
    displayName: 'Comercial Silva & Cia',
    taxId: '10000000000102',
    locale: 'pt',
    generalContactName: 'Renato Silva',
    generalEmail: 'contato@comercial-silva.test',
    generalPhone: '+55 11 4000-1002',
    financeContactName: 'Marina Silva',
    financeEmail: 'financeiro@comercial-silva.test',
    financePhone: '+55 11 4000-1102',
  },
  {
    organizationSlug: 'fluxpay-matriz',
    kind: 'pj',
    displayName: 'Padaria do Bairro',
    taxId: '10000000000103',
    locale: 'pt',
    generalContactName: 'João Freitas',
    generalEmail: 'contato@padaria-bairro.test',
    generalPhone: '+55 11 4000-1003',
    financeContactName: null,
    financeEmail: null,
    financePhone: null,
  },
  {
    organizationSlug: 'fluxpay-matriz',
    kind: 'pf',
    displayName: 'Mariana Torres',
    taxId: '10000000001',
    locale: 'pt',
    generalContactName: 'Mariana Torres',
    generalEmail: 'mariana.torres@cliente.test',
    generalPhone: '+55 11 4000-1004',
    financeContactName: null,
    financeEmail: null,
    financePhone: null,
  },
  {
    organizationSlug: 'fluxpay-matriz',
    kind: 'pj',
    displayName: 'TechSul Soluções',
    taxId: '10000000000104',
    locale: 'en',
    generalContactName: 'Lucas Young',
    generalEmail: 'hello@techsul.test',
    generalPhone: '+55 11 4000-1005',
    financeContactName: 'Aline Ramos',
    financeEmail: 'billing@techsul.test',
    financePhone: '+55 11 4000-1105',
  },
  {
    organizationSlug: 'fluxpay-matriz',
    kind: 'pf',
    displayName: 'Rafael Nogueira',
    taxId: '10000000002',
    locale: 'es',
    generalContactName: 'Rafael Nogueira',
    generalEmail: 'rafael.nogueira@cliente.test',
    generalPhone: '+55 11 4000-1006',
    financeContactName: null,
    financeEmail: null,
    financePhone: null,
  },
  {
    organizationSlug: 'fluxpay-matriz',
    kind: 'pj',
    displayName: 'Ateliê Aurora',
    taxId: '10000000000105',
    locale: 'fr',
    generalContactName: 'Sofia Lima',
    generalEmail: 'contato@atelie-aurora.test',
    generalPhone: '+55 11 4000-1007',
    financeContactName: 'Clara Lima',
    financeEmail: 'finance@atelie-aurora.test',
    financePhone: '+55 11 4000-1107',
  },
  {
    organizationSlug: 'distribuidora-norte',
    kind: 'pj',
    displayName: 'Rede Boa Compra',
    taxId: '20000000000101',
    locale: 'pt',
    generalContactName: 'Carlos Prado',
    generalEmail: 'contato@rede-boa-compra.test',
    generalPhone: '+55 21 4000-2001',
    financeContactName: 'Patrícia Prado',
    financeEmail: 'financeiro@rede-boa-compra.test',
    financePhone: '+55 21 4000-2101',
  },
  {
    organizationSlug: 'distribuidora-norte',
    kind: 'pj',
    displayName: 'Mercado Horizonte',
    taxId: '20000000000102',
    locale: 'es',
    generalContactName: 'Julio Serrano',
    generalEmail: 'hola@mercado-horizonte.test',
    generalPhone: '+55 21 4000-2002',
    financeContactName: 'Lia Serrano',
    financeEmail: 'cobros@mercado-horizonte.test',
    financePhone: '+55 21 4000-2102',
  },
  {
    organizationSlug: 'distribuidora-norte',
    kind: 'pj',
    displayName: 'Armazém Central',
    taxId: '20000000000103',
    locale: 'en',
    generalContactName: 'Peter Evans',
    generalEmail: 'contact@armazem-central.test',
    generalPhone: '+55 21 4000-2003',
    financeContactName: 'Nina Evans',
    financeEmail: 'accounts@armazem-central.test',
    financePhone: '+55 21 4000-2103',
  },
  {
    organizationSlug: 'distribuidora-norte',
    kind: 'pf',
    displayName: 'Gabriela Martins',
    taxId: '20000000001',
    locale: 'pt',
    generalContactName: 'Gabriela Martins',
    generalEmail: 'gabriela.martins@cliente.test',
    generalPhone: '+55 21 4000-2004',
    financeContactName: null,
    financeEmail: null,
    financePhone: null,
  },
  {
    organizationSlug: 'distribuidora-norte',
    kind: 'pj',
    displayName: 'Casa Verona',
    taxId: '20000000000104',
    locale: 'it',
    generalContactName: 'Luca Bianchi',
    generalEmail: 'ciao@casa-verona.test',
    generalPhone: '+55 21 4000-2005',
    financeContactName: 'Giulia Bianchi',
    financeEmail: 'contabilita@casa-verona.test',
    financePhone: '+55 21 4000-2105',
  },
  {
    organizationSlug: 'distribuidora-norte',
    kind: 'pf',
    displayName: 'Ricardo Azevedo',
    taxId: '20000000002',
    locale: 'fr',
    generalContactName: 'Ricardo Azevedo',
    generalEmail: 'ricardo.azevedo@cliente.test',
    generalPhone: '+55 21 4000-2006',
    financeContactName: null,
    financeEmail: null,
    financePhone: null,
  },
  {
    organizationSlug: 'distribuidora-norte',
    kind: 'pj',
    displayName: 'Ponto Certo Varejo',
    taxId: '20000000000105',
    locale: 'pt',
    generalContactName: 'Bruna Castro',
    generalEmail: 'contato@ponto-certo.test',
    generalPhone: '+55 21 4000-2007',
    financeContactName: 'César Castro',
    financeEmail: 'financeiro@ponto-certo.test',
    financePhone: '+55 21 4000-2107',
  },
  {
    organizationSlug: 'saude-total',
    kind: 'pj',
    displayName: 'Clínica Vida Mais',
    taxId: '30000000000101',
    locale: 'pt',
    generalContactName: 'Dra. Renata Luz',
    generalEmail: 'contato@clinica-vida-mais.test',
    generalPhone: '+55 31 4000-3001',
    financeContactName: 'Luana Luz',
    financeEmail: 'financeiro@clinica-vida-mais.test',
    financePhone: '+55 31 4000-3101',
  },
  {
    organizationSlug: 'saude-total',
    kind: 'pj',
    displayName: 'Laboratório Aurora',
    taxId: '30000000000102',
    locale: 'fr',
    generalContactName: 'Marie Laurent',
    generalEmail: 'bonjour@laboratorio-aurora.test',
    generalPhone: '+55 31 4000-3002',
    financeContactName: 'Claire Laurent',
    financeEmail: 'facturation@laboratorio-aurora.test',
    financePhone: '+55 31 4000-3102',
  },
  {
    organizationSlug: 'saude-total',
    kind: 'pj',
    displayName: 'Fisio Movimento',
    taxId: '30000000000103',
    locale: 'it',
    generalContactName: 'Marco Conti',
    generalEmail: 'ciao@fisio-movimento.test',
    generalPhone: '+55 31 4000-3003',
    financeContactName: null,
    financeEmail: null,
    financePhone: null,
  },
  {
    organizationSlug: 'saude-total',
    kind: 'pf',
    displayName: 'Beatriz Campos',
    taxId: '30000000001',
    locale: 'pt',
    generalContactName: 'Beatriz Campos',
    generalEmail: 'beatriz.campos@cliente.test',
    generalPhone: '+55 31 4000-3004',
    financeContactName: null,
    financeEmail: null,
    financePhone: null,
  },
  {
    organizationSlug: 'saude-total',
    kind: 'pj',
    displayName: 'Odonto Prime',
    taxId: '30000000000104',
    locale: 'es',
    generalContactName: 'Elena Rubio',
    generalEmail: 'hola@odonto-prime.test',
    generalPhone: '+55 31 4000-3005',
    financeContactName: 'Marta Rubio',
    financeEmail: 'pagos@odonto-prime.test',
    financePhone: '+55 31 4000-3105',
  },
  {
    organizationSlug: 'saude-total',
    kind: 'pf',
    displayName: 'Henrique Melo',
    taxId: '30000000002',
    locale: 'en',
    generalContactName: 'Henrique Melo',
    generalEmail: 'henrique.melo@cliente.test',
    generalPhone: '+55 31 4000-3006',
    financeContactName: null,
    financeEmail: null,
    financePhone: null,
  },
  {
    organizationSlug: 'saude-total',
    kind: 'pj',
    displayName: 'Centro Equilíbrio',
    taxId: '30000000000105',
    locale: 'pt',
    generalContactName: 'Paulo Reis',
    generalEmail: 'contato@centro-equilibrio.test',
    generalPhone: '+55 31 4000-3007',
    financeContactName: 'Carla Reis',
    financeEmail: 'financeiro@centro-equilibrio.test',
    financePhone: '+55 31 4000-3107',
  },
]

export const demoRecurringPlans: DemoRecurringPlan[] = [
  {
    organizationSlug: 'fluxpay-matriz',
    customerTaxId: '10000000000101',
    description: 'Mensalidade industrial',
    amountMinor: 1248000,
    dueDay: 15,
    nextChargeOffset: 19,
    active: true,
  },
  {
    organizationSlug: 'fluxpay-matriz',
    customerTaxId: '10000000000102',
    description: 'Plano comercial premium',
    amountMinor: 875000,
    dueDay: 17,
    nextChargeOffset: 21,
    active: true,
  },
  {
    organizationSlug: 'fluxpay-matriz',
    customerTaxId: '10000000000103',
    description: 'Plano varejo essencial',
    amountMinor: 398500,
    dueDay: 20,
    nextChargeOffset: 24,
    active: false,
  },
  {
    organizationSlug: 'distribuidora-norte',
    customerTaxId: '20000000000101',
    description: 'Distribuição rede mensal',
    amountMinor: 632000,
    dueDay: 18,
    nextChargeOffset: 22,
    active: true,
  },
  {
    organizationSlug: 'distribuidora-norte',
    customerTaxId: '20000000000102',
    description: 'Abastecimento regional',
    amountMinor: 459000,
    dueDay: 12,
    nextChargeOffset: 16,
    active: true,
  },
  {
    organizationSlug: 'distribuidora-norte',
    customerTaxId: '20000000000103',
    description: 'Logística recorrente',
    amountMinor: 318000,
    dueDay: 8,
    nextChargeOffset: 12,
    active: true,
  },
  {
    organizationSlug: 'saude-total',
    customerTaxId: '30000000000101',
    description: 'Gestão clínica mensal',
    amountMinor: 248000,
    dueDay: 21,
    nextChargeOffset: 25,
    active: true,
  },
  {
    organizationSlug: 'saude-total',
    customerTaxId: '30000000000102',
    description: 'Plano laboratório',
    amountMinor: 526000,
    dueDay: 10,
    nextChargeOffset: 14,
    active: true,
  },
  {
    organizationSlug: 'saude-total',
    customerTaxId: '30000000000103',
    description: 'Fisioterapia integrada',
    amountMinor: 187000,
    dueDay: 5,
    nextChargeOffset: 9,
    active: false,
  },
]

const chargeTemplates: Omit<
  DemoCharge,
  'organizationSlug' | 'customerTaxId' | 'recurringDescription' | 'description'
>[] = [
  {
    amountMinor: 840000,
    paidMinor: 840000,
    status: 'paid',
    dueDateOffset: -60,
    paymentMethod: 'pix',
    paymentReference: 'DEMO-PG-01',
  },
  {
    amountMinor: 560000,
    paidMinor: 560000,
    status: 'paid',
    dueDateOffset: -45,
    paymentMethod: 'boleto',
    paymentReference: 'DEMO-PG-02',
  },
  {
    amountMinor: 420000,
    paidMinor: 420000,
    status: 'paid',
    dueDateOffset: -30,
    paymentMethod: 'transferencia',
    paymentReference: 'DEMO-PG-03',
  },
  {
    amountMinor: 1248000,
    paidMinor: 0,
    status: 'overdue',
    dueDateOffset: -11,
    paymentMethod: null,
    paymentReference: null,
  },
  {
    amountMinor: 875000,
    paidMinor: 0,
    status: 'overdue',
    dueDateOffset: -9,
    paymentMethod: null,
    paymentReference: null,
  },
  {
    amountMinor: 632000,
    paidMinor: 0,
    status: 'overdue',
    dueDateOffset: -8,
    paymentMethod: null,
    paymentReference: null,
  },
  {
    amountMinor: 398500,
    paidMinor: 0,
    status: 'overdue',
    dueDateOffset: -5,
    paymentMethod: null,
    paymentReference: null,
  },
  {
    amountMinor: 526000,
    paidMinor: 200000,
    status: 'partially_paid',
    dueDateOffset: -3,
    paymentMethod: 'pix',
    paymentReference: 'DEMO-PP-08',
  },
  {
    amountMinor: 318000,
    paidMinor: 0,
    status: 'open',
    dueDateOffset: 0,
    paymentMethod: null,
    paymentReference: null,
  },
  {
    amountMinor: 187000,
    paidMinor: 0,
    status: 'open',
    dueDateOffset: 4,
    paymentMethod: null,
    paymentReference: null,
  },
  {
    amountMinor: 459000,
    paidMinor: 0,
    status: 'scheduled',
    dueDateOffset: 15,
    paymentMethod: null,
    paymentReference: null,
  },
  {
    amountMinor: 215000,
    paidMinor: 0,
    status: 'cancelled',
    dueDateOffset: -10,
    paymentMethod: null,
    paymentReference: null,
  },
]

const chargeCustomers = [
  ['10000000000101', '10000000000102', '10000000000103', '10000000000101'],
  ['20000000000101', '20000000000102', '20000000000103', '20000000000101'],
  ['30000000000101', '30000000000102', '30000000000103', '30000000000101'],
]

const chargePlanDescriptions = [
  ['Mensalidade industrial', 'Plano comercial premium', 'Plano varejo essencial'],
  ['Distribuição rede mensal', 'Abastecimento regional', 'Logística recorrente'],
  ['Gestão clínica mensal', 'Plano laboratório', 'Fisioterapia integrada'],
]

export const demoCharges: DemoCharge[] = demoOrganizations.flatMap(
  (organization, organizationIndex) =>
    chargeTemplates.map((template, templateIndex) => {
      const customerTaxId = chargeCustomers[organizationIndex][templateIndex % 4]
      const recurringDescription =
        templateIndex === 11 ? null : chargePlanDescriptions[organizationIndex][templateIndex % 3]
      return {
        ...template,
        organizationSlug: organization.slug,
        customerTaxId,
        recurringDescription,
        description: `Cobrança demonstrativa ${organizationIndex + 1}-${String(templateIndex + 1).padStart(2, '0')}`,
        paymentReference: template.paymentReference
          ? `${template.paymentReference}-${organizationIndex + 1}`
          : null,
      }
    })
)
