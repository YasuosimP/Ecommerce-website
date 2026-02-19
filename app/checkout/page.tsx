import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validators/checkout";
import { paymentProviders } from "@/lib/payments/providers";
import { sendOrderEmail } from "@/lib/email";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/auth/signin");
  const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { addresses: true, cart: { include: { items: { include: { variant: { include: { product: true } } } } } } } });
  if (!user) redirect("/auth/signin");

  return <form action={async (fd) => { "use server";
    const parsed = checkoutSchema.parse({ addressId: fd.get("addressId"), phone: fd.get("phone"), paymentMethod: fd.get("paymentMethod"), promoCode: fd.get("promoCode") || undefined });
    const cart = await prisma.cart.findUnique({ where: { userId: user.id }, include: { items: { include: { variant: { include: { product: true } } } } } });
    const delivery = await prisma.deliveryFee.findFirst({ where: { isDefault: true } });
    const subtotal = cart?.items.reduce((sum, i) => sum + Number(i.variant.price ?? i.variant.product.price) * i.quantity, 0) ?? 0;
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        addressId: parsed.addressId,
        paymentMethod: parsed.paymentMethod,
        subtotal: subtotal.toFixed(3),
        deliveryFee: Number(delivery?.amount ?? 7).toFixed(3),
        total: (subtotal + Number(delivery?.amount ?? 7)).toFixed(3),
        items: { create: (cart?.items ?? []).map((i) => ({ productId: i.variant.productId, variantId: i.variantId, productName: i.variant.product.nameEn, variantLabel: i.variant.labelEn, unitPrice: (i.variant.price ?? i.variant.product.price).toString(), quantity: i.quantity })) }
      }
    });
    await paymentProviders[parsed.paymentMethod].initiate(order);
    await sendOrderEmail(user.email, order.id);
    await prisma.cartItem.deleteMany({ where: { cartId: cart?.id } });
    redirect(`/orders/${order.id}`);
  }} className="space-y-3 max-w-xl">
    <h1>Checkout</h1>
    <select name="addressId" className="w-full border p-2 rounded">{user.addresses.map(a=><option key={a.id} value={a.id}>{a.line1}, {a.city}</option>)}</select>
    <input className="w-full border p-2 rounded" name="phone" placeholder="Phone" />
    <select className="w-full border p-2 rounded" name="paymentMethod"><option value="COD">COD</option><option value="EDINAR">e-Dinar</option><option value="MONETIQUE">Monétique</option></select>
    <button className="rounded bg-brand px-4 py-2 text-white">Place order</button>
  </form>;
}
