import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'
import type { InferMailers } from '@adonisjs/mail/types'

const username = env.get('SMTP_USERNAME')
const password = env.get('SMTP_PASSWORD')
const smtpAuth =
  username && password ? { type: 'login' as const, user: username, pass: password } : undefined

const mailConfig = defineConfig({
  default: env.get('MAIL_MAILER'),
  from: { address: env.get('MAIL_FROM_ADDRESS'), name: env.get('MAIL_FROM_NAME') },
  globals: { brandName: 'FluxPay' },
  mailers: {
    smtp: transports.smtp({
      host: env.get('SMTP_HOST'),
      port: env.get('SMTP_PORT'),
      auth: smtpAuth,
    }),
  },
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}
