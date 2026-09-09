type ReminderContact = {
  locale: string
  generalEmail: string | null
  financeEmail: string | null
  financeLocale: string | null
}

export function selectReminderRecipient(contact: ReminderContact) {
  if (contact.financeEmail) {
    return { email: contact.financeEmail, locale: contact.financeLocale || contact.locale }
  }

  if (!contact.generalEmail) {
    throw new Error('A customer needs a billing email before a reminder can be sent')
  }

  return { email: contact.generalEmail, locale: contact.locale }
}
