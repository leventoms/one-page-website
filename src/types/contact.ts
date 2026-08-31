/**
 * A message sent through the public contact form.
 *
 * Deliberately simpler than ManualRequest: a contact message has no id,
 * status, or persistence, because it is *delivered* (emailed to the owner, or
 * logged when email isn't configured) rather than stored and worked through a
 * pipeline. It never touches the database.
 */
export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}
