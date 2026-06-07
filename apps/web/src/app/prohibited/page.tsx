import { LegalFooter } from '@/components/legal/LegalFooter'

export default function ProhibitedItemsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Prohibited Items</h1>
      
      <div className="prose prose-blue max-w-none text-gray-600">
        <p className="mb-4">The following items are strictly prohibited on Exell. Listing any of these items will result in immediate removal of the listing and potential account ban.</p>

        <h2 className="mt-8 text-xl font-bold text-gray-900">List of Prohibited Items</h2>
        <ul className="list-inside list-disc space-y-2 font-medium text-gray-800">
          <li>Drugs</li>
          <li>Alcohol</li>
          <li>Tobacco / Vapes</li>
          <li>Weapons</li>
          <li>Prescription medicines</li>
          <li>Fake IDs</li>
          <li>Stolen goods</li>
          <li>Counterfeit products</li>
          <li>Adult content</li>
          <li>Pirated software</li>
          <li>Any illegal item under Indian law</li>
        </ul>

        <div className="my-8 rounded-xl border-l-4 border-amber-500 bg-amber-50 p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Important Disclaimers</h2>
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
