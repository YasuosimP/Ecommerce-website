import { signIn } from "@/lib/auth";

export default function SignIn() {
  return (
    <form action={async (fd) => { "use server"; await signIn("credentials", { email: fd.get("email"), password: fd.get("password"), redirectTo: "/account" }); }} className="max-w-md space-y-3">
      <input className="w-full rounded border p-2" name="email" placeholder="email" />
      <input className="w-full rounded border p-2" type="password" name="password" placeholder="password" />
      <button className="rounded bg-brand px-4 py-2 text-white">Sign in</button>
    </form>
  );
}
