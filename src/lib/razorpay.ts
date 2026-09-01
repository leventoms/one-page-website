import crypto from 'crypto';
import Razorpay from 'razorpay';

function getPaymentConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error('Missing Razorpay API keys.');
  return { keyId, keySecret };
}

export async function createRazorpayOrder(amountInPaise: number, receipt: string) {
  if (amountInPaise < 100) throw new Error('Razorpay orders must be at least 100 paise.');
  const { keyId, keySecret } = getPaymentConfig();
  const client = new Razorpay({ key_id: keyId, key_secret: keySecret });
  const order = await client.orders.create({ amount: amountInPaise, currency: 'INR', receipt });
  return { gatewayOrderId: order.id, amountInPaise, currency: 'INR' as const, keyId };
}

export function verifyRazorpayWebhook(rawBody: string, signature: string): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) throw new Error('Missing Razorpay webhook secret.');
  const expected = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
  return safelyCompare(expected, signature);
}

export function verifyRazorpayPaymentSignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): boolean {
  const { keySecret } = getPaymentConfig();
  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');
  return safelyCompare(expected, razorpaySignature);
}

function safelyCompare(expected: string, received: string): boolean {
  const actualBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}
