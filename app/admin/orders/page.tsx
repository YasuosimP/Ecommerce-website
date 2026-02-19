import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const statuses = ["PENDING","CONFIRMED","PACKED","SHIPPED","DELIVERED","CANCELLED"] as const;

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, include: { user: true } });
  return <div><h1>Orders</h1>{orders.map(o=><form key={o.id} action={async(fd)=>{"use server";await prisma.order.update({where:{id:String(fd.get('id'))},data:{status:fd.get('status') as never}});revalidatePath('/admin/orders');}} className="flex gap-2 items-center"><input type="hidden" name="id" value={o.id}/><span>{o.id.slice(0,8)} {o.user.email}</span><select name="status" defaultValue={o.status}>{statuses.map(s=><option key={s}>{s}</option>)}</select><button>Save</button></form>)}</div>;
}
