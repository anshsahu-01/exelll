'use client';

import { useEffect } from 'react';

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('DASHBOARD_ERROR_BOUNDARY', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-red-900">Something went wrong</h1>
        <p className="mt-2 text-sm text-red-800">There was a problem loading the dashboard. Please try again.</p>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Reload dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
