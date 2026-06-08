import { LegalPageShell, Section } from '@/components/legal/LegalPageShell'

export default function ContactUsPage() {
  return (
    <LegalPageShell
      title="Contact Us"
      intro="Need help with an order, listing, account issue, or policy question? Reach out and our team will review your request."
    >
      <Section heading="Support Email">
        <p>
          Email us at{' '}
          <a
            href="mailto:relatablecoder01@gmail.com"
            className="font-medium text-primary underline underline-offset-4"
          >
            relatablecoder01@gmail.com
          </a>
          .
        </p>
      </Section>

      <Section heading="How to Report an Issue">
        <p>
          Please include your account email, order or listing details, a concise description of the
          problem, and any relevant screenshots or transaction references. This helps us review the
          issue faster and route it to the correct team.
        </p>
      </Section>

      <Section heading="Response Expectations">
        <p>
          We aim to respond to support requests as quickly as possible during normal business
          hours. Complex account, dispute, or verification issues may require additional review
          time.
        </p>
      </Section>
    </LegalPageShell>
  )
}
