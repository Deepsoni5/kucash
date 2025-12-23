import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Button } from "@/components/ui/button"
import { Target, Eye, Award, Users, TrendingUp, Shield, Handshake, ShieldCheck, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About KuCash | 15 Years of Financial Excellence",
  description:
    "KuCash is a leading Loan Service Provider (LSP) in India with 15 years of experience. We match you with 100+ banking partners for instant, transparent, and hassle-free loans.",
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                < Award className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">Since 2010</span>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground text-balance">
                About <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic">KuCash</span>
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground font-medium leading-relaxed text-pretty">
                15 Years of Finance. 5,000+ Stories. <br className="hidden sm:block" />
                <span className="text-foreground font-bold">One Mission: To Fix Borrowing in India.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-12 space-y-12">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                    Born from Real Problems, Not Just Code
                  </h2>
                  <div className="w-24 h-1.5 bg-primary mx-auto rounded-full" />
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                  <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                    <p className="indent-8 italic text-foreground font-medium border-l-4 border-primary pl-6 py-2 bg-primary/5 rounded-r-2xl">
                      KuCash wasn’t built in a boardroom by coders who have never taken a loan. It was built on the ground, witnessing the real struggles of Indian borrowers for over 15 years.
                    </p>
                    <p>
                      Before we wrote a single line of code, we served <span className="text-foreground font-bold underline decoration-primary/30 decoration-4">5,000+ customers offline</span>. We sat across the table from small business owners who were rejected because of a single missing document.
                    </p>
                    <p>
                      We saw the anxiety in families waiting weeks for a "loan approval" that never came. We saw the frustration of people running from bank to bank, only to face hidden charges and confusing terms.
                    </p>
                  </div>

                  <div className="space-y-6 text-lg text-muted-foreground leading-relaxed pt-2">
                    <p>
                      We realized that the lending system wasn&apos;t broken; it was just <span className="text-primary font-bold italic">disconnected</span>. Good borrowers couldn&apos;t find the right lenders.
                    </p>
                    <p className="text-foreground font-medium bg-secondary/30 p-8 rounded-3xl border border-border/50 shadow-inner">
                      So, we built KuCash. We combined our deep financial expertise with the power of technology to create a Loan Service Provider (LSP) that removes the &quot;Run&quot; from &quot;Bank Run.&quot;
                    </p>
                    <p>
                      Today, we don&apos;t just find you a loan; we match you with the right partner from our network of <span className="text-primary font-bold">100+ banks and NBFCs</span>, ensuring speed, dignity, and transparency.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission - Unique Side-by-Side Design */}
        <section className="py-24 lg:py-32 bg-muted/30 overflow-hidden">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Vision Card */}
              <div className="relative p-10 lg:p-14 rounded-[3rem] bg-card border border-border shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                  <Target className="w-32 h-32 text-primary" />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
                    <span className="w-10 h-[2px] bg-primary" /> Our Vision
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-black text-foreground leading-tight italic">
                    &quot;To build an India where accessing credit is as dignified and simple as spending your own money—free from harassment, confusion, and fear.&quot;
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We envision a financial ecosystem where a borrower never has to beg for a loan. By leveraging the <span className="text-foreground font-semibold">Account Aggregator (AA) framework</span> and our partnerships with giants like <span className="text-foreground font-semibold">Oxyzo</span> and <span className="text-foreground font-semibold">V2s Fin Assist</span>, we aim to make credit invisible, instant, and inclusive for every Indian.
                  </p>
                </div>
              </div>

              {/* Mission Card */}
              <div className="relative p-10 lg:p-14 rounded-[3rem] bg-primary text-primary-foreground shadow-2xl overflow-hidden group">
                <div className="absolute bottom-0 right-0 p-8 opacity-10 group-hover:-rotate-12 transition-transform">
                  <TrendingUp className="w-32 h-32 text-white" />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-2 text-primary-foreground font-bold uppercase tracking-widest text-sm opacity-80">
                    <span className="w-10 h-[2px] bg-primary-foreground" /> Our Mission
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold leading-relaxed">
                    &quot;To be India’s most transparent Loan Service Provider (LSP) by bridging the gap between 100+ Regulated Lenders and millions of borrowers through a &apos;Zero-Hassle, Zero-Spam&apos; digital architecture.&quot;
                  </h3>
                  <ul className="space-y-4">
                    {[
                      {
                        title: "Eliminate Rejection Anxiety",
                        desc: "By matching profiles with multiple lenders instantly, we turn \"No\" into \"Next Option.\""
                      },
                      {
                        title: "End the Paper Chase",
                        desc: "Using 100% digital data fetching (Account Aggregator) to replace physical file runs."
                      },
                      {
                        title: "Restore Trust",
                        desc: "To prove that a fintech company can exist without making spam calls or hiding fees."
                      }
                    ].map((item, idx) => (
                      <li key={idx} className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold underline decoration-white/30">{item.title}:</span>
                          <span className="opacity-90 ml-2">{item.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values - The KuCash Promise */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">Core Values <span className="text-primary">(The KuCash Promise)</span></h2>
              <p className="text-lg text-muted-foreground">
                These aren&apos;t just words on a wall; they are the rules we lived by for 15 years and continue to uphold today.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 lg:gap-12">
              {[
                {
                  icon: ShieldCheck,
                  title: "Dignity First (The \"No Spam\" Policy)",
                  desc: "We believe your phone number belongs to you, not us. Unlike others who sell your data to call centers, KuCash operates on a strict \"Pull, Don't Push\" policy. We never bombard you with fake calls or robocalls. We speak only when you ask us to help.",
                  color: "blue"
                },
                {
                  icon: Eye,
                  title: "Radical Transparency (The KFS Standard)",
                  desc: "No hidden charges. No \"star mark\" conditions. We display the Key Fact Statement (KFS) upfront, showing you the all-inclusive Annual Percentage Rate (APR), processing fees, and penal charges before you sign any agreement. If it’s not on the screen, you don’t pay it.",
                  color: "teal"
                },
                {
                  icon: Handshake,
                  title: "The Power of Partnership",
                  desc: "We have partnered with India's most respected financial institutions: Oxyzo Financial Services (bringing A+ rated corporate financing) and V2s Fin Assist (regional reach). This network allows us to say \"Yes\" when others say \"No.\"",
                  color: "purple"
                },
                {
                  icon: Zap,
                  title: "Speed with Security",
                  desc: "We value your time. Our 15 years of experience taught us that in emergencies, every hour counts. We use bank-grade security and Account Aggregator tech to disburse funds within 24 hours—without ever compromising your data privacy.",
                  color: "orange"
                }
              ].map((value, index) => {
                const Icon = value.icon
                return (
                  <div key={index} className="group relative p-8 lg:p-10 rounded-3xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-2xl transition-all duration-500 overflow-hidden">
                    <div className="flex flex-col gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors italic">{value.title}</h3>
                        <p className="text-muted-foreground leading-relaxed text-pretty text-lg">
                          {value.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Stats Section Re-styled */}
        <section className="py-24 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]" />
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center text-primary-foreground">
              <div className="space-y-2">
                <div className="text-6xl font-black tracking-tighter">₹500+ Cr</div>
                <div className="text-white/80 font-semibold uppercase tracking-widest text-sm">Loans Disbursed</div>
              </div>
              <div className="space-y-2">
                <div className="text-6xl font-black tracking-tighter">5000+</div>
                <div className="text-white/80 font-semibold uppercase tracking-widest text-sm">Happy Customers</div>
              </div>
              <div className="space-y-2">
                <div className="text-6xl font-black tracking-tighter">15 Years</div>
                <div className="text-white/80 font-semibold uppercase tracking-widest text-sm">Experience</div>
              </div>
              <div className="space-y-2">
                <div className="text-6xl font-black tracking-tighter">100+</div>
                <div className="text-white/80 font-semibold uppercase tracking-widest text-sm">Partner Banks</div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 lg:py-32 bg-muted/30">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-4xl lg:text-6xl font-extrabold text-foreground text-balance">
                Ready to Experience the <span className="text-primary italic">KuCash Difference?</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 text-pretty">
                {"Join thousands of satisfied customers who found dignity, speed, and transparency with us."}
              </p>
              <Link href="/#apply">
                <Button size="lg" className="rounded-full bg-gradient-to-r from-primary to-accent text-xl px-12 py-8 hover:scale-105 transition-transform shadow-xl">
                  Get Your Loan Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
