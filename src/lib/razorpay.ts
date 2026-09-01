import crypto from 'crypto';
import Razorpay from 'razorpay';

function getConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!keyId || !keySecret || !webhookSecret) throw new Error('Missing Razorpay environment variables.');
  return { keyId, keySecret, webhookSecret };
}

export async function createRazorpayOrder(amountInPaise: number, receipt: string) {
  const { keyId, keySecret } = getConfig();
  const client = new Razorpay({ key_id: keyId, key_secret: keySecret });
  const order = await client.orders.create({ amount: amountInPaise, currency: 'INR', receipt });
  return { gatewayOrderId: order.id, amountInPaise, currency: 'INR' as const, keyId };
}

export function verifyRazorpayWebhook(rawBody: string, signature: string): boolean {
  const { webhookSecret } = getConfig();
  const expected = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}
