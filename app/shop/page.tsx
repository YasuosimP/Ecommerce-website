import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ShopPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams;
  const q = params.q ?? "";
  const page = Number(params.page ?? 1);
  const take = 12;
  const products = await prisma.product.findMany({
    where: { OR: [{ nameEn: { contains: q, mode: "insensitive" } }, { nameFr: { contains: q, mode: "insensitive" } }] },
    skip: (page - 1) * take,
    take,
    orderBy: { createdAt: "desc" }
  });

  return <div className="grid md:grid-cols-3 gap-4">{products.map((p)=><Link className="bg-white border rounded p-4" href={`/product/${p.slug}`} key={p.id}>{p.nameEn}</Link>)}</div>;
}
