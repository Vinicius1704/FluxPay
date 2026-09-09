import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'
import testUtils from '@adonisjs/core/services/test_utils'
import DemoSeeder from '#database/seeders/demo_seeder'
import User from '#models/user'

test.group('demo seeder', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('creates the identity, organization and customer dataset only once', async ({ assert }) => {
    await new DemoSeeder(db.connection()).run()
    await new DemoSeeder(db.connection()).run()

    const organizations = await db.from('organizations').count('* as total').firstOrFail()
    const users = await db.from('users').count('* as total').firstOrFail()
    const customers = await db.from('customers').count('* as total').firstOrFail()
    const memberships = await db.from('memberships').count('* as total').firstOrFail()

    assert.equal(Number(organizations.total), 3)
    assert.equal(Number(users.total), 7)
    assert.equal(Number(customers.total), 21)
    assert.equal(Number(memberships.total), 6)
    assert.exists(
      await db
        .from('users')
        .where('email', 'admin@fluxpay.test')
        .where('is_platform_admin', true)
        .first()
    )
    const platformAdmin = await User.verifyCredentials('admin@fluxpay.test', 'FluxPay@123')
    assert.equal(platformAdmin.email, 'admin@fluxpay.test')
  })

  test('creates recurring plans, every charge state and non-duplicated payments', async ({
    assert,
  }) => {
    await new DemoSeeder(db.connection()).run()
    await new DemoSeeder(db.connection()).run()

    const plans = await db.from('recurring_plans').count('* as total').firstOrFail()
    const charges = await db.from('charges').count('* as total').firstOrFail()
    const paymentCount = await db.from('payments').count('* as total').firstOrFail()
    const statuses = await db.from('charges').distinct('status').orderBy('status')
    const invalidPayments = await db
      .from('payments')
      .where('amount_minor', '<=', 0)
      .count('* as total')
      .firstOrFail()

    assert.equal(Number(plans.total), 9)
    assert.equal(Number(charges.total), 36)
    assert.equal(Number(paymentCount.total), 12)
    assert.equal(Number(invalidPayments.total), 0)
    assert.sameMembers(
      statuses.map((charge) => charge.status),
      ['cancelled', 'open', 'overdue', 'paid', 'partially_paid', 'scheduled']
    )
  })

  test('creates safe reminder history, invitations and tenant-isolated records', async ({
    assert,
  }) => {
    await new DemoSeeder(db.connection()).run()
    await new DemoSeeder(db.connection()).run()

    const rules = await db.from('reminder_rules').count('* as total').firstOrFail()
    const logs = await db.from('reminder_logs').count('* as total').firstOrFail()
    const invitations = await db.from('invitations').count('* as total').firstOrFail()
    const unsafeLogs = await db
      .from('reminder_logs')
      .whereRaw("recipient_email NOT LIKE '%.test'")
      .count('* as total')
      .firstOrFail()
    const chargeMismatches = await db
      .from('charges')
      .join('customers', 'customers.id', 'charges.customer_id')
      .whereRaw('charges.organization_id <> customers.organization_id')

    assert.equal(Number(rules.total), 3)
    assert.equal(Number(logs.total), 9)
    assert.equal(Number(invitations.total), 6)
    assert.equal(Number(unsafeLogs.total), 0)
    assert.lengthOf(chargeMismatches, 0)
  })
})
