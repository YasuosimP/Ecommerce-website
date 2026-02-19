import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Tunisia Marketplace",
  description: "Single-vendor Tunisian e-commerce",
  openGraph: { title: "Tunisia Marketplace", description: "Shop in TND" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <div className="container flex items-center justify-between py-4">
            <Link href="/" className="font-bold text-xl text-brand">Tunisia Marketplace</Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/shop">Shop</Link>
              <Link href="/cart">Cart</Link>
              <Link href="/account">Account</Link>
              <Link href="/admin">Admin</Link>
            </nav>
          </div>
        </header>
        <main className="container py-8">{children}</main>
      </body>
    </html>
  );
}
