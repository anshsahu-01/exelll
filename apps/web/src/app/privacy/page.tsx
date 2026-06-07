import { LegalFooter } from '@/components/legal/LegalFooter'

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Privacy Policy</h1>
      
      <div className="prose prose-blue max-w-none text-gray-600">
        <h2 className="mt-8 text-xl font-bold text-gray-900">1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create or modify your account, list items, or contact support. This includes your name, email, college affiliation, and profile image.</p>

        <h2 className="mt-8 text-xl font-bold text-gray-900">2. How We Use Information</h2>
        <p>We use the information to maintain our marketplace, connect buyers and sellers, and monitor for prohibited activities.</p>

        <div className="my-8 rounded-xl border-l-4 border-amber-500 bg-amber-50 p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">3. Disclaimer of Liability</h2>
          <ul className="list-inside list-disc space-y-2 font-medium text-gray-800">
            <li>Exell only connects buyers and sellers.</li>
            <li>We do not facilitate, process, hold, guarantee, or mediate payments.</li>
            <li>We are not responsible for meetings, transactions, disputes, fraud, losses, theft, injuries, or damages between users.</li>
            <li>Users interact and transact entirely at their own risk.</li>
            <li>We do not guarantee the identity of buyers or sellers.</li>
          </ul>
        </div>
        
        <LegalFooter />
      </div>
    </div>
  )
}
