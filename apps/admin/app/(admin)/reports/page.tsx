"use client";

import { PageShell } from "@/components/PageShell";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useAdminApiService } from "@/services/api";

export default function ReportsPage() {
  const api = useAdminApiService();
  const users = useAsyncData(() => api.getUsers(), [api]);
  const listings = useAsyncData(() => api.getListings(), [api]);
  const orders = useAsyncData(() => api.getOrders(), [api]);
  const loading = users.loading || listings.loading || orders.loading;
  const error = users.error || listings.error || orders.error;
  const usersCount = users.data?.length ?? 0;
  const listingsCount = listings.data?.length ?? 0;
  const ordersCount = orders.data?.length ?? 0;
  const confirmedOrders = (orders.data ?? []).filter((o) => `${o.paymentStatus}`.includes("confirmed")).length;
  const rejectedOrders = (orders.data ?? []).filter((o) => `${o.paymentStatus}`.includes("cancelled")).length;
  const pendingOrders = Math.max(ordersCount - confirmedOrders - rejectedOrders, 0);
  const maxVal = Math.max(usersCount, listingsCount, ordersCount, 1);

  return (
    <PageShell title="Reports">
      {loading ? <p className="text-sm" style={{ color: "#666666" }}>Loading analytics...</p> : null}
      {error ? <p className="text-sm" style={{ color: "#FF4C3B" }}>{error}</p> : null}
      {!loading && !error ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border bg-white p-4" style={{ borderColor: "#EEEEEE" }}><p className="text-xs uppercase tracking-wide" style={{ color: "#666666" }}>Users</p><p className="mt-2 text-2xl font-semibold" style={{ color: "#111111" }}>{usersCount}</p></div>
            <div className="rounded-lg border bg-white p-4" style={{ borderColor: "#EEEEEE" }}><p className="text-xs uppercase tracking-wide" style={{ color: "#666666" }}>Listings</p><p className="mt-2 text-2xl font-semibold" style={{ color: "#111111" }}>{listingsCount}</p></div>
            <div className="rounded-lg border bg-white p-4" style={{ borderColor: "#EEEEEE" }}><p className="text-xs uppercase tracking-wide" style={{ color: "#666666" }}>Orders</p><p className="mt-2 text-2xl font-semibold" style={{ color: "#111111" }}>{ordersCount}</p></div>
            <div className="rounded-lg border bg-white p-4" style={{ borderColor: "#EEEEEE" }}><p className="text-xs uppercase tracking-wide" style={{ color: "#666666" }}>Conversion</p><p className="mt-2 text-2xl font-semibold" style={{ color: "#111111" }}>{ordersCount > 0 ? Math.round((confirmedOrders / ordersCount) * 100) : 0}%</p></div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border bg-white p-4" style={{ borderColor: "#EEEEEE" }}>
              <h3 className="text-sm font-semibold" style={{ color: "#111111" }}>Volume Comparison</h3>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Users", value: usersCount },
                  { label: "Listings", value: listingsCount },
                  { label: "Orders", value: ordersCount },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between text-xs" style={{ color: "#666666" }}>
                      <span>{item.label}</span><span>{item.value}</span>
                    </div>
                    <div className="h-2 rounded" style={{ backgroundColor: "#EEEEEE" }}>
                      <div className="h-2 rounded" style={{ width: `${(item.value / maxVal) * 100}%`, backgroundColor: "#111111" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border bg-white p-4" style={{ borderColor: "#EEEEEE" }}>
              <h3 className="text-sm font-semibold" style={{ color: "#111111" }}>Order Status Mix</h3>
              <div className="mt-4 space-y-2 text-sm" style={{ color: "#666666" }}>
                <div className="flex items-center justify-between rounded-md border p-2" style={{ borderColor: "#EEEEEE" }}><span>Pending</span><span>{pendingOrders}</span></div>
                <div className="flex items-center justify-between rounded-md border p-2" style={{ borderColor: "#EEEEEE" }}><span>Confirmed</span><span>{confirmedOrders}</span></div>
                <div className="flex items-center justify-between rounded-md border p-2" style={{ borderColor: "#EEEEEE" }}><span>Cancelled</span><span>{rejectedOrders}</span></div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
