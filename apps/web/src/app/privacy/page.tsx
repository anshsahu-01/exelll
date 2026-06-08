import { LegalFooter } from '@/components/legal/LegalFooter'

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Privacy Policy</h1>
      
      <div className="prose prose-blue max-w-none text-secondary">
        <h2 className="mt-8 text-xl font-bold text-primary">1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create or modify your account, list items, or contact support. This includes your name, email, college affiliation, and profile image.</p>

        <h2 className="mt-8 text-xl font-bold text-primary">2. How We Use Information</h2>
        <p>We use the information to maintain our marketplace, connect buyers and sellers, and monitor for prohibited activities.</p>

        <div className="my-8 rounded-xl border-l-4 border-amber-500 bg-amber-50 p-6">
          <h2 className="mb-4 text-xl font-bold text-black">3. Disclaimer of Liability</h2>
          <ul className="list-inside list-disc space-y-2 font-medium text-gray-800">
            <li>Exell only connects buyers and sellers.</li>
            <li>Exell is not responsible for transactions, payments, deliveries, meetings, disputes, fraud, injuries, theft, or damages.</li>
            <li>Users interact at their own risk.</li>
            <li>Exell does not guarantee the identity of buyers or sellers.</li>
            <li>Exell can remove listings and ban accounts.</li>
          </ul>
        </div>
        
        <LegalFooter />
      </div>
    </div>
  )
}
