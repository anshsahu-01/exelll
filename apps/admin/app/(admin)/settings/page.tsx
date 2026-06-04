"use client";

import { PageShell } from "@/components/PageShell";
import { useClerk } from "@clerk/nextjs";

export default function SettingsPage() {
  const { signOut } = useClerk();
  return (
    <PageShell title="Settings">
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-lg border bg-white p-4 lg:col-span-2" style={{ borderColor: "#EEEEEE" }}>
          <h3 className="text-sm font-semibold" style={{ color: "#111111" }}>Admin Profile</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border p-3" style={{ borderColor: "#EEEEEE" }}>
              <p className="text-xs" style={{ color: "#666666" }}>Role</p>
              <p className="mt-1 text-sm font-medium" style={{ color: "#111111" }}>Primary Administrator</p>
            </div>
            <div className="rounded-md border p-3" style={{ borderColor: "#EEEEEE" }}>
              <p className="text-xs" style={{ color: "#666666" }}>Access Level</p>
              <p className="mt-1 text-sm font-medium" style={{ color: "#111111" }}>Full Operations</p>
            </div>
          </div>
        </section>
        <section className="rounded-lg border bg-white p-4" style={{ borderColor: "#EEEEEE" }}>
          <h3 className="text-sm font-semibold" style={{ color: "#111111" }}>System Status</h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-md border p-2" style={{ borderColor: "#EEEEEE" }}><span style={{ color: "#666666" }}>API</span><span style={{ color: "#111111" }}>Online</span></div>
            <div className="flex items-center justify-between rounded-md border p-2" style={{ borderColor: "#EEEEEE" }}><span style={{ color: "#666666" }}>Admin UI</span><span style={{ color: "#111111" }}>Healthy</span></div>
            <div className="flex items-center justify-between rounded-md border p-2" style={{ borderColor: "#EEEEEE" }}><span style={{ color: "#666666" }}>Last Sync</span><span style={{ color: "#111111" }}>Just now</span></div>
          </div>
        </section>
        <section className="rounded-lg border bg-white p-4" style={{ borderColor: "#EEEEEE" }}>
          <h3 className="text-sm font-semibold" style={{ color: "#111111" }}>Environment</h3>
          <div className="mt-3 space-y-2 text-sm">
            <p className="rounded-md border p-2" style={{ borderColor: "#EEEEEE", color: "#666666" }}>Mode: Production</p>
            <p className="rounded-md border p-2" style={{ borderColor: "#EEEEEE", color: "#666666" }}>Region: ap-south-1</p>
            <p className="rounded-md border p-2" style={{ borderColor: "#EEEEEE", color: "#666666" }}>Version: Admin v1</p>
          </div>
        </section>
        <section className="rounded-lg border bg-white p-4" style={{ borderColor: "#EEEEEE" }}>
          <h3 className="text-sm font-semibold" style={{ color: "#111111" }}>App Metadata</h3>
          <div className="mt-3 space-y-2 text-sm">
            <p style={{ color: "#666666" }}>Panel: Exell Admin</p>
            <p style={{ color: "#666666" }}>Theme: Clean SaaS</p>
            <p style={{ color: "#666666" }}>Updated: 2026-05-27</p>
          </div>
        </section>
        <section className="rounded-lg border bg-white p-4 lg:col-span-2" style={{ borderColor: "#EEEEEE" }}>
          <h3 className="text-sm font-semibold" style={{ color: "#111111" }}>Quick Controls</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="rounded-md px-3 py-2 text-sm" style={{ border: "1px solid #EEEEEE", color: "#111111", backgroundColor: "#FFFFFF" }} onClick={() => window.location.reload()}>Refresh Dashboard</button>
            <button className="rounded-md px-3 py-2 text-sm" style={{ border: "1px solid #EEEEEE", color: "#111111", backgroundColor: "#FFFFFF" }}>Check Notifications</button>
            <button className="rounded-md px-3 py-2 text-sm" style={{ border: "1px solid #EEEEEE", color: "#FF4C3B", backgroundColor: "#FFFFFF" }} onClick={() => void signOut({ redirectUrl: `${window.location.origin}/login` })}>Logout</button>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
