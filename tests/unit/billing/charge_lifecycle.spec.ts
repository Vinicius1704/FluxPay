import { test } from '@japa/runner'
import { applyPayment, markOverdue } from '#services/billing/charge_lifecycle'

test.group('charge lifecycle', () => {
  test('keeps a charge partially paid until its remaining balance reaches zero', ({ assert }) => {
    const result = applyPayment({ amountMinor: 10_000, paidMinor: 4_000, dueDate: '2026-09-01' })

    assert.deepEqual(result, { paidMinor: 4_000, remainingMinor: 6_000, status: 'partially_paid' })
  })

  test('marks an open charge overdue only after its due date', ({ assert }) => {
    const status = markOverdue({ status: 'open', dueDate: '2026-09-01', today: '2026-09-02' })

    assert.equal(status, 'overdue')
  })
})
