export type ChargeStatus =
  'scheduled' | 'open' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled'

type PaymentInput = {
  amountMinor: number
  paidMinor: number
  dueDate: string
}

export function applyPayment({ amountMinor, paidMinor }: PaymentInput) {
  const nextPaidMinor = Math.min(amountMinor, paidMinor)
  const remainingMinor = amountMinor - nextPaidMinor

  return {
    paidMinor: nextPaidMinor,
    remainingMinor,
    status: (remainingMinor === 0 ? 'paid' : 'partially_paid') as ChargeStatus,
  }
}

export function markOverdue({
  status,
  dueDate,
  today,
}: {
  status: ChargeStatus
  dueDate: string
  today: string
}): ChargeStatus {
  if (status !== 'open' && status !== 'partially_paid') {
    return status
  }

  return dueDate < today ? 'overdue' : status
}
