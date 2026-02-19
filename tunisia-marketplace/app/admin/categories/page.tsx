import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function AdminCategories() {
  const categories = await prisma.category.findMany();
  return <div><h1>Categories</h1><form action={async(fd)=>{"use server";await prisma.category.create({data:{nameEn:String(fd.get('nameEn')),nameFr:String(fd.get('nameFr')),slug:String(fd.get('slug'))}});revalidatePath('/admin/categories');}} className="space-y-2 max-w-lg"><input name="nameEn" className="border p-2 w-full"/><input name="nameFr" className="border p-2 w-full"/><input name="slug" className="border p-2 w-full"/><button className="bg-black text-white p-2">Create</button></form>{categories.map(c=><p key={c.id}>{c.nameEn}</p>)}</div>;
}
