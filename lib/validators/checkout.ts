import { z } from "zod";

export const checkoutSchema = z.object({
  addressId: z.string().min(1),
  phone: z.string().min(8),
  paymentMethod: z.enum(["COD", "EDINAR", "MONETIQUE"]),
  promoCode: z.string().optional()
});
