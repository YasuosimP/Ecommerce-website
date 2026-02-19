import { NextResponse } from "next/server";
import { paymentProviders } from "@/lib/payments/providers";

export async function POST(req: Request) {
  const payload = await req.json().catch(() => ({}));
  const result = await paymentProviders.EDINAR.verifyCallback(payload);
  return NextResponse.json(result);
}
