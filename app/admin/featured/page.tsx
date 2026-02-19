import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function FeaturedAdmin() {
  const [products, items] = await Promise.all([prisma.product.findMany(), prisma.featuredSection.findMany({ orderBy: { rank: 'asc' } })]);
  return <div><h1>Homepage featured sections</h1><form action={async(fd)=>{"use server";await prisma.featuredSection.create({data:{kind:fd.get('kind') as never,itemId:String(fd.get('itemId')),rank:Number(fd.get('rank'))}});revalidatePath('/admin/featured')}} className="grid gap-2 max-w-md"><select name="kind" className="border p-2"><option value="FEATURED_CATEGORY">FEATURED_CATEGORY</option><option value="BEST_SELLER">BEST_SELLER</option><option value="NEW_ARRIVAL">NEW_ARRIVAL</option></select><select name="itemId" className="border p-2">{products.map(p=><option key={p.id} value={p.id}>{p.nameEn}</option>)}</select><input name="rank" className="border p-2" defaultValue="1"/><button className="bg-black text-white p-2">Add</button></form>{items.map(i=><p key={i.id}>{i.kind} - {i.itemId.slice(0,6)}</p>)}</div>;
}
