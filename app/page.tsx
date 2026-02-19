import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/utils";

export default async function Home() {
  const featured = await prisma.featuredSection.findMany({ take: 8, orderBy: { rank: "asc" } });
  const productIds = featured.map((f) => f.itemId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } }, include: { images: true } });

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-r from-teal-700 to-teal-500 p-8 text-white">
        <h1 className="text-3xl font-bold">Modern shopping for Tunisia</h1>
        <p>Pay in TND with COD, e-Dinar, and Monétique-ready checkout.</p>
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold">Best sellers & new arrivals</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {products.map((p) => (
            <Link key={p.id} href={`/product/${p.slug}`} className="rounded-xl border bg-white p-4">
              <p className="font-medium">{p.nameEn}</p>
              <p className="text-sm text-slate-500">{money(p.price.toString())}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
