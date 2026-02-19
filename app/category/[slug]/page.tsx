import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string>> }) {
  const { slug } = await params;
  const sp = await searchParams;
  const sort = sp.sort === "price_asc" ? { price: "asc" as const } : sp.sort === "price_desc" ? { price: "desc" as const } : { createdAt: "desc" as const };
  const page = Number(sp.page ?? 1);
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return <p>Not found</p>;
  const products = await prisma.product.findMany({ where: { categoryId: category.id }, orderBy: sort, take: 12, skip: (page - 1) * 12 });
  return <div><h1>{category.nameEn}</h1><div className="flex gap-2"><Link href={`?sort=latest`}>Latest</Link><Link href={`?sort=price_asc`}>Price ↑</Link><Link href={`?sort=price_desc`}>Price ↓</Link></div><div className="grid md:grid-cols-3 gap-3">{products.map(p=><Link key={p.id} href={`/product/${p.slug}`} className="border bg-white rounded p-3">{p.nameEn}</Link>)}</div></div>;
}
