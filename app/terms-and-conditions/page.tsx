import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"

export const metadata: Metadata = {
  title: "Terms and Conditions | Kucash - Loan Agreement Terms",
  description:
    "Read Kucash's terms and conditions to understand the terms of service, loan agreements, and user responsibilities.",
  openGraph: {
    title: "Terms and Conditions | Kucash",
    description: "Understanding the terms and conditions for using Kucash lending services.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=630&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Kucash Terms and Conditions",
      },
    ],
  },
}

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 lg:py-24">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">Terms and Conditions</h1>
            <p className="text-muted-foreground mb-8">Last updated: December 22, 2025</p>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using Kucash's services, you accept and agree to be bound by these Terms and
                  Conditions. If you do not agree with any part of these terms, you should not use our services. These
                  terms apply to all users of the site, including borrowers, applicants, and visitors.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Eligibility</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To use our lending services, you must meet the following eligibility criteria:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Be at least 21 years of age</li>
                  <li>Be a resident of India</li>
                  <li>Have a valid government-issued ID (PAN card, Aadhaar card)</li>
                  <li>Have a verifiable source of income</li>
                  <li>Have a valid bank account in your name</li>
                  <li>Meet our creditworthiness requirements</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Loan Application Process</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">When you apply for a loan through Kucash:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>You must provide accurate and complete information</li>
                  <li>We reserve the right to verify all information provided</li>
                  <li>Loan approval is subject to credit assessment and verification</li>
                  <li>We may request additional documentation at any time</li>
                  <li>Approval or rejection decisions are at our sole discretion</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Loan Terms</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">If your loan application is approved:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Interest rates will be clearly disclosed before acceptance</li>
                  <li>Repayment schedules will be provided in your loan agreement</li>
                  <li>Processing fees and other charges will be communicated upfront</li>
                  <li>You must repay the loan according to the agreed schedule</li>
                  <li>Late payment penalties may apply for missed payments</li>
                  <li>You may prepay your loan subject to prepayment terms</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Borrower Responsibilities</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">As a borrower, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Provide truthful and accurate information</li>
                  <li>Make timely loan repayments as per the agreed schedule</li>
                  <li>Notify us immediately of any changes in your financial situation</li>
                  <li>Maintain valid contact information</li>
                  <li>Use the loan funds only for lawful purposes</li>
                  <li>Not engage in fraudulent activities</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Default and Collections</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">In the event of loan default:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>We will attempt to contact you through phone, email, and SMS</li>
                  <li>Late payment fees and penalty interest may be charged</li>
                  <li>Your credit score may be negatively impacted</li>
                  <li>We may engage collection agencies to recover outstanding amounts</li>
                  <li>We reserve the right to take legal action to recover the debt</li>
                  <li>Your information may be reported to credit bureaus</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Privacy and Data Protection</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We are committed to protecting your privacy. Your personal information will be collected, used, and
                  protected in accordance with our Privacy Policy and applicable data protection laws. By using our
                  services, you consent to the collection and use of your information as described in our Privacy
                  Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content on the Kucash website, including text, graphics, logos, icons, images, and software, is
                  the property of Kucash and is protected by copyright and intellectual property laws. You may not
                  reproduce, distribute, or create derivative works without our express written permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">9. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Kucash shall not be liable for any indirect, incidental, special, consequential, or punitive damages
                  arising from your use of our services. Our total liability to you for any claims arising from the use
                  of our services shall not exceed the amount of fees you paid to us in the preceding 12 months.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">10. Regulatory Compliance</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Kucash is a registered LSP loan service provider. We comply with all applicable laws, regulations, and guidelines governing lending activities in
                  India, including but not limited to the Fair Practices Code and consumer protection laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">11. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these Terms and Conditions at any time. Changes will be effective
                  immediately upon posting on our website. Your continued use of our services after changes are posted
                  constitutes your acceptance of the modified terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">12. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms and Conditions shall be governed by and construed in accordance with the laws of India.
                  Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in
                  Bangalore, Karnataka.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">13. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For questions about these Terms and Conditions, please contact us:
                </p>
                <div className="bg-muted/50 rounded-2xl p-6 space-y-2">
                  <p className="text-foreground font-medium">Kucash</p>
                  <p className="text-muted-foreground">Email: wecare@kucash.in</p>
                  <p className="text-muted-foreground">Phone: +91 9008367818</p>
                  <p className="text-muted-foreground">
                    Address: NO:8, K.NO.13-3, 28TH CROSS, HULIMAVU MAIN ROAD, Hulimavu, Bangalore South, Bangalore -
                    560076, Karnataka
                  </p>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
