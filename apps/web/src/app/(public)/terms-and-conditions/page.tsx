import { LegalPageShell, Section } from '@/components/legal/LegalPageShell'

export default function TermsAndConditionsPage() {
  return (
    <LegalPageShell
      title="Terms & Conditions"
      intro="These Terms govern your use of Exelll. By accessing the platform, you agree to use it responsibly and in accordance with marketplace rules and applicable law."
    >
      <Section heading="Marketplace Role">
        <p>
          Exelll acts as a marketplace facilitator. We provide the platform, tools, and
          communication channels that connect buyers and sellers, but we do not take ownership of
          user-listed items unless expressly stated.
        </p>
      </Section>

      <Section heading="Acceptable Use">
        <p>
          You agree to use the platform only for lawful purposes. You must not post false,
          misleading, infringing, abusive, or fraudulent content, and you may not attempt to
          circumvent platform controls, impersonate another user, or manipulate listings, reviews,
          or transactions.
        </p>
      </Section>

      <Section heading="Seller Responsibilities">
        <p>
          Sellers are responsible for the accuracy, authenticity, pricing, condition, and lawful
          sale of their listings. Sellers must disclose material defects, provide truthful product
          descriptions and images, and honor commitments made through the platform.
        </p>
      </Section>

      <Section heading="Buyer Responsibilities">
        <p>
          Buyers must review listings carefully, communicate respectfully, complete payment in good
          faith, and inspect items promptly after delivery or handoff. Buyers are responsible for
          raising legitimate concerns through the proper platform channels.
        </p>
      </Section>

      <Section heading="Contact Information Rules">
        <p>
          Contact information is revealed only after a seller accepts an order. The buyer phone
          number shown to sellers is the number entered during checkout or order placement. The
          seller phone number shown to buyers is the public contact number provided with the
          listing.
        </p>
        <p>
          Users are responsible for providing safe and appropriate contact information during
          listing creation and order placement. Exelll only facilitates the exchange of information
          and is not responsible for the phone numbers or contact details provided by buyers or
          sellers.
        </p>
      </Section>

      <Section heading="Suspension and Enforcement">
        <p>
          We may suspend, limit, or terminate access to any account that violates these Terms,
          threatens platform integrity, or presents legal, safety, or fraud concerns. We may also
          remove listings or restrict transactions where necessary to protect users or the service.
        </p>
      </Section>

      <Section heading="Disputes and Liability">
        <p>
          We may assist with dispute coordination, but final resolution may depend on the facts of
          the transaction and the conduct of the parties involved. To the fullest extent permitted
          by law, Exelll is not liable for indirect, incidental, or consequential damages arising
          from user-to-user transactions, except where liability cannot be limited by applicable law.
        </p>
      </Section>
    </LegalPageShell>
  )
}
