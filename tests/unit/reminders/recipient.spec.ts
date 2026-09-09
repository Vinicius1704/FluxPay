import { test } from '@japa/runner'
import { selectReminderRecipient } from '#services/reminders/select_recipient'

test.group('reminder recipient', () => {
  test('prioritizes the finance contact and keeps its locale', ({ assert }) => {
    const recipient = selectReminderRecipient({
      locale: 'pt',
      generalEmail: 'geral@cliente.test',
      financeEmail: 'financeiro@cliente.test',
      financeLocale: 'fr',
    })

    assert.deepEqual(recipient, { email: 'financeiro@cliente.test', locale: 'fr' })
  })

  test('falls back to the general contact when finance is absent', ({ assert }) => {
    const recipient = selectReminderRecipient({
      locale: 'es',
      generalEmail: 'geral@cliente.test',
      financeEmail: null,
      financeLocale: null,
    })

    assert.deepEqual(recipient, { email: 'geral@cliente.test', locale: 'es' })
  })
})
