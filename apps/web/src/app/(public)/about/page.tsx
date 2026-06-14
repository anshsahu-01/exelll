import { LegalPageShell, Section } from '@/components/legal/LegalPageShell'

export default function AboutPage() {
  return (
    <LegalPageShell
      title="About Exelll"
      intro="Exelll is a student-focused trusted marketplace designed to make buying and selling within campus and community circles safer, simpler, and more transparent."
    >
      <Section heading="What We Do">
        <p>
          We provide a clean marketplace where users can list items, discover local offers, chat
          directly, and complete purchases with built-in verification and order coordination tools.
        </p>
      </Section>

      <Section heading="Why It Exists">
        <p>
          Exelll was built to support real student and community trading needs: trusted local
          discovery, practical communication, and a smoother path from listing to sale without
          unnecessary complexity.
        </p>
      </Section>

      <Section heading="Our Focus">
        <p>
          We focus on usability, trust, and clear transaction flows so people can confidently buy
          and sell everyday items in a way that feels modern, reliable, and easy to use.
        </p>
      </Section>
    </LegalPageShell>
  )
}
