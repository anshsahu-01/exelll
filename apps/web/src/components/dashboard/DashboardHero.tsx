import Image from 'next/image'

export function DashboardHero() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border-default bg-surface mb-8">
      <Image
        src="/banner.png"
        alt="Dashboard Banner"
        width={512}
        height={128}
        className="w-full h-auto object-cover"
        priority
      />
    </div>
  )
}