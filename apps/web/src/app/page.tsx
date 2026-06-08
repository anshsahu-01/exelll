export default function Home() {
  // Middleware handles the redirect for this route.
  // This is just a fallback to prevent white screens during the transition.
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-8 w-8 rounded-full border-4 border-t-transparent border-black animate-spin mb-4"></div>
        <p className="text-secondary">Loading...</p>
      </div>
    </div>
  )
}
