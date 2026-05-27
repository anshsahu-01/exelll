"use client";

import { PageShell } from "@/components/PageShell";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useAdminApiService } from "@/services/api";

export default function DashboardPage() {
  const api = useAdminApiService();
  const { data, loading, error } = useAsyncData(() => api.getDashboardStats(), [api]);
  const cards = data ? [
    { label: "Total Users", value: data.totalUsers },
    { label: "Total Listings", value: data.totalListings },
    { label: "Total Orders", value: data.totalOrders },
    { label: "Active Listings", value: data.activeListings },
    { label: "Sold Listings", value: data.soldListings },
  ] : [];

  return (
    <PageShell title="Dashboard">
      {loading ? <p className="text-sm" style={{ color: "#666666" }}>Loading dashboard stats...</p> : null}
      {error ? <p className="text-sm" style={{ color: "#FF4C3B" }}>{error}</p> : null}
      {!loading && !error && data ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {cards.map((card) => (
              <div key={card.label} className="rounded-lg border bg-white p-4" style={{ borderColor: "#EEEEEE" }}>
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "#666666" }}>{card.label}</p>
                <p className="mt-3 text-3xl font-semibold leading-none" style={{ color: "#111111" }}>{card.value}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-lg border bg-white p-4 lg:col-span-2" style={{ borderColor: "#EEEEEE" }}>
              <h3 className="text-sm font-semibold" style={{ color: "#111111" }}>Recent Activity</h3>
              <div className="mt-3 space-y-2">
                <div className="rounded-md border p-3 text-sm" style={{ borderColor: "#EEEEEE", color: "#666666" }}>
                  {data.totalOrders} orders are currently tracked in the system.
                </div>
                <div className="rounded-md border p-3 text-sm" style={{ borderColor: "#EEEEEE", color: "#666666" }}>
                  {data.activeListings} active listings need routine moderation checks.
                </div>
                <div className="rounded-md border p-3 text-sm" style={{ borderColor: "#EEEEEE", color: "#666666" }}>
                  {data.soldListings} listings have completed sale workflow.
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-white p-4" style={{ borderColor: "#EEEEEE" }}>
              <h3 className="text-sm font-semibold" style={{ color: "#111111" }}>Health Snapshot</h3>
              <div className="mt-3 space-y-2 text-sm" style={{ color: "#666666" }}>
                <p className="rounded-md border p-2" style={{ borderColor: "#EEEEEE" }}>Users / Listings: {data.totalUsers}:{data.totalListings}</p>
                <p className="rounded-md border p-2" style={{ borderColor: "#EEEEEE" }}>Listings sold ratio: {data.totalListings > 0 ? Math.round((data.soldListings / data.totalListings) * 100) : 0}%</p>
                <p className="rounded-md border p-2" style={{ borderColor: "#EEEEEE" }}>Order volume: {data.totalOrders}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
