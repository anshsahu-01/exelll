"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder to avoid layout shift before hydration
    return (
      <button
        type="button"
        className="flex items-center justify-center rounded-full p-2 text-primary hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label="Toggle theme placeholder"
      >
        <div className="h-5 w-5" />
      </button>
    );
  }

  // If the resolved theme is dark, show the SunIcon (to toggle to light)
  // If the resolved theme is light, show the MoonIcon (to toggle to dark)
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center justify-center rounded-full p-2 text-primary hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200"
      aria-label="Toggle theme"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
