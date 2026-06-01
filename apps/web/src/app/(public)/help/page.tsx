import { LegalPageShell, Section } from '@/components/legal/LegalPageShell'

const faqs = [
  {
    q: 'How do I list an item?',
    a: 'Go to Sell an Item, add your photos, title, description, price, category, condition, and location, then submit the listing once the form is complete.',
  },
  {
    q: 'How does checkout work?',
    a: 'You can buy directly from a listing or check out from your cart. Choose Cash on Delivery or Online Payment, complete the delivery details, and place your order.',
  },
  {
    q: 'How does payment verification work?',
    a: 'For online payments, upload your payment proof and transaction reference so the order can be reviewed through the platform’s manual verification process.',
  },
  {
    q: 'What are the refund rules?',
    a: 'Refund eligibility depends on the transaction type. Delivered and accepted orders are final, direct outside-platform transactions are handled by the buyer and seller, and verified platform-assisted transactions may be reviewed under the Refund Policy.',
  },
  {
    q: 'How do I report an issue?',
    a: 'Use the Contact Us page and include your account details, order or listing reference, a short description of the issue, and any supporting screenshots.',
  },
]

export default function HelpPage() {
  return (
    <LegalPageShell
      title="Help Center"
      intro="Find quick answers to common questions about listings, checkout, payment verification, refunds, and support."
    >
      {faqs.map((item) => (
        <Section key={item.q} heading={item.q}>
          <p>{item.a}</p>
        </Section>
      ))}
    </LegalPageShell>
  )
}
