import { test } from '@japa/runner'
import {
  demoCharges,
  demoCustomers,
  demoOrganizations,
  demoRecurringPlans,
} from '#database/demo_seed_catalog'

test.group('demo seed catalog', () => {
  test('covers the complete safe demo dataset', ({ assert }) => {
    assert.lengthOf(demoOrganizations, 3)
    assert.lengthOf(demoCustomers, 21)
    assert.lengthOf(demoRecurringPlans, 9)
    assert.isAtLeast(demoCharges.length, 36)

    assert.sameMembers([...new Set(demoCharges.map((charge) => charge.status))].sort(), [
      'cancelled',
      'open',
      'overdue',
      'paid',
      'partially_paid',
      'scheduled',
    ])
    assert.sameMembers([...new Set(demoCustomers.map((customer) => customer.locale))].sort(), [
      'en',
      'es',
      'fr',
      'it',
      'pt',
    ])
    assert.isTrue(
      demoCustomers.every(
        (customer) =>
          customer.generalEmail.endsWith('.test') &&
          (customer.financeEmail === null || customer.financeEmail.endsWith('.test'))
      )
    )
  })
})
