import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { ContactForm } from "@/components/contact-form"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us - Kucash | Get in Touch for Loan Queries",
  description:
    "Contact Kucash for any loan related queries. Call us at +91 9008367818 or email at wecare@kucash.in. Our team is available 24/7 to assist you.",
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          </div>

          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">We're Here to Help</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                <span className="text-foreground">Get in </span>
                <span className="text-primary">Touch</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed text-pretty">
                {
                  "Have questions about loans? Our expert team is ready to assist you. Reach out through any channel and we'll respond within 24 hours."
                }
              </p>
            </div>
          </div>
        </section>

        {/* Quick Contact Cards */}
        <section className="py-12 lg:py-16 bg-background -mt-16 relative z-20">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-primary/5 border-primary/20 hover:shadow-xl transition-all hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Call Us</h3>
                  <a href="tel:+919008367818" className="text-primary hover:underline text-sm">
                    +91 9008367818
                  </a>
                </CardContent>
              </Card>

              <Card className="bg-accent/5 border-accent/20 hover:shadow-xl transition-all hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Email Us</h3>
                  <a href="mailto:wecare@kucash.in" className="text-accent hover:underline text-sm">
                    wecare@kucash.in
                  </a>
                </CardContent>
              </Card>

              <Card className="bg-[#25D366]/5 border-[#25D366]/20 hover:shadow-xl transition-all hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#25D366] flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">WhatsApp</h3>
                  <a
                    href="https://wa.me/919008367818"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#25D366] hover:underline text-sm"
                  >
                    Chat with us
                  </a>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20 hover:shadow-xl transition-all hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Visit Us</h3>
                  <p className="text-muted-foreground text-sm">Bangalore, Karnataka</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Form and Info */}
        <section className="py-20 lg:py-32 bg-muted/20">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Contact Form - Larger */}
              <div className="lg:col-span-3">
                <ContactForm />
              </div>

              {/* Contact Information - Sidebar */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-3 text-foreground">Contact Information</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {"Choose the channel that works best for you. We're here to help!"}
                  </p>
                </div>

                <Card className="border-border/50">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                        <a
                          href="tel:+919008367818"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          +91 9008367818
                        </a>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Email</h3>
                          <a
                            href="mailto:wecare@kucash.in"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            wecare@kucash.in
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Office</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            NO:8, K.NO.13-3, 28TH CROSS, Hulimavu, Bangalore - 560076
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Hours</h3>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Mon-Fri: 9:00 AM - 7:00 PM</p>
                            <p>Sat: 10:00 AM - 5:00 PM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">Visit Our Office</h2>
              <p className="text-lg text-muted-foreground">
                {"Located in Hulimavu, Bangalore. Drop by during business hours for in-person assistance."}
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.4507063141873!2d77.60478007483971!3d12.878714687428122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae152a98db83ad%3A0x19fef03a9fe461e7!2s8%20k%2C%2013%2C%2028th%20Cross%20Rd%2C%20Raghavendra%20Layout%2C%20Hanuman%20Nagar%2C%20Hulimavu%2C%20Bengaluru%2C%20Karnataka%20560076!5e0!3m2!1sen!2sin!4v1766393740067!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
