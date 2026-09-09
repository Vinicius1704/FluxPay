import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateFluxpayCoreTables extends BaseSchema {
  async up() {
    this.schema.createTable('organizations', (table) => {
      table.increments('id').primary()
      table.string('name', 160).notNullable()
      table.string('slug', 120).notNullable().unique()
      table.string('default_currency', 3).notNullable().defaultTo('BRL')
      table.timestamps(true, true)
    })

    this.schema.alterTable('users', (table) => {
      table.string('locale', 5).notNullable().defaultTo('pt')
      table.boolean('is_platform_admin').notNullable().defaultTo(false)
    })

    this.schema.createTable('memberships', (table) => {
      table.increments('id').primary()
      table
        .integer('organization_id')
        .unsigned()
        .notNullable()
        .references('organizations.id')
        .onDelete('CASCADE')
      table.integer('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')
      table.string('role', 24).notNullable()
      table.timestamps(true, true)
      table.unique(['organization_id', 'user_id'])
    })

    this.schema.createTable('customers', (table) => {
      table.increments('id').primary()
      table
        .integer('organization_id')
        .unsigned()
        .notNullable()
        .references('organizations.id')
        .onDelete('CASCADE')
      table.string('kind', 2).notNullable()
      table.string('display_name', 180).notNullable()
      table.string('tax_id', 24).nullable()
      table.string('locale', 5).notNullable().defaultTo('pt')
      table.string('general_contact_name', 140).nullable()
      table.string('general_email', 254).nullable()
      table.string('general_phone', 32).nullable()
      table.string('finance_contact_name', 140).nullable()
      table.string('finance_email', 254).nullable()
      table.string('finance_phone', 32).nullable()
      table.timestamps(true, true)
      table.index(['organization_id', 'display_name'])
    })

    this.schema.createTable('recurring_plans', (table) => {
      table.increments('id').primary()
      table
        .integer('organization_id')
        .unsigned()
        .notNullable()
        .references('organizations.id')
        .onDelete('CASCADE')
      table
        .integer('customer_id')
        .unsigned()
        .notNullable()
        .references('customers.id')
        .onDelete('CASCADE')
      table.string('description', 180).notNullable()
      table.integer('amount_minor').notNullable()
      table.string('currency', 3).notNullable()
      table.integer('due_day').notNullable()
      table.date('next_charge_on').notNullable()
      table.boolean('active').notNullable().defaultTo(true)
      table.timestamps(true, true)
    })

    this.schema.createTable('charges', (table) => {
      table.increments('id').primary()
      table
        .integer('organization_id')
        .unsigned()
        .notNullable()
        .references('organizations.id')
        .onDelete('CASCADE')
      table
        .integer('customer_id')
        .unsigned()
        .notNullable()
        .references('customers.id')
        .onDelete('RESTRICT')
      table
        .integer('recurring_plan_id')
        .unsigned()
        .nullable()
        .references('recurring_plans.id')
        .onDelete('SET NULL')
      table.string('description', 180).notNullable()
      table.integer('amount_minor').notNullable()
      table.integer('paid_minor').notNullable().defaultTo(0)
      table.string('currency', 3).notNullable()
      table.string('status', 24).notNullable().defaultTo('open')
      table.date('due_date').notNullable()
      table.timestamp('paid_at').nullable()
      table.timestamp('cancelled_at').nullable()
      table.timestamps(true, true)
      table.index(['organization_id', 'currency', 'status', 'due_date'])
    })

    this.schema.createTable('payments', (table) => {
      table.increments('id').primary()
      table
        .integer('organization_id')
        .unsigned()
        .notNullable()
        .references('organizations.id')
        .onDelete('CASCADE')
      table
        .integer('charge_id')
        .unsigned()
        .notNullable()
        .references('charges.id')
        .onDelete('CASCADE')
      table.integer('amount_minor').notNullable()
      table.date('paid_on').notNullable()
      table.string('method', 32).notNullable()
      table.string('reference', 180).nullable()
      table.timestamps(true, true)
    })

    this.schema.createTable('reminder_rules', (table) => {
      table.increments('id').primary()
      table
        .integer('organization_id')
        .unsigned()
        .notNullable()
        .unique()
        .references('organizations.id')
        .onDelete('CASCADE')
      table.integer('days_before').notNullable().defaultTo(3)
      table.integer('days_after').notNullable().defaultTo(3)
      table.boolean('enabled').notNullable().defaultTo(true)
      table.timestamps(true, true)
    })

    this.schema.createTable('reminder_logs', (table) => {
      table.increments('id').primary()
      table
        .integer('organization_id')
        .unsigned()
        .notNullable()
        .references('organizations.id')
        .onDelete('CASCADE')
      table
        .integer('charge_id')
        .unsigned()
        .notNullable()
        .references('charges.id')
        .onDelete('CASCADE')
      table.string('event_key', 32).notNullable()
      table.string('recipient_email', 254).notNullable()
      table.string('locale', 5).notNullable()
      table.string('status', 24).notNullable().defaultTo('queued')
      table.text('failure_reason').nullable()
      table.timestamp('sent_at').nullable()
      table.timestamps(true, true)
      table.unique(['charge_id', 'event_key'])
    })

    this.schema.createTable('invitations', (table) => {
      table.increments('id').primary()
      table
        .integer('organization_id')
        .unsigned()
        .notNullable()
        .references('organizations.id')
        .onDelete('CASCADE')
      table.string('email', 254).notNullable()
      table.string('role', 24).notNullable().defaultTo('admin')
      table.string('token', 96).notNullable().unique()
      table.timestamp('expires_at').notNullable()
      table.timestamp('accepted_at').nullable()
      table.timestamps(true, true)
    })
  }

  async down() {
    for (const table of [
      'invitations',
      'reminder_logs',
      'reminder_rules',
      'payments',
      'charges',
      'recurring_plans',
      'customers',
      'memberships',
      'organizations',
    ]) {
      this.schema.dropTable(table)
    }
    this.schema.alterTable('users', (table) => {
      table.dropColumn('locale')
      table.dropColumn('is_platform_admin')
    })
  }
}
