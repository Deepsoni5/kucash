import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { PartnersSection } from "@/components/partners-section";
import { LoanProductsSection } from "@/components/loan-products-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { InnovationSection } from "@/components/innovation-section";
import { FeaturesSection } from "@/components/features-section";
import { StatsSection } from "@/components/stats-section";
import { EMICTASection } from "@/components/emi-cta-section";
import { FinancialInsightsSection } from "@/components/financial-insights-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { BlogSection } from "@/components/blog-section";
import { LoanApplicationForm } from "@/components/loan-application-form";
import { FAQSection } from "@/components/faq-section";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { getFeaturedPosts } from "@/app/actions/blog-actions";

export default async function HomePage() {
  // Fetch featured blog posts for the blog section
  const featuredPosts = await getFeaturedPosts();

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <PartnersSection />
        <LoanProductsSection />
        <HowItWorksSection />
        <InnovationSection />
        <FeaturesSection />
        <StatsSection />
        <EMICTASection />
        <FinancialInsightsSection />
        <BlogSection posts={featuredPosts.slice(0, 3)} />
        <TestimonialsSection />
        <LoanApplicationForm />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
