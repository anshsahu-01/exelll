import { LegalPageShell, Section } from '@/components/legal/LegalPageShell'

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      intro="This Privacy Policy explains how Exell collects, uses, shares, and protects information when you use our marketplace, messaging, and order verification features."
    >
      <Section heading="Information We Collect">
        <p>
          We collect the information you provide when you create an account, set up your profile,
          create listings, communicate with other users, place or receive orders, and contact
          support. This may include your name, email address, phone number, profile details,
          listing content, photos, pricing information, transaction records, and support messages.
        </p>
        <p>
          When you use manual payment verification, we may also collect payment proof, such as a
          transaction reference number and uploaded screenshot, to verify the status of a purchase
          or resolve a dispute.
        </p>
      </Section>

      <Section heading="How We Use Information">
        <p>
          We use account, listing, transaction, chat, and payment-verification data to operate the
          platform, match buyers and sellers, support order processing, facilitate communication,
          prevent abuse, resolve disputes, and improve service reliability and safety.
        </p>
      </Section>

      <Section heading="Data Sharing and Third-Party Services">
        <p>
          Exell uses third-party authentication services, including Clerk, to secure sign-in
          and account management. We may also use infrastructure and storage providers that help us
          deliver the service. These providers are only permitted to process information on our
          behalf for legitimate platform purposes.
        </p>
      </Section>

      <Section heading="Chat, Messages, and Payment Proof">
        <p>
          Messages exchanged on the platform may be stored to support product discovery, order
          coordination, safety moderation, and dispute handling. Payment proof, including upload
          metadata and verification references, is used only for order confirmation and dispute
          review and is handled with appropriate access controls.
        </p>
      </Section>

      <Section heading="Data Protection">
        <p>
          We use reasonable administrative, technical, and organizational safeguards designed to
          protect user information against unauthorized access, alteration, disclosure, or loss.
          No system can be guaranteed completely secure, but we work to minimize risk and respond
          promptly to suspected issues.
        </p>
      </Section>

      <Section heading="Your Rights">
        <p>
          Subject to applicable law and platform requirements, you may request access, correction,
          or deletion of certain account information. You may also update your profile, manage
          listings, and contact support if you believe any information has been used incorrectly.
        </p>
      </Section>
    </LegalPageShell>
  )
}
