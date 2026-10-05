/**
 * General-purpose email sender for platform modules.
 * Uses Resend REST API directly (same pattern as src/lib/email.ts).
 * Does NOT modify src/lib/email.ts — that file stays for existing consumers.
 */
export async function sendEmail(
  to: string,
  subject: string,
  text: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn(`[platform/email] Not configured — skipping email to ${to}: ${subject}`);
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, text }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Resend request failed (${response.status}): ${body}`);
  }
}
