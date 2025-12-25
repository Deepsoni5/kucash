import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Share2,
  Scale,
  Info,
  CheckCircle2,
  XCircle,
  Mail,
  MapPin,
  Phone,
  UserPen,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | KuCash - Your Data, Your Control",
  description:
    "Explore KuCash's Privacy Policy. We adhere to RBI Digital Lending Guidelines and the DPDP Act to ensure your financial data remains secure and private.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 bg-background text-foreground selection:bg-primary/20">
        {/* Simplified Hero Section */}
        <section className="relative py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent -z-10" />
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-bold uppercase tracking-widest">
                  Privacy First Architecture
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-none text-balance animate-in fade-in slide-in-from-bottom-6 duration-1000">
                Privacy <span className="text-primary italic">Policy</span>
              </h1>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-muted-foreground font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <p>Last Updated: December 2025</p>
                <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-border" />
                <p>Madhyavarti Solutions Private Limited</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Content */}
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
          {/* Introduction Card */}
          <section className="mb-20">
            <div className="bg-card rounded-[2.5rem] p-8 lg:p-12 border border-border shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/10 transition-colors duration-500" />
              <div className="space-y-6 relative z-10">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Info className="text-primary w-5 h-5" />
                  </span>
                  1. Introduction
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                  <p>
                    Welcome to{" "}
                    <span className="text-foreground font-bold">KuCash</span>, a
                    brand operated by{" "}
                    <span className="text-foreground font-bold italic underline decoration-primary/30 underline-offset-4 tracking-tight">
                      Madhyavarti Solutions Private Limited
                    </span>
                    .
                  </p>
                  <p className="text-sm border-l-4 border-primary/20 pl-4 py-1 italic bg-muted/30 rounded-r-lg">
                    CIN: U62099KA2024PTC187663 | Registered ROC Bengaluru
                  </p>
                  <p>
                    We are committed to protecting your personal data. This
                    Privacy Policy outlines how we collect, store, and share
                    your data when you use the KuCash website. As a regulated
                    Loan Service Provider (LSP), we adhere strictly to the{" "}
                    <span className="text-foreground font-medium underline decoration-primary/20 decoration-2">
                      Information Technology Act, 2000
                    </span>
                    , the{" "}
                    <span className="text-foreground font-medium underline decoration-primary/20 decoration-2">
                      Digital Personal Data Protection (DPDP) Act
                    </span>
                    , and the{" "}
                    <span className="text-foreground font-medium underline decoration-primary/20 decoration-2">
                      Reserve Bank of India’s (RBI) Digital Lending Guidelines,
                      2025
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Role Segment */}
          <section className="mb-20 grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-1 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center shadow-inner">
                <Scale className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-black italic tracking-tighter">
                2. Our Role
              </h2>
              <p className="text-muted-foreground text-pretty leading-relaxed">
                Transparency is at our core. Understanding how we behave is
                essential to building trust.
              </p>
            </div>
            <div className="lg:col-span-2 p-10 rounded-[3rem] bg-gradient-to-br from-card to-muted border border-border shadow-2xl">
              <p className="text-xl text-foreground font-medium leading-relaxed italic">
                "KuCash acts as an intermediary (LSP) connecting borrowers with
                Regulated Entities (REs)—Banks and NBFCs. We do not lend money
                directly. Our partners include 100+ RBI-registered entities."
              </p>
            </div>
          </section>

          {/* Data collection - Duo Cards */}
          <section className="mb-20 space-y-8">
            <h2 className="text-3xl font-bold flex items-center gap-3 ml-4">
              <Database className="text-primary w-8 h-8" />
              3. Data We Collect (and What We Don’t)
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Data We Collect */}
              <div className="p-10 rounded-[2.5rem] bg-card border-t-8 border-t-primary border-x border-b border-border shadow-lg space-y-8 group hover:-translate-y-1 transition-transform duration-500">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <CheckCircle2 className="text-primary w-6 h-6" /> Data We
                    Collect
                  </h3>
                  <p className="text-sm text-muted-foreground italic">
                    Consent-driven & Purpose-bound
                  </p>
                </div>
                <ul className="space-y-6">
                  {[
                    {
                      title: "Identity Data",
                      items:
                        "Name, PAN, Aadhaar (via e-KYC/DigiLocker), and Photograph.",
                    },
                    {
                      title: "Financial Data",
                      items:
                        "Bank details and income proof (via Account Aggregator).",
                    },
                    {
                      title: "Device Data",
                      items:
                        "Device ID, OS, and approximate location (for fraud prevention).",
                    },
                    {
                      title: "Contact Information",
                      items: "Mobile number and Email ID.",
                    },
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-4 group/item">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 group-hover/item:scale-150 transition-transform" />
                      <div>
                        <span className="font-bold text-foreground block mb-1">
                          {item.title}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {item.items}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Data We Don't */}
              <div className="p-10 rounded-[2.5rem] bg-muted/40 border border-border shadow-lg space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <XCircle className="w-48 h-48 text-foreground" />
                </div>
                <div className="space-y-2 relative z-10">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <XCircle className="text-orange-500 w-6 h-6" /> Data We Do
                    NOT Collect
                  </h3>
                  <p className="text-sm text-muted-foreground italic">
                    Restricted by RBI Compliance
                  </p>
                </div>
                <ul className="space-y-6 relative z-10">
                  {[
                    "No Contact List Access",
                    "No Media / Gallery Access",
                    "No Call Log Access",
                    "No SMS content (other than OTPs)",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-4 py-3 border-b border-border/50 last:border-0 border-dashed"
                    >
                      <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center">
                        <span className="text-orange-500 font-bold text-xs">
                          X
                        </span>
                      </div>
                      <span className="font-semibold text-foreground/80">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use and Sharing */}
          <section className="mb-20 grid md:grid-cols-2 gap-12">
            <div className="space-y-8 p-10 rounded-[2.5rem] bg-gradient-to-br from-blue-50/5 to-transparent border border-border">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Lock className="text-primary w-6 h-6" /> 4. How We Use Your
                Data
              </h2>
              <ul className="space-y-4">
                {[
                  "Loan Matchmaking with 100+ partners",
                  "KYC Verification as per RBI norms",
                  "Credit Assessment (Bureau Pull)",
                  "Security & Fraud Prevention",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex gap-3 text-muted-foreground text-lg leading-snug"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />{" "}
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8 p-10 rounded-[2.5rem] bg-gradient-to-br from-teal-50/5 to-transparent border border-border">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Share2 className="text-primary w-6 h-6" /> 5. Data Disclosure
              </h2>
              <div className="space-y-6 text-muted-foreground">
                <p>
                  <span className="font-bold text-foreground">
                    Specific sharing:
                  </span>{" "}
                  Your data is shared <span className="italic">only</span> with
                  the specific Regulated Entity (Bank/NBFC) you choose to apply
                  to.
                </p>
                <p>
                  <span className="font-bold text-foreground">No Selling:</span>{" "}
                  We strictly{" "}
                  <span className="text-primary font-black uppercase">
                    do not sell
                  </span>{" "}
                  your personal data to third-party marketing agencies.
                </p>
              </div>
            </div>
          </section>

          {/* Storage & localization */}
          <section className="mb-20 p-10 lg:p-14 rounded-[3rem] bg-card border border-border shadow-xl text-center space-y-8 relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50" />
            <h2 className="text-3xl font-bold tracking-tight">
              6. Data Storage & Localization
            </h2>
            <div className="grid sm:grid-cols-2 gap-12 max-w-4xl mx-auto items-center">
              <div className="space-y-2">
                <p className="text-primary font-black text-6xl italic opacity-20">
                  IN
                </p>
                <h4 className="font-bold text-xl uppercase tracking-tighter">
                  100% On-Soil Storage
                </h4>
                <p className="text-sm text-muted-foreground">
                  All data is stored exclusively on secure cloud servers located
                  within India.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-primary font-black text-6xl italic opacity-20">
                  5Y
                </p>
                <h4 className="font-bold text-xl uppercase tracking-tighter">
                  Retention Policy
                </h4>
                <p className="text-sm text-muted-foreground">
                  Retained for lifecycle or as required by law (e.g., 5-year
                  retention per PMLA).
                </p>
              </div>
            </div>
          </section>

          {/* rights section */}
          <section className="mb-20">
            <div className="p-10 rounded-[2.5rem] bg-primary text-primary-foreground shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                <UserPen className="w-32 h-32" />
              </div>
              <div className="relative z-10 space-y-6 max-w-2xl">
                <h2 className="text-3xl font-black italic">
                  7. Your Rights (Consent Architecture)
                </h2>
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <h4 className="font-bold text-lg underline">
                      Right to Revoke
                    </h4>
                    <p className="text-sm opacity-90">
                      Revoke consent for data sharing at any time via the
                      "Settings" section of KuCash.in.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-lg underline">
                      Right to Delete
                    </h4>
                    <p className="text-sm opacity-90">
                      Request deletion of account and data by writing to our
                      Grievance Officer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Grievance section */}
          <section className="relative p-10 lg:p-14 rounded-[3.5rem] bg-card border border-border/50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-br-[100%] border-r border-b border-primary/20" />
            <div className="relative z-10 space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl font-extrabold tracking-tighter flex items-center gap-4">
                  <span className="w-3 h-12 bg-primary rounded-full" />
                  8. Grievance Redressal Mechanism
                </h2>
                <p className="text-muted-foreground max-w-2xl text-lg">
                  We are here to listen and resolve. In accordance with IT Act
                  and RBI Guidelines, contact details of our Grievance Officer
                  are:
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-muted/50 border border-border/50 space-y-1 group hover:bg-muted transition-colors">
                    <span className="text-[10px] uppercase font-bold text-primary tracking-widest">
                      Officer Name
                    </span>
                    <p className="text-2xl font-bold tracking-tight italic">
                      Mr. Kiran Biradar
                    </p>
                    <p className="text-sm font-medium text-muted-foreground">
                      Grievance Redressal Officer
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground font-bold uppercase">
                          Email
                        </span>
                        <a
                          href="mailto:grievance@kucash.in"
                          className="text-foreground font-semibold hover:text-primary transition-colors"
                        >
                          grievance@kucash.in
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground font-bold uppercase">
                          Phone
                        </span>
                        <a
                          href="tel:+918618629391"
                          className="text-foreground font-semibold"
                        >
                          +91 8618629391
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 lg:p-10 rounded-3xl bg-secondary/20 border border-border/50 shadow-inner space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                    <MapPin className="text-white w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-foreground">
                      Madhyavarti Solutions Private Limited
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      NO:8, K.NO.13-3, 28TH CROSS,
                      <br />
                      HULIMAVU MAIN ROAD, Hulimavu,
                      <br />
                      Bangalore South, Bangalore,
                      <br />
                      Karnataka, India - 560076
                    </p>
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
  );
}
