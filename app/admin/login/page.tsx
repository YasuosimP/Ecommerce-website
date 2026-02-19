import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function AdminLogin() {
  return <form action={async (fd) => {"use server";
    const username = String(fd.get("username"));
    const password = String(fd.get("password"));
    if (username !== process.env.ADMIN_USERNAME) return;
    const ok = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH ?? "");
    if (!ok) return;
    (await cookies()).set("admin_session", process.env.ADMIN_SESSION_TOKEN ?? "dev-admin-session", { httpOnly: true, sameSite: "lax" });
    redirect("/admin");
  }} className="mx-auto mt-20 max-w-sm space-y-3">
    <h1 className="text-xl font-bold">Admin Login</h1>
    <input className="w-full border p-2" name="username" placeholder="Username" />
    <input className="w-full border p-2" type="password" name="password" placeholder="Password" />
    <button className="bg-black px-4 py-2 text-white">Login</button>
  </form>;
}
