"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is the minimum loan amount I can apply for?",
    answer:
      "The minimum loan amount varies by loan type. For personal loans, it starts from ₹50,000, while for business loans it starts from ₹1,00,000. Contact our team for specific requirements.",
  },
  {
    question: "How long does the approval process take?",
    answer:
      "We offer one of the fastest approval processes in the industry. Most applications are processed within a few hours, and funds are disbursed within 24 hours of approval.",
  },
  {
    question: "What documents are required for a loan application?",
    answer:
      "Basic documents include PAN Card, Aadhaar Card, income proof (salary slips/ITR/bank statements), and address proof. Additional documents may be required based on the loan type.",
  },
  {
    question: "Can I prepay my loan without penalties?",
    answer:
      "Yes! We offer flexible prepayment options with minimal or no prepayment charges. You can partially or fully prepay your loan after a minimum tenure period.",
  },
  {
    question: "What is the interest rate for loans?",
    answer:
      "Interest rates vary based on loan type, amount, and tenure. Personal loans start from 9.99%, business loans from 11%, and loan against property from 8.5%. Contact us for personalized rates.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "We use bank-grade 256-bit SSL encryption and follow strict RBI guidelines to ensure your data is completely secure. We never share your information with third parties.",
  },
]

export function FAQSection() {
  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            <span className="text-foreground">Frequently Asked </span>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            {"Got questions? We have answers. Find everything you need to know about our loan process."}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-2xl px-6 bg-card hover:border-primary/50 transition-colors"
              >
                <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-pretty">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
