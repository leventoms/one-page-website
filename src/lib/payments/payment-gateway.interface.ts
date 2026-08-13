/**
 * Abstraction over "whatever processes payment". Today it's Razorpay
 * (mandatory for India-first UPI support); if a second gateway is ever
 * added for international cards, only a new class is needed here.
 */
export interface CreatePaymentOrderResult {
  gatewayOrderId: string;
  amountInPaise: number;
  currency: 'INR';
}

export interface IPaymentGateway {
  createOrder(amountInPaise: number, receiptId: string): Promise<CreatePaymentOrderResult>;
  verifyWebhookSignature(rawBody: string, signatureHeader: string): boolean;
}
