import { useMemo, useState } from 'react'
import {
  Bell,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Ellipsis,
  FileText,
  LayoutDashboard,
  ReceiptText,
  Settings,
  UsersRound,
  WalletCards,
  type LucideIcon,
} from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type Metric = { label: string; value: string; trend: string; tone: string; detail: string }
type CashPoint = { date: string; received: number; receivable: number; overdue: number }
type Action = [string, string, string, string]
type DashboardProps = {
  currency: string
  metrics: Metric[]
  cashFlow: CashPoint[]
  actions: Action[]
}

const nav: { icon: LucideIcon; label: string }[] = [
  { icon: LayoutDashboard, label: 'Visão geral' },
  { icon: FileText, label: 'Ações de hoje' },
  { icon: UsersRound, label: 'Inadimplentes' },
  { icon: ReceiptText, label: 'Cobranças' },
  { icon: UsersRound, label: 'Clientes' },
  { icon: Bell, label: 'Lembretes' },
]
const lowerNav: { icon: LucideIcon; label: string }[] = [
  { icon: WalletCards, label: 'Relatórios' },
  { icon: Settings, label: 'Configurações' },
]
const reminders = [
  ['danger', '3 cobranças para envio hoje', '09:00'],
  ['warning', 'Revisar acordo de pagamento — Cliente TechSul', '10:30'],
  ['info', 'Retorno de contato — Rede Boa Compra', '14:00'],
  ['success', 'Verificar comprovante — Clínica Vida Mais', '15:00'],
  ['neutral', 'Relatório semanal de inadimplência', '17:00'],
]

export default function Dashboard({ metrics, cashFlow, actions }: DashboardProps) {
  const [range, setRange] = useState('30 dias')
  const [active, setActive] = useState('Visão geral')
  const [menuOpen, setMenuOpen] = useState(false)
  const title = useMemo(() => (active === 'Visão geral' ? 'Olá, Administrador!' : active), [active])

  return (
    <div className="fp-app">
      <aside className={menuOpen ? 'fp-sidebar fp-sidebar-open' : 'fp-sidebar'}>
        <div className="fp-brand">
          <span className="fp-mark">
            <i />
            <i />
            <i />
          </span>
          <strong>FluxPay</strong>
        </div>
        <button className="fp-company" type="button">
          <span>Todas as empresas</span>
          <ChevronDown />
        </button>
        <nav className="fp-nav" aria-label="Navegação principal">
          {nav.map(({ icon: Icon, label }, index) => (
            <button
              type="button"
              onClick={() => setActive(label)}
              className={active === label ? 'active' : ''}
              key={label}
            >
              <Icon /> <span>{label}</span>
              {index === 1 && <b>12</b>}
            </button>
          ))}
        </nav>
        <div className="fp-sidebar-line" />
        <nav className="fp-nav fp-nav-bottom">
          {lowerNav.map(({ icon: Icon, label }) => (
            <button
              type="button"
              onClick={() => setActive(label)}
              className={active === label ? 'active' : ''}
              key={label}
            >
              <Icon /> <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="fp-sidebar-quote">
          Boa gestão
          <br />
          gera grandes
          <br />
          amanhãs.<span>▮▮▮</span>
        </div>
        <button type="button" className="fp-profile">
          <span>AF</span>
          <strong>Administrador</strong>
          <ChevronDown />
        </button>
      </aside>
      <main className="fp-main">
        <header className="fp-header">
          <div>
            <h1>{title}</h1>
            <p>Aqui está o panorama das suas cobranças hoje.</p>
          </div>
          <div className="fp-header-tools">
            <CalendarDays />
            <div>
              <strong>Segunda-feira, 26 de maio de 2025</strong>
              <span>Semana 22</span>
            </div>
            <button className="fp-icon-button" type="button" aria-label="Notificações">
              <Bell />
              <b>3</b>
            </button>
          </div>
        </header>
        <section className="fp-metrics" aria-label="Indicadores financeiros">
          {metrics.map((metric, index) => (
            <article className="fp-metric" key={metric.label}>
              <span className={`fp-metric-icon ${metric.tone}`}>
                {index === 3 ? '%' : index === 2 ? '!' : index === 1 ? '▥' : '●'}
              </span>
              <div>
                <p>{metric.label}</p>
                <strong>{metric.value}</strong>
                <small
                  className={
                    metric.trend.includes('↑') || metric.trend.includes('↓') ? 'positive' : ''
                  }
                >
                  {metric.trend} <em>{metric.detail}</em>
                </small>
              </div>
            </article>
          ))}
        </section>
        <section className="fp-dashboard-grid">
          <article className="fp-panel fp-cash-panel">
            <div className="fp-panel-heading">
              <div>
                <h2>Fluxo de caixa</h2>
                <p>Recebidos, a receber e em atraso por dia</p>
              </div>
              <div className="fp-segmented">
                {['7 dias', '30 dias', '90 dias', '12 meses'].map((item) => (
                  <button
                    type="button"
                    className={range === item ? 'selected' : ''}
                    onClick={() => setRange(item)}
                    key={item}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="fp-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cashFlow}
                  barGap={1}
                  margin={{ top: 14, right: 10, left: 0, bottom: 4 }}
                >
                  <CartesianGrid stroke="#e6ecf4" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#8290a8', fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#8290a8', fontSize: 11 }}
                    tickFormatter={(value) => `R$ ${value} mil`}
                    width={58}
                  />
                  <Tooltip cursor={{ fill: '#f6f8fc' }} />
                  <Bar dataKey="overdue" stackId="flow" fill="#f35f57" radius={[0, 0, 2, 2]} />
                  <Bar dataKey="received" stackId="flow" fill="#0ca678" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="receivable" stackId="flow" fill="#2478f5" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="fp-legend">
              <span>
                <i className="received" />
                Recebido
              </span>
              <span>
                <i className="receivable" />A receber
              </span>
              <span>
                <i className="overdue" />
                Em atraso
              </span>
            </div>
          </article>
          <article className="fp-panel fp-actions-panel">
            <div className="fp-panel-heading">
              <div>
                <h2>
                  Ações de hoje <b className="fp-count">12</b>
                </h2>
              </div>
              <button className="fp-text-button" type="button">
                Ver todas <ChevronRight />
              </button>
            </div>
            <div className="fp-action-list">
              {actions.map(([name, invoice, days, value]) => (
                <div className="fp-action-row" key={name}>
                  <span className="fp-status-dot" />
                  <div>
                    <strong>{name}</strong>
                    <small>{invoice}</small>
                    <b>{value}</b>
                  </div>
                  <span className="fp-overdue-days">{days}</span>
                  <button type="button">Registrar baixa</button>
                </div>
              ))}
            </div>
          </article>
          <article className="fp-panel fp-debtors">
            <div className="fp-panel-heading">
              <div>
                <h2>Clientes inadimplentes</h2>
                <p>Principais clientes com valores em aberto</p>
              </div>
              <button className="fp-text-button" type="button">
                Ver todos <ChevronRight />
              </button>
            </div>
            <div className="fp-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Empresa</th>
                    <th>Total em atraso</th>
                    <th>Dias em atraso</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {actions.map(([name, , days, value]) => (
                    <tr key={name}>
                      <td>{name}</td>
                      <td>FluxPay Matriz</td>
                      <td>{value}</td>
                      <td>{days.replace(' em atraso', '')}</td>
                      <td>
                        <button aria-label={`Ações para ${name}`} type="button">
                          <Ellipsis />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
          <article className="fp-panel fp-reminders">
            <div className="fp-panel-heading">
              <div>
                <h2>Lembretes</h2>
                <p>Acompanhamento dos seus lembretes</p>
              </div>
              <button className="fp-text-button" type="button">
                Ver todos <ChevronRight />
              </button>
            </div>
            <div className="fp-reminder-list">
              {reminders.map(([tone, label, time]) => (
                <div key={label}>
                  <i className={tone} />
                  <span>{label}</span>
                  <time>{time}</time>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
      <button
        type="button"
        className="fp-mobile-menu"
        aria-label="Abrir menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Building2 />
      </button>
    </div>
  )
}
