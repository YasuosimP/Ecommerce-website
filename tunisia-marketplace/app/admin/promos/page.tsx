import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function PromosAdmin() {
  const promos = await prisma.promoCode.findMany();
  return <div><h1>Promo codes</h1><form action={async(fd)=>{"use server";await prisma.promoCode.create({data:{code:String(fd.get('code')).toUpperCase(),type:fd.get('type') as never,value:String(fd.get('value')),startsAt:new Date(),endsAt:new Date(Date.now()+1000*60*60*24*30)}});revalidatePath('/admin/promos');}} className="space-y-2 max-w-md"><input name="code" className="border p-2 w-full" placeholder="CODE"/><select name="type" className="border p-2 w-full"><option value="PERCENT">PERCENT</option><option value="FIXED">FIXED</option></select><input name="value" className="border p-2 w-full" placeholder="10.000"/><button className="bg-black text-white p-2">Add</button></form>{promos.map(p=><p key={p.id}>{p.code}</p>)}</div>;
}
