import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.email) return <Link href="/auth/signin">Sign in</Link>;
  const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { addresses: true, orders: { orderBy: { createdAt: "desc" }, take: 10 } } });
  return <div className="space-y-4"><h1>My account</h1><p>{user?.email}</p><h2>Addresses</h2>{user?.addresses.map(a=><p key={a.id}>{a.city}, {a.governorate}</p>)}<h2>Orders</h2>{user?.orders.map(o=><p key={o.id}>{o.id} - {o.status}</p>)}</div>;
}
