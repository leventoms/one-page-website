import Razorpay from 'razorpay';
import crypto from 'crypto';
import type { CreatePaymentOrderResult, IPaymentGateway } from './payment-gateway.interface';

export class RazorpayGateway implements IPaymentGateway {
  private readonly client: Razorpay;
  private readonly webhookSecret: string;

  constructor(keyId: string, keySecret: string, webhookSecret: string) {
    this.client = new Razorpay({ key_id: keyId, key_secret: keySecret });
    this.webhookSecret = webhookSecret;
  }

  async createOrder(amountInPaise: number, receiptId: string): Promise<CreatePaymentOrderResult> {
    const order = await this.client.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
    });

    return {
      gatewayOrderId: order.id,
      amountInPaise,
      currency: 'INR',
    };
  }

  verifyWebhookSignature(rawBody: string, signatureHeader: string): boolean {
    const expected = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(rawBody)
      .digest('hex');

    // Constant-time comparison to avoid timing attacks on the signature check.
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader));
  }
}

export function createRazorpayGatewayFromEnv(): RazorpayGateway {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!keyId || !keySecret || !webhookSecret) {
    throw new Error('Missing Razorpay environment variables.');
  }

  return new RazorpayGateway(keyId, keySecret, webhookSecret);
}
