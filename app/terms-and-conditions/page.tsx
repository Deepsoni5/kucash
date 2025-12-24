import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import {
  FileCheck,
  Handshake,
  Users,
  Gavel,
  UserCheck,
  ShieldAlert,
  CreditCard,
  PhoneOutgoing,
  MapPin,
  Mail,
  Scale,
  Info,
  CheckCircle2,
  Briefcase
} from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Use | KuCash - Transparent Financial Services",
  description:
    "Read the Terms of Use for KuCash. Understand your rights and responsibilities as a user of our LSP platform and M&A advisory services.",
}

export default function TermsAndConditionsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 bg-background text-foreground selection:bg-primary/20">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent -z-10" />
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary animate-in fade-in slide-in-from-bottom-4 duration-700">
                <FileCheck className="w-4 h-4" />
                <span className="text-sm font-bold uppercase tracking-widest">Legal Framework</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-none text-balance animate-in fade-in slide-in-from-bottom-6 duration-1000">
                Terms of <span className="text-primary italic">Use</span>
              </h1>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-muted-foreground font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <p>Last Updated: October 2025</p>
                <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-border" />
                <p>Madhyavarti Solutions Private Limited</p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Container */}
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">

          {/* 1. Acceptance of Terms */}
          <section className="mb-16">
            <div className="bg-card rounded-[2.5rem] p-8 lg:p-12 border border-border shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/10 transition-colors duration-500" />
              <div className="space-y-6 relative z-10">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <span className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
                    <CheckCircle2 className="text-primary w-6 h-6" />
                  </span>
                  1. Acceptance of Terms
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                  <p>
                    By accessing or using the <span className="text-foreground font-bold">KuCash</span> website/app, you agree to be bound by these Terms. KuCash is a product of <span className="text-foreground font-bold italic underline decoration-primary/30 underline-offset-4 tracking-tight">Madhyavarti Solutions Private Limited</span>.
                  </p>
                  <p className="text-sm font-medium bg-muted/50 p-4 rounded-2xl border border-border/50">
                    CIN: U62099KA2024PTC187663 | Registered Address: NO:8, K.NO.13-3, 28TH CROSS, HULIMAVU MAIN ROAD, Hulimavu, Bangalore, Bangalore South, Karnataka, India, 560076.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Definitions - Grid Layout */}
          <section className="mb-24">
            <div className="space-y-8">
              <h2 className="text-3xl font-black italic tracking-tighter flex items-center gap-3 ml-4">
                <Info className="text-primary w-8 h-8" /> 2. Definitions
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { label: "LSP", title: "Loan Service Provider", desc: "Refers to KuCash (Madhyavarti Solutions Pvt Ltd).", icon: Handshake },
                  { label: "RE", title: "Regulated Entity", desc: "Our partner Banks and NBFCs (e.g., Oxyzo, V2s Fin Assist) who grant the loan.", icon: Scale },
                  { label: "User", title: "User/Borrower", desc: "Refers to you, the individual accessing our services.", icon: Users }
                ].map((item, idx) => (
                  <div key={idx} className="p-8 rounded-[2rem] bg-card border border-border shadow-lg space-y-4 hover:border-primary/50 transition-colors duration-500 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:rotate-6 transition-all">
                      <item.icon className="text-primary w-6 h-6 group-hover:text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-primary uppercase tracking-widest">{item.label}</span>
                      <h4 className="text-xl font-bold text-foreground">{item.title}</h4>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3. Our Services - Detailed Section */}
          <section className="mb-24">
            <div className="bg-gradient-to-br from-card to-muted p-10 lg:p-14 rounded-[3rem] border border-border shadow-2xl space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl font-extrabold tracking-tighter">3. Our Services</h2>
                <p className="text-xl text-muted-foreground italic">KuCash is a technology platform acting as an Aggregator.</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-xl font-bold flex items-center gap-2">
                      <CheckCircle2 className="text-primary w-5 h-5" /> Facilitation & Matching
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      We facilitate the loan application process by collecting your requirements and matching them with our partner REs.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xl font-bold flex items-center gap-2">
                      <ShieldAlert className="text-orange-500 w-5 h-5" /> Not a Lender
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      KuCash does not grant loans, accept deposits, or recover loans on its own books. All loans are granted directly by the REs.
                    </p>
                  </div>
                </div>

                <div className="p-8 rounded-3xl bg-secondary/20 border border-primary/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                    <Briefcase className="w-32 h-32" />
                  </div>
                  <h4 className="text-xl font-bold mb-4 underline decoration-primary/30">M&A Advisory Services</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed relative z-10">
                    Strategic advisory, deal facilitation, and support during negotiations/due diligence. We do not provide services requiring SEBI registration (underwriting, securities broking, etc.) unless duly obtained. All engagements are governed by separate written agreements.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Eligibility - Highlighted */}
          <section className="mb-24 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <UserCheck className="text-primary w-8 h-8" />
                4. User Eligibility
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To access the KuCash ecosystem, you must meet stringent compliance requirements as set by our partners and Indian law.
              </p>
            </div>
            <div className="grid gap-4">
              {[
                "Resident of India",
                "Minimum age of 18 years (21 for specific products)",
                "Possess a valid PAN Card",
                "Possess a valid Aadhaar number"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-sm">{idx + 1}</span>
                  </div>
                  <span className="font-semibold text-foreground/90">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Roles & Responsibilities - Duo Panels */}
          <section className="mb-24 space-y-8">
            <h2 className="text-4xl font-black italic tracking-tighter text-center">5. Roles & Responsibilities</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* User Responsibilities */}
              <div className="p-10 rounded-[2.5rem] bg-card border border-border shadow-lg space-y-8 group">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Users className="text-primary w-6 h-6" /> User Duties
                  </h3>
                  <div className="h-1 w-20 bg-primary/30 rounded-full group-hover:w-full transition-all duration-700" />
                </div>
                <ul className="space-y-6">
                  {[
                    { t: "True Information", d: "KYC and Income must be accurate. Fake documents are a criminal offense." },
                    { t: "End Use", d: "No illegal or speculative use (gambling, crypto trading)." },
                    { t: "Repayment", d: "Responsibility for timely EMI repayment directly to the Lender." }
                  ].map((item, idx) => (
                    <li key={idx} className="space-y-1">
                      <span className="font-bold text-foreground block">{item.t}</span>
                      <span className="text-muted-foreground text-sm">{item.d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* KuCash Responsibilities */}
              <div className="p-10 rounded-[2.5rem] bg-primary text-primary-foreground shadow-2xl space-y-8 relative overflow-hidden">
                <div className="absolute -bottom-8 -right-8 opacity-10">
                  <FileCheck className="w-48 h-48" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Handshake className="w-6 h-6" /> KuCash Commitments
                  </h3>
                  <div className="h-1 w-20 bg-white/30 rounded-full" />
                </div>
                <ul className="space-y-6">
                  {[
                    { t: "Transparency", d: "KFS with APR, recovery mechanism, and grievance details provided." },
                    { t: "Data Safety", d: "Protected by industry-standard security protocols." },
                    { t: "No Hidden Charges", d: "Zero platform fees for borrowers. Any lender fees shown in KFS." }
                  ].map((item, idx) => (
                    <li key={idx} className="space-y-1">
                      <span className="font-bold block opacity-100">{item.t}</span>
                      <span className="text-sm opacity-80">{item.d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 6. Fees, 7. Liability, 8. Consent */}
          <section className="mb-24 grid lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-card border border-border space-y-4">
              <CreditCard className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-bold tracking-tight">6. Fees & Charges</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                KuCash is <span className="text-foreground font-bold italic">FREE</span> for search. Lender-specific processing fees, GST, or penalties will be documented in your Loan Agreement.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-card border border-border space-y-4">
              <Gavel className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-bold tracking-tight">7. Liability Limits</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We are facilitators. Rejections, technical failures of Account Aggregators, or third-party issues are outside our liability.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-card border border-border space-y-4">
              <PhoneOutgoing className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-bold tracking-tight">8. Consent to Contact</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                By registering, you override DND for transactional updates via SMS, Email, or Phone related to your loan request.
              </p>
            </div>
          </section>

          {/* 9. Governing Law & 10. Contact */}
          <section className="relative p-10 lg:p-14 rounded-[3.5rem] bg-card border border-border shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-[100%] border-l border-b border-primary/20" />
            <div className="relative z-10 grid lg:grid-cols-2 gap-16">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Scale className="text-primary w-8 h-8" />
                    9. Governing Law
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of the courts in <span className="text-foreground font-bold">Bengaluru, Karnataka</span>.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <Mail className="text-primary w-8 h-8" />
                  10. Contact Us
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-1" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <span className="font-bold text-foreground">Madhyavarti Solutions Private Limited</span><br />
                      NO:8, K.NO.13-3, 28TH CROSS,<br />
                      HULIMAVU MAIN ROAD, Hulimavu,<br />
                      Bangalore South, Bangalore, Karnataka - 560076
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="w-5 h-5 text-primary" />
                    <a href="mailto:legal@kucash.in" className="text-foreground font-bold hover:text-primary transition-colors">legal@kucash.in</a>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}

