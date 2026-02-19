import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function AdminProducts() {
  const [products, categories] = await Promise.all([prisma.product.findMany({ include: { variants: { include: { inventory: true } } } }), prisma.category.findMany()]);
  return <div className="space-y-4"><h1>Products CRUD</h1><form action={async (fd)=>{"use server"; await prisma.product.create({ data: { nameEn: String(fd.get("nameEn")), nameFr: String(fd.get("nameFr")), slug: String(fd.get("slug")), descriptionEn: "", descriptionFr: "", price: "10.000", categoryId: String(fd.get("categoryId")), variants: { create: [{ sku: `SKU-${Date.now()}`, labelEn: "Standard", labelFr: "Standard", inventory: { create: { quantity: 10 } } }] } } }); revalidatePath('/admin/products');}} className="grid gap-2 max-w-xl"><input name="nameEn" placeholder="Name EN" className="border p-2"/><input name="nameFr" placeholder="Name FR" className="border p-2"/><input name="slug" placeholder="slug" className="border p-2"/><select name="categoryId" className="border p-2">{categories.map(c=><option key={c.id} value={c.id}>{c.nameEn}</option>)}</select><button className="bg-black text-white p-2">Add</button></form>{products.map(p=><p key={p.id}>{p.nameEn}</p>)}</div>;
}
