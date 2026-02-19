import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function DeliveryAdmin() {
  const fees = await prisma.deliveryFee.findMany();
  return <div><h1>Delivery fees</h1><form action={async(fd)=>{"use server";await prisma.deliveryFee.create({data:{governorate:String(fd.get('governorate')||'')||null,city:String(fd.get('city')||'')||null,amount:String(fd.get('amount')),isDefault:fd.get('isDefault')==='on'}});revalidatePath('/admin/delivery');}} className="grid gap-2 max-w-md"><input name="governorate" placeholder="Governorate" className="border p-2"/><input name="city" placeholder="City" className="border p-2"/><input name="amount" placeholder="Amount" className="border p-2"/><label><input type="checkbox" name="isDefault"/> Default</label><button className="bg-black text-white p-2">Save</button></form>{fees.map(f=><p key={f.id}>{f.governorate || 'Default'} - {f.amount.toString()}</p>)}</div>;
}
