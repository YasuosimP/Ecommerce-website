import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { money } from "@/lib/utils";

export default async function CartPage() {
  const session = await auth();
  if (!session?.user?.email) return <p>Cart is stored locally before login. <Link href="/auth/signin">Sign in</Link> to sync.</p>;
  const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { cart: { include: { items: { include: { variant: { include: { product: true } } } } } } } });
  const items = user?.cart?.items ?? [];
  return <div><h1>Cart</h1>{items.map((i)=><p key={i.id}>{i.variant.product.nameEn} x {i.quantity} ({money((Number(i.variant.price ?? i.variant.product.price)*i.quantity).toFixed(3))})</p>)}<Link href="/checkout">Go to checkout</Link></div>;
}
