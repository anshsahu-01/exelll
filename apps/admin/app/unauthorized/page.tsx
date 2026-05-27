"use client";

import { useClerk } from "@clerk/nextjs";

export default function UnauthorizedPage() {
  const { signOut } = useClerk();

  return (
    <div className="flex min-h-screen items-center justify-center p-6" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="w-full max-w-md rounded-lg border bg-white p-6 text-center" style={{ borderColor: "#EEEEEE" }}>
        <h1 className="text-lg font-semibold" style={{ color: "#111111" }}>Unauthorized</h1>
        <p className="mt-2 text-sm" style={{ color: "#666666" }}>This account is not allowed to access the admin dashboard.</p>
        <button
          type="button"
          onClick={() => void signOut({ redirectUrl: `${window.location.origin}/login` })}
          className="mt-4 rounded-md px-4 py-2 text-sm font-medium"
          style={{ border: "1px solid #EEEEEE", color: "#FF4C3B", backgroundColor: "#FFFFFF" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
