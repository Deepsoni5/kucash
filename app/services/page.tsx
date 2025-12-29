import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Briefcase,
  Car,
  TrendingUp,
  FileText,
  ShieldCheck,
  ArrowRightLeft,
  Banknote,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  Handshake,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Loan Services - KuCash | Fast & Transparent Financing",
  description:
    "Explore KuCash's wide range of loan services including Personal Loans, Business Loans, Vehicle Loans, Working Capital, and Invoice Discounting. 100% digital process with 24h disbursal.",
};

const services = [
  {
    id: "personal-loan",
    icon: Zap,
    headline: "Funds for Life’s Unplanned Moments.",
    subHeadline: "Approved in Minutes.",
    tagline: "From ₹50,000 to ₹1 Crore. No Collateral. No Questions Asked.",
    description:
      "Life doesn't always go according to plan. Whether it's a medical emergency, a dream wedding, or consolidating old debt, KuCash ensures money never stands in the way. We’ve removed the \"bank run\" from the process. By using the Account Aggregator (AA) system, we verify your income instantly without asking you to upload months of bank statements.",
    details: [
      { label: "Loan Amount", value: "₹50,000 – ₹1 Crore" },
      {
        label: "Why Us",
        value:
          'We match your profile with 100+ lenders to find the one who says "Yes," even if you’ve been rejected before.',
      },
      {
        label: "The KuCash Promise",
        value:
          "Zero hidden foreclosure charges. You see the full cost in your Key Fact Statement (KFS) before you sign.",
      },
    ],
    color: "blue",
  },
  {
    id: "business-loan",
    icon: Briefcase,
    headline: "Capital Without Collateral.",
    subHeadline: "Growth Without Limits.",
    tagline: "Unsecured Funding from ₹5 Lakhs to ₹5 Crores.",
    description:
      "Stop pledging your gold or property to grow your business. KuCash partners with industrial giants to bring enterprise-grade lending to MSMEs. Whether you are a manufacturer needing new machinery or a retailer expanding stock, we look at your turnover, not just your assets.",
    details: [
      { label: "Loan Amount", value: "₹5 Lakhs – ₹5 Crores" },
      {
        label: "Speed",
        value: "Disbursal within 48 hours for eligible businesses.",
      },
      {
        label: "Best For",
        value:
          "Business expansion, machinery purchase, and infrastructure upgrades.",
      },
      {
        label: "Partner Power",
        value: "A+ rated trust for high-ticket loans.",
      },
    ],
    color: "teal",
  },
  {
    id: "vehicle-loan",
    icon: Car,
    headline: "Drive Your Dream Car.",
    subHeadline: "Pay the Fair Price.",
    tagline: "Up to 90% Funding on Fair Market Value.",
    description:
      "Buying a pre-owned car often comes with pricing confusion. At KuCash, we don't just finance the car; we help you value it. We use advanced tools to check the \"Fair Market Value\" of the vehicle so you never overpay. Whether it's a hatchback or a luxury sedan, get on the road faster with our streamlined RTO assistance.",
    details: [
      { label: "Loan Amount", value: "₹5 Lakhs – ₹1 Crore" },
      { label: "Interest Rate", value: "Starting from 10% p.a." },
      { label: "Tenure", value: "Up to 3 Years" },
      {
        label: "Ideal For",
        value:
          "Second-hand car purchase, balance transfer of existing high-interest car loans.",
      },
    ],
    color: "purple",
  },
  {
    id: "working-capital",
    icon: LayoutDashboard,
    headline: "Keep Your Operations Moving.",
    subHeadline: "Everyday.",
    tagline: "Smooth Cash Flow Solutions for Manufacturers & Traders.",
    description:
      "Cash flow gaps shouldn't stop your production line. Our Working Capital solutions act as a safety net for your daily operations—paying staff, buying raw materials, or managing overheads during off-seasons. We offer flexible credit lines where you pay interest only on the amount you utilize.",
    details: [
      { label: "Loan Amount", value: "₹5 Lakhs – ₹1 Crore" },
      { label: "Interest Rate", value: "Starting from 10% p.a." },
      {
        label: "Tenure",
        value: "Up to 3 Years (Revolving Credit Options available).",
      },
      {
        label: "Key Benefit",
        value:
          "Rotate your funds efficiently. Draw cash when you need it, repay when your customers pay you.",
      },
    ],
    color: "orange",
  },
  {
    id: "invoice-discounting",
    icon: Handshake,
    headline: "Invoice Discounting.",
    subHeadline: "Unlock Cash Flow.",
    tagline: "₹10L – ₹10Cr. 30 – 120 days.",
    description:
      "Improve cash flow by accessing funds against approved invoices. No additional collateral required. Faster, flexible funding for growing businesses. Convert your outstanding invoices into immediate working capital and keep your operations running smoothly.",
    details: [
      { label: "AMOUNT", value: "₹10L – ₹10Cr" },
      { label: "DISCOUNT RATE", value: "From 10%" },
      { label: "TENURE", value: "30 – 120 days" },
      {
        label: "Key Benefit",
        value:
          "Get up to 80% of invoice value instantly without waiting for customer payments.",
      },
    ],
    color: "green",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Services Hero */}
        <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:40px_40px]" />
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground tracking-tight text-balance">
                Our{" "}
                <span className="text-primary italic">Financial Services</span>
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed text-pretty">
                Bridging the gap between 100+ Regulated Lenders and millions of
                borrowers through a Zero-Hassle digital architecture.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {services.map((service) => (
                  <Link key={service.id} href={`#${service.id}`}>
                    <Button
                      variant="outline"
                      className="rounded-full hover:bg-primary/5 hover:text-black border-primary/20"
                    >
                      {service.headline.split(".")[0]}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Service Sections */}
        {services.map((service, index) => {
          const Icon = service.icon;
          const isEven = index % 2 === 0;
          return (
            <section
              key={service.id}
              id={service.id}
              className={`py-24 lg:py-40 border-b border-border/50 ${
                !isEven ? "bg-muted/30" : "bg-background"
              }`}
            >
              <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                  className={`grid lg:grid-cols-2 gap-16 lg:gap-24 items-center ${
                    !isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Content Side */}
                  <div className={`space-y-8 ${!isEven ? "lg:order-2" : ""}`}>
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-widest uppercase">
                        <Icon className="w-4 h-4" />{" "}
                        {service.id.replace("-", " ")}
                      </div>
                      <h2 className="text-4xl lg:text-6xl font-black text-foreground leading-[1.1]">
                        {service.headline}
                        <br />
                        <span className="text-primary">
                          {service.subHeadline}
                        </span>
                      </h2>
                      <p className="text-xl font-semibold text-foreground/80 italic border-l-4 border-primary pl-4">
                        {service.tagline}
                      </p>
                    </div>

                    <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                      {service.description}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-6">
                      {service.details.map((detail, idx) => (
                        <div
                          key={idx}
                          className="p-6 rounded-2xl bg-card border border-border shadow-sm group hover:border-primary/50 transition-colors"
                        >
                          <div className="text-sm font-bold text-primary uppercase tracking-tighter mb-2">
                            {detail.label}
                          </div>
                          <div className="text-foreground font-medium leading-snug">
                            {detail.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4">
                      <Link href="/#apply">
                        <Button
                          size="lg"
                          className="rounded-full bg-primary text-white text-lg px-8 py-7 shadow-xl hover:scale-105 transition-transform"
                        >
                          Apply Now{" "}
                          <Zap className="ml-2 w-5 h-5 fill-current" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Aesthetic Card Side */}
                  <div className={`relative ${!isEven ? "lg:order-1" : ""}`}>
                    <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl aspect-square lg:aspect-[4/5] bg-gradient-to-br from-primary/20 to-accent/20 border-8 border-card flex items-center justify-center group">
                      <div
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                        style={{
                          backgroundImage: `url('${
                            service.id === "personal-loan"
                              ? "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
                              : service.id === "business-loan"
                              ? "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
                              : service.id === "vehicle-loan"
                              ? "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3"
                              : service.id === "working-capital"
                              ? "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
                              : service.id === "ma-advisory"
                              ? "https://images.pexels.com/photos/7414275/pexels-photo-7414275.jpeg?_gl=1*aecqf0*_ga*NDI3MTcyODI5LjE3NjI2OTAxOTg.*_ga_8JE65Q40S6*czE3NjY1NzkxMzgkbzMkZzEkdDE3NjY1NzkxNTAkajQ4JGwwJGgw?q=80&w=2070&auto=format&fit=crop"
                              : "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop"
                          }')`,
                        }}
                      />
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
                    <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-accent/20 rounded-full blur-3xl -z-10" />
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        {/* Global CTA */}
        <section className="py-24 lg:py-40 bg-primary">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto text-center space-y-12">
              <h2 className="text-5xl lg:text-7xl font-black text-primary-foreground tracking-tighter">
                READY TO SCALE YOUR <br className="hidden lg:block" /> FINANCIAL
                FUTURE?
              </h2>
              <p className="text-2xl text-primary-foreground/80 max-w-3xl mx-auto">
                Join 5,000+ satisfied customers who chose KuCash for dignity,
                transparency, and speed.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link href="/#apply">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="rounded-full text-xl px-12 py-8 bg-white text-primary hover:bg-slate-100 shadow-2xl"
                  >
                    Get Started Today
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full text-xl px-12 py-8 border-white text-white bg-white/10"
                  >
                    Learn Our Story
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="py-12 bg-background border-t border-border/50">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-bold uppercase tracking-widest mb-4">
                <ShieldCheck className="w-3 h-3" /> Important Notice
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                <strong>Disclaimer:</strong> KuCash is a Loan Service Provider
                (LSP) partnering with RBI-regulated Banks and NBFCs. We
                facilitate loan applications but do not directly lend money or
                hold deposits. Approval, interest rates, and disbursal are at
                the sole discretion of our partner lenders. Please read the Key
                Fact Statement (KFS) carefully before signing any agreement.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
