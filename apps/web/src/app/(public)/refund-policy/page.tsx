import { LegalPageShell, Section } from '@/components/legal/LegalPageShell'

export default function RefundPolicyPage() {
  return (
    <LegalPageShell
      title="Refund Policy"
      intro="This Refund Policy explains how refund and return requests are handled across direct transactions, delivered orders, and platform-assisted verified purchases."
    >
      <Section heading="Delivered Orders">
        <p>
          Once an order has been marked delivered and accepted, the transaction is considered
          complete and is not eligible for refund or return, except where applicable law requires a
          different outcome.
        </p>
      </Section>

      <Section heading="Direct Buyer-Seller Transactions">
        <p>
          If a buyer and seller complete a transaction directly outside Exell’s verification
          workflow, the platform does not provide product-condition guarantees or warranty-like
          protection. Any disputes regarding defects, damage, mismatch, or quality are the
          responsibility of the buyer and seller to resolve between themselves.
        </p>
      </Section>

      <Section heading="Platform-Assisted Verified Transactions">
        <p>
          When a transaction is completed through Exell’s verification-assisted purchase flow,
          a platform service fee or commission of 10% applies to the assisted workflow.
        </p>
        <p>
          In these verified transactions, Exell may assist with product condition review,
          coordinate communication between the parties, and help mediate issues involving damage,
          non-functionality, or significant mismatch. Where appropriate, the platform may support a
          negotiated adjustment, resale coordination, or other practical resolution between buyer
          and seller.
        </p>
        <p>
          The platform service fee remains applicable for the assisted transaction workflow even
          when a dispute is reviewed or a negotiated outcome is reached.
        </p>
      </Section>
    </LegalPageShell>
  )
}
