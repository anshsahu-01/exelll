import { LegalFooter } from '@/components/legal/LegalFooter'

export default function SafetyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Safety Guidelines</h1>
      
      <div className="prose prose-blue max-w-none text-secondary">
        <div className="my-8 rounded-xl border-l-4 border-amber-500 bg-amber-50 p-6">
          <h2 className="mb-4 text-xl font-bold text-black">Core Disclaimers</h2>
          <ul className="list-inside list-disc space-y-2 font-medium text-gray-800">
            <li>Exelll only connects buyers and sellers.</li>
            <li>Exelll is not responsible for transactions, payments, deliveries, meetings, disputes, fraud, injuries, theft, or damages.</li>
            <li>Users interact at their own risk.</li>
            <li>Exelll does not guarantee the identity of buyers or sellers.</li>
            <li>Exelll can remove listings and ban accounts.</li>
          </ul>
        </div>

        <h2 className="mt-8 text-xl font-bold text-primary">Meeting Up</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>Always meet in well-lit, public places, preferably during daylight hours.</li>
          <li>Consider meeting on campus or at a designated safe exchange zone (like a police station).</li>
          <li>Tell a friend or roommate where you are going and who you are meeting.</li>
          <li>Never go to a stranger&apos;s dorm room or house alone.</li>
        </ul>

        <h2 className="mt-8 text-xl font-bold text-primary">Payments</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>Exelll does not process payments. All payments are handled directly between users.</li>
          <li>Inspect the item thoroughly before handing over money.</li>
          <li>If an offer seems too good to be true, it probably is.</li>
        </ul>

        <LegalFooter />
      </div>
    </div>
  )
}
