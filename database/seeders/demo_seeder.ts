import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import Charge from '#models/charge'
import Customer from '#models/customer'
import Invitation from '#models/invitation'
import Membership from '#models/membership'
import Organization from '#models/organization'
import Payment from '#models/payment'
import RecurringPlan from '#models/recurring_plan'
import ReminderLog from '#models/reminder_log'
import ReminderRule from '#models/reminder_rule'
import User from '#models/user'
import {
  demoCharges,
  demoCustomers,
  demoOrganizations,
  demoRecurringPlans,
  demoUsers,
} from '#database/demo_seed_catalog'

export default class DemoSeeder extends BaseSeeder {
  private options = { client: this.client }

  async run() {
    const organizations = new Map<string, Organization>()
    const customers = new Map<string, Customer>()
    const customerInputs = new Map(
      demoCustomers.map((customer) => [`${customer.organizationSlug}:${customer.taxId}`, customer])
    )
    const recurringPlans = new Map<string, RecurringPlan>()
    const charges = new Map<string, Charge>()

    for (const input of demoOrganizations) {
      const organization = await Organization.firstOrCreate(
        { slug: input.slug },
        { name: input.name, slug: input.slug, defaultCurrency: 'BRL' },
        this.options
      )
      organizations.set(input.slug, organization)
    }

    const users = new Map<string, User>()
    for (const input of demoUsers) {
      const user = await User.firstOrCreate(
        { email: input.email },
        {
          fullName: input.fullName,
          email: input.email,
          password: process.env.DEMO_PASSWORD ?? 'FluxPay@123',
          locale: input.locale,
          isPlatformAdmin: input.isPlatformAdmin,
        },
        this.options
      )
      users.set(input.email, user)

      if (input.organizationSlug && input.role) {
        const organization = organizations.get(input.organizationSlug)!
        await Membership.firstOrCreate(
          { organizationId: organization.id, userId: user.id },
          { organizationId: organization.id, userId: user.id, role: input.role },
          this.options
        )
      }
    }

    for (const input of demoCustomers) {
      const organization = organizations.get(input.organizationSlug)!
      const attributes = {
        kind: input.kind,
        displayName: input.displayName,
        taxId: input.taxId,
        locale: input.locale,
        generalContactName: input.generalContactName,
        generalEmail: input.generalEmail,
        generalPhone: input.generalPhone,
        financeContactName: input.financeContactName,
        financeEmail: input.financeEmail,
        financePhone: input.financePhone,
      }
      const customer = await Customer.firstOrCreate(
        { organizationId: organization.id, taxId: input.taxId },
        { organizationId: organization.id, ...attributes },
        this.options
      )
      customers.set(`${input.organizationSlug}:${input.taxId}`, customer)
    }

    const today = DateTime.now().startOf('day')
    for (const input of demoRecurringPlans) {
      const organization = organizations.get(input.organizationSlug)!
      const customer = customers.get(`${input.organizationSlug}:${input.customerTaxId}`)!
      const recurringPlan = await RecurringPlan.firstOrCreate(
        {
          organizationId: organization.id,
          customerId: customer.id,
          description: input.description,
        },
        {
          organizationId: organization.id,
          customerId: customer.id,
          description: input.description,
          amountMinor: input.amountMinor,
          currency: 'BRL',
          dueDay: input.dueDay,
          nextChargeOn: today.plus({ days: input.nextChargeOffset }),
          active: input.active,
        },
        this.options
      )
      recurringPlans.set(`${input.organizationSlug}:${input.description}`, recurringPlan)
    }

    for (const input of demoCharges) {
      const organization = organizations.get(input.organizationSlug)!
      const customer = customers.get(`${input.organizationSlug}:${input.customerTaxId}`)!
      const dueDate = today.plus({ days: input.dueDateOffset })
      const paidAt = input.paidMinor > 0 ? dueDate.plus({ days: 1 }) : null
      const cancelledAt = input.status === 'cancelled' ? dueDate : null
      const recurringPlan = input.recurringDescription
        ? recurringPlans.get(`${input.organizationSlug}:${input.recurringDescription}`)
        : undefined
      const charge = await Charge.firstOrCreate(
        {
          organizationId: organization.id,
          customerId: customer.id,
          description: input.description,
          dueDate,
        },
        {
          organizationId: organization.id,
          customerId: customer.id,
          recurringPlanId: recurringPlan?.id ?? null,
          description: input.description,
          amountMinor: input.amountMinor,
          paidMinor: input.paidMinor,
          currency: 'BRL',
          status: input.status,
          dueDate,
          paidAt,
          cancelledAt,
        },
        this.options
      )
      charges.set(`${input.organizationSlug}:${input.description}`, charge)

      if (input.paidMinor > 0) {
        await Payment.firstOrCreate(
          { chargeId: charge.id, reference: input.paymentReference! },
          {
            organizationId: organization.id,
            chargeId: charge.id,
            amountMinor: input.paidMinor,
            paidOn: paidAt!,
            method: input.paymentMethod!,
            reference: input.paymentReference!,
          },
          this.options
        )
      }
    }

    for (const organization of organizations.values()) {
      await ReminderRule.firstOrCreate(
        { organizationId: organization.id },
        { organizationId: organization.id, daysBefore: 3, daysAfter: 3, enabled: true },
        this.options
      )
    }

    const reminderStates = [
      { eventKey: 'before_due', status: 'queued', sentAt: null, failureReason: null },
      {
        eventKey: 'due_date',
        status: 'sent',
        sentAt: today.minus({ days: 1 }),
        failureReason: null,
      },
      {
        eventKey: 'after_due',
        status: 'failed',
        sentAt: null,
        failureReason: 'Mailbox de demonstração indisponível',
      },
    ] as const
    const overdueCharges = demoCharges.filter((charge) => charge.status === 'overdue').slice(0, 3)

    for (const input of overdueCharges) {
      const charge = charges.get(`${input.organizationSlug}:${input.description}`)!
      const customerInput = customerInputs.get(`${input.organizationSlug}:${input.customerTaxId}`)!
      const organization = organizations.get(input.organizationSlug)!
      for (const reminder of reminderStates) {
        await ReminderLog.firstOrCreate(
          { chargeId: charge.id, eventKey: reminder.eventKey },
          {
            organizationId: organization.id,
            chargeId: charge.id,
            eventKey: reminder.eventKey,
            recipientEmail: customerInput.financeEmail ?? customerInput.generalEmail,
            locale: customerInput.locale,
            status: reminder.status,
            failureReason: reminder.failureReason,
            sentAt: reminder.sentAt,
          },
          this.options
        )
      }
    }

    for (const input of demoOrganizations) {
      const organization = organizations.get(input.slug)!
      for (const invitation of [
        { suffix: 'admin', role: 'admin', token: `demo-${input.slug}-admin`, acceptedAt: null },
        {
          suffix: 'operator',
          role: 'operator',
          token: `demo-${input.slug}-operator`,
          acceptedAt: today.minus({ days: 2 }),
        },
      ]) {
        await Invitation.firstOrCreate(
          { token: invitation.token },
          {
            organizationId: organization.id,
            email: `${invitation.suffix}@${input.slug}.test`,
            role: invitation.role,
            token: invitation.token,
            expiresAt: today.plus({ days: 14 }),
            acceptedAt: invitation.acceptedAt,
          },
          this.options
        )
      }
    }
  }
}
