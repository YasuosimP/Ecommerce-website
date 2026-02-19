import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const order = await prisma.order.findUnique({ where: { id: (await params).id }, include: { items: true } });
  if (!order) notFound();
  return <div><h1>Order confirmed</h1><p>#{order.id}</p><p>Status: {order.status}</p></div>;
}
