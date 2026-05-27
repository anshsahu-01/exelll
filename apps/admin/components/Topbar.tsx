"use client";

import { useClerk } from "@clerk/nextjs";
import { useState } from "react";

export function Topbar() {
  const { signOut } = useClerk();
  const [notifCount] = useState(0);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6" style={{ borderColor: "#EEEEEE" }}>
      <div>
        <h1 className="text-sm font-semibold" style={{ color: "#111111" }}>Admin Dashboard</h1>
        <p className="text-xs" style={{ color: "#666666" }}>Operations Overview</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => window.location.reload()}
          title="Refresh"
          aria-label="Refresh"
          className="rounded-md p-2 text-xs font-medium"
          style={{ border: "1px solid #EEEEEE", color: "#111111", backgroundColor: "#FFFFFF" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 4v6h-6" stroke="#111111" strokeWidth="1.8"/><path d="M20 10a8 8 0 1 0 2.3 5.7" stroke="#111111" strokeWidth="1.8"/></svg>
        </button>
        <button
          type="button"
          title="Notifications"
          aria-label="Notifications"
          className="relative rounded-md p-2 text-xs font-medium"
          style={{ border: "1px solid #EEEEEE", color: "#111111", backgroundColor: "#FFFFFF" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 0 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" stroke="#111111" strokeWidth="1.8"/><path d="M10 20a2 2 0 0 0 4 0" stroke="#111111" strokeWidth="1.8"/></svg>
          {notifCount > 0 ? <span className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full px-1 text-[10px] leading-4 text-center" style={{ backgroundColor: "#FF4C3B", color: "#FFFFFF" }}>{notifCount}</span> : null}
        </button>
        <details className="relative">
          <summary
            title="Admin menu"
            aria-label="Admin menu"
            className="cursor-pointer list-none rounded-md p-2 text-xs font-medium"
            style={{ border: "1px solid #EEEEEE", color: "#111111", backgroundColor: "#FFFFFF" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.5" stroke="#111111" strokeWidth="1.8"/><path d="M5 20a7 7 0 0 1 14 0" stroke="#111111" strokeWidth="1.8"/></svg>
          </summary>
          <div className="absolute right-0 mt-2 w-40 rounded-md border bg-white p-2" style={{ borderColor: "#EEEEEE" }}>
            <p className="px-2 py-1 text-xs" style={{ color: "#666666" }}>Profile menu</p>
            <button
              type="button"
              onClick={() => void signOut({ redirectUrl: `${window.location.origin}/login` })}
              className="mt-1 w-full rounded-md px-2 py-2 text-left text-xs font-medium"
              style={{ color: "#FF4C3B", border: "1px solid #EEEEEE", backgroundColor: "#FFFFFF" }}
            >
              Logout
            </button>
          </div>
        </details>
      </div>
    </header>
  );
}
