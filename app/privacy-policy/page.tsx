import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"

export const metadata: Metadata = {
  title: "Privacy Policy | KuCash - Your Financial Privacy Matters",
  description:
    "Read KuCash's privacy policy to understand how we collect, use, and protect your personal information. Your trust is our priority.",
  openGraph: {
    title: "Privacy Policy | KuCash",
    description: "Understanding how KuCash protects your personal information and maintains your privacy.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=630&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "KuCash Privacy Policy",
      },
    ],
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 lg:py-24">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: December 22, 2025</p>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Kucash ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains
                  how we collect, use, disclose, and safeguard your information when you use our lending services and
                  website. Please read this privacy policy carefully.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Personal identification information (name, email address, phone number, date of birth)</li>
                  <li>Financial information (income, employment details, bank account information)</li>
                  <li>
                    Government-issued identification documents (PAN card, Aadhaar card, driving license, passport)
                  </li>
                  <li>Credit history and credit score information</li>
                  <li>Information about your loan application and transaction history</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">3. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Process your loan applications and manage your account</li>
                  <li>Verify your identity and assess creditworthiness</li>
                  <li>Communicate with you about your loan and our services</li>
                  <li>Comply with legal and regulatory requirements</li>
                  <li>Detect and prevent fraud and security threats</li>
                  <li>Improve our services and develop new products</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Information Sharing and Disclosure</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">We may share your information with:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Credit bureaus and financial institutions for credit assessment</li>
                  <li>Service providers who assist in our operations</li>
                  <li>Law enforcement agencies when required by law</li>
                  <li>Business partners with your consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal
                  information against unauthorized access, alteration, disclosure, or destruction. This includes
                  encryption, secure servers, and regular security assessments.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Access and receive a copy of your personal information</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Request deletion of your information (subject to legal requirements)</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Lodge a complaint with the relevant data protection authority</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Cookies and Tracking Technologies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your experience on our website, analyze
                  usage patterns, and deliver personalized content. You can control cookie preferences through your
                  browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this privacy policy from time to time. We will notify you of any material changes by
                  posting the new policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">9. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you have questions or concerns about this privacy policy, please contact us:
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
