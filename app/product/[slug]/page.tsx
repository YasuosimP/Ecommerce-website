import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/utils";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug }, include: { images: true, variants: { include: { inventory: true } }, category: true } });
  if (!product) return notFound();
  const related = await prisma.product.findMany({ where: { categoryId: product.categoryId, NOT: { id: product.id } }, take: 4 });

  return <div className="space-y-4"><h1 className="text-2xl font-semibold">{product.nameEn}</h1><p>{money(product.price.toString())}</p><ul>{product.variants.map(v=><li key={v.id}>{v.labelEn} - stock {v.inventory?.quantity ?? 0}</li>)}</ul><h2>Related</h2>{related.map(r=><p key={r.id}>{r.nameEn}</p>)}</div>;
}
