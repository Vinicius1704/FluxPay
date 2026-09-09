type DashboardAction = [string, string, string, string]

export const dashboardSeed: {
  currency: string
  metrics: { label: string; value: string; trend: string; tone: string; detail: string }[]
  cashFlow: { date: string; received: number; receivable: number; overdue: number }[]
  actions: DashboardAction[]
} = {
  currency: 'BRL',
  metrics: [
    {
      label: 'Recebido no mês',
      value: 'R$ 482.910,00',
      trend: '↑ 12%',
      tone: 'received',
      detail: 'vs. mês anterior',
    },
    {
      label: 'A receber',
      value: 'R$ 276.540,00',
      trend: '68 cobranças',
      tone: 'receivable',
      detail: '',
    },
    {
      label: 'Em atraso',
      value: 'R$ 128.360,00',
      trend: '42 cobranças',
      tone: 'overdue',
      detail: '',
    },
    {
      label: 'Taxa de inadimplência',
      value: '18,9%',
      trend: '↓ 2,4 p.p.',
      tone: 'received',
      detail: 'vs. mês anterior',
    },
  ],
  cashFlow: [
    { date: '26/abr', received: 8, receivable: 4, overdue: 1 },
    { date: '29/abr', received: 12, receivable: 8, overdue: 2 },
    { date: '02/mai', received: 18, receivable: 14, overdue: 3 },
    { date: '05/mai', received: 12, receivable: 8, overdue: 2 },
    { date: '08/mai', received: 24, receivable: 12, overdue: 4 },
    { date: '11/mai', received: 28, receivable: 18, overdue: 3 },
    { date: '14/mai', received: 12, receivable: 10, overdue: 2 },
    { date: '17/mai', received: 14, receivable: 14, overdue: 5 },
    { date: '20/mai', received: 16, receivable: 22, overdue: 6 },
    { date: '23/mai', received: 24, receivable: 30, overdue: 8 },
    { date: '26/mai', received: 30, receivable: 28, overdue: 10 },
  ],
  actions: [
    ['Metalúrgica Almeida LTDA', 'Fatura #38291 · 15/05/2025', '11 dias em atraso', 'R$ 12.480,00'],
    ['Comercial Silva & Cia', 'Fatura #38102 · 17/05/2025', '9 dias em atraso', 'R$ 8.750,00'],
    ['Rede Boa Compra', 'Fatura #37821 · 18/05/2025', '8 dias em atraso', 'R$ 6.320,00'],
    ['Padaria do Bairro', 'Fatura #37756 · 20/05/2025', '6 dias em atraso', 'R$ 3.985,00'],
    ['Clínica Vida Mais', 'Fatura #37756 · 21/05/2025', '5 dias em atraso', 'R$ 2.480,00'],
  ],
}
