import { LegalFooter } from '@/components/legal/LegalFooter'

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Terms of Service</h1>
      
      <div className="prose prose-blue max-w-none text-secondary">
        <h2 className="mt-8 text-xl font-bold text-primary">1. Acceptance of Terms</h2>
        <p>By accessing and using Exell, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.</p>

        <div className="my-8 rounded-xl border-l-4 border-amber-500 bg-amber-50 p-6">
          <h2 className="mb-4 text-xl font-bold text-black">2. Important Disclaimers</h2>
          <ul className="list-inside list-disc space-y-2 font-medium text-gray-800">
            <li>Exell only connects buyers and sellers.</li>
            <li>Exell is not responsible for transactions, payments, deliveries, meetings, disputes, fraud, injuries, theft, or damages.</li>
            <li>Users interact at their own risk.</li>
            <li>Exell does not guarantee the identity of buyers or sellers.</li>
            <li>Exell can remove listings and ban accounts.</li>
          </ul>
        </div>

        <h2 className="mt-8 text-xl font-bold text-primary">3. User Conduct</h2>
        <p>You agree to use Exell respectfully and lawfully. Any abusive, fraudulent, or illegal activity will result in immediate account termination.</p>

        <h2 className="mt-8 text-xl font-bold text-primary">4. Right to Remove Content</h2>
        <p>Exell reserves the right to remove any listings or ban any accounts at our sole discretion, without prior notice, if they violate our policies or are deemed inappropriate.</p>
        
        <LegalFooter />
      </div>
    </div>
  )
}
