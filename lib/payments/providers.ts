import { Order, PaymentMethod } from "@prisma/client";

export type PaymentInit = { redirectUrl?: string; reference: string; status: "PENDING" | "PROCESSING" };

export interface PaymentProvider {
  initiate(order: Order): Promise<PaymentInit>;
  verifyCallback(payload: unknown): Promise<{ ok: boolean; reference: string }>;
  getStatus(reference: string): Promise<"PENDING" | "PAID" | "FAILED">;
}

class CODProvider implements PaymentProvider {
  async initiate(order: Order) { return { reference: order.id, status: "PENDING" as const }; }
  async verifyCallback() { return { ok: true, reference: "cod" }; }
  async getStatus() { return "PENDING" as const; }
}

class EdinarProviderStub implements PaymentProvider {
  async initiate(order: Order) {
    // TODO: Implement real e-Dinar API call with EDINAR_MERCHANT_ID, EDINAR_SECRET, EDINAR_CALLBACK_URL
    return { reference: `edinar_${order.id}`, status: "PROCESSING", redirectUrl: process.env.EDINAR_REDIRECT_URL };
  }
  async verifyCallback(payload: unknown) {
    // TODO: Verify signature and transaction status from e-Dinar callback payload
    return { ok: Boolean(payload), reference: "edinar_stub" };
  }
  async getStatus() {
    // TODO: Call e-Dinar transaction status endpoint
    return "PENDING";
  }
}

class MonetiqueProviderStub implements PaymentProvider {
  async initiate(order: Order) {
    // TODO: Implement Monétique Tunisie payment initialization with MONETIQUE_* env vars
    return { reference: `monetique_${order.id}`, status: "PROCESSING", redirectUrl: process.env.MONETIQUE_REDIRECT_URL };
  }
  async verifyCallback(payload: unknown) {
    // TODO: Verify callback hash and map gateway statuses
    return { ok: Boolean(payload), reference: "monetique_stub" };
  }
  async getStatus() {
    // TODO: Implement transaction status polling endpoint call
    return "PENDING";
  }
}

export const paymentProviders: Record<PaymentMethod, PaymentProvider> = {
  COD: new CODProvider(),
  EDINAR: new EdinarProviderStub(),
  MONETIQUE: new MonetiqueProviderStub()
};
