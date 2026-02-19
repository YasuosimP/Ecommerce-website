import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default function SignUp() {
  return (
    <form action={async (fd) => { "use server"; const hash = await bcrypt.hash(String(fd.get("password")), 10); await prisma.user.create({ data: { email: String(fd.get("email")), passwordHash: hash, name: String(fd.get("name")) } }); redirect("/auth/signin"); }} className="max-w-md space-y-3">
      <input className="w-full rounded border p-2" name="name" placeholder="name" />
      <input className="w-full rounded border p-2" name="email" placeholder="email" />
      <input className="w-full rounded border p-2" type="password" name="password" placeholder="password" />
      <button className="rounded bg-brand px-4 py-2 text-white">Create account</button>
    </form>
  );
}
