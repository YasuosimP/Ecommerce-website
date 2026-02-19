import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [orders, products, lowStock] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.product.count(),
    prisma.inventory.findMany({ where: { quantity: { lte: 5 } }, include: { variant: { include: { product: true } } } })
  ]);
  return <div className="space-y-4"><h1 className="text-2xl font-bold">Dashboard</h1><p>Total products: {products}</p><p>Recent orders: {orders.length}</p><h2>Low stock</h2>{lowStock.map(i=><p key={i.id}>{i.variant.product.nameEn} - {i.quantity}</p>)}<div className="flex gap-3"><Link href="/admin/products">Products</Link><Link href="/admin/categories">Categories</Link><Link href="/admin/orders">Orders</Link><Link href="/admin/delivery">Delivery fees</Link><Link href="/admin/promos">Promos</Link><Link href="/admin/featured">Featured</Link></div></div>;
}
