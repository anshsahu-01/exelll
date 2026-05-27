"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "grid" },
  { label: "Users", href: "/users", icon: "users" },
  { label: "Listings", href: "/listings", icon: "tag" },
  { label: "Orders", href: "/orders", icon: "cart" },
  { label: "Reports", href: "/reports", icon: "chart" },
  { label: "Settings", href: "/settings", icon: "gear" },
];

function NavIcon({ type, active }: { type: string; active: boolean }) {
  const stroke = active ? "#111111" : "#666666";
  if (type === "users") return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1" stroke={stroke} strokeWidth="1.8" /><circle cx="9" cy="7" r="3" stroke={stroke} strokeWidth="1.8" /><path d="M22 19v-1a4 4 0 0 0-3-3.87" stroke={stroke} strokeWidth="1.8" /><path d="M16 3.13a3 3 0 0 1 0 5.82" stroke={stroke} strokeWidth="1.8" /></svg>;
  if (type === "tag") return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 12 12 20l-8-8 8-8h8v8Z" stroke={stroke} strokeWidth="1.8" /><circle cx="16.5" cy="7.5" r="1.3" fill={stroke} /></svg>;
  if (type === "cart") return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="20" r="1.5" fill={stroke} /><circle cx="18" cy="20" r="1.5" fill={stroke} /><path d="M3 4h2l2.2 10.5a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H7" stroke={stroke} strokeWidth="1.8" /></svg>;
  if (type === "chart") return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 20h16" stroke={stroke} strokeWidth="1.8" /><path d="M7 16v-5M12 16V8M17 16v-3" stroke={stroke} strokeWidth="1.8" /></svg>;
  if (type === "gear") return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke={stroke} strokeWidth="1.8" /><path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1 1 0 0 1 0 1.4l-1.3 1.3a1 1 0 0 1-1.4 0l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V21a1 1 0 0 1-1 1h-1.8a1 1 0 0 1-1-1v-.1a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1 1 0 0 1-1.4 0L4.3 18a1 1 0 0 1 0-1.4l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H3.6a1 1 0 0 1-1-1v-1.8a1 1 0 0 1 1-1h.1a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1 1 0 0 1 0-1.4L5.6 4a1 1 0 0 1 1.4 0l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V3.3a1 1 0 0 1 1-1h1.8a1 1 0 0 1 1 1v.1a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1 1 0 0 1 1.4 0L19.7 5a1 1 0 0 1 0 1.4l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6h.1a1 1 0 0 1 1 1v1.8a1 1 0 0 1-1 1h-.1a1 1 0 0 0-.9.6Z" stroke={stroke} strokeWidth="1.4" /></svg>;
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="7" height="7" stroke={stroke} strokeWidth="1.8" /><rect x="13" y="4" width="7" height="7" stroke={stroke} strokeWidth="1.8" /><rect x="4" y="13" width="7" height="7" stroke={stroke} strokeWidth="1.8" /><rect x="13" y="13" width="7" height="7" stroke={stroke} strokeWidth="1.8" /></svg>;
}

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <aside className="w-full border-b bg-white md:h-screen md:w-64 md:border-b-0 md:border-r" style={{ borderColor: "#EEEEEE" }}>
      <div className="px-5 py-5">
        <p className="text-xs font-medium uppercase tracking-[0.16em]" style={{ color: "#666666" }}>Admin</p>
        <p className="mt-1 text-lg font-semibold" style={{ color: "#111111" }}>Control Panel</p>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-3 pb-3 md:block md:space-y-1 md:overflow-visible md:pb-0">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition"
              style={{
                color: active ? "#111111" : "#666666",
                backgroundColor: active ? "#FFFFFF" : "transparent",
                border: active ? "1px solid #FF4C3B" : "1px solid transparent",
              }}
            >
              <NavIcon type={item.icon} active={active} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 pb-4 pt-6 md:mt-auto">
        <button
          type="button"
          onClick={() => void signOut({ redirectUrl: `${window.location.origin}/login` })}
          className="w-full rounded-md px-3 py-2 text-sm font-medium transition"
          style={{ border: "1px solid #EEEEEE", color: "#FF4C3B", backgroundColor: "#FFFFFF" }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
