"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2, CheckCircle2 } from "lucide-react"
import { submitContactForm, type ContactFormData } from "@/app/actions/contact-form"
import { useToast } from "@/hooks/use-toast"

export function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const { toast } = useToast()

    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    })

    const handleInputChange = (field: keyof ContactFormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const result = await submitContactForm(formData)

            if (result.success) {
                setIsSubmitted(true)
                toast({
                    title: "Message Sent!",
                    description: "We've received your message and will respond within 24 hours.",
                })

                // Reset form after 3 seconds
                setTimeout(() => {
                    setIsSubmitted(false)
                    setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        subject: "",
                        message: "",
                    })
                }, 3000)
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to send message. Please try again.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSubmitted) {
        return (
            <Card className="shadow-2xl border-2 border-primary">
                <CardContent className="p-8 lg:p-10 text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-primary flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground">Message Sent Successfully!</h3>
                    <p className="text-muted-foreground">
                        Thank you for reaching out. Our team will get back to you within 24 hours.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="shadow-2xl border-border/50">
            <CardContent className="p-8 lg:p-10">
                <div className="mb-8">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-3 text-foreground">Send us a Message</h2>
                    <p className="text-muted-foreground">Fill out the form below and we'll get back to you within 24 hours</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="contact-name">Full Name *</Label>
                            <Input
                                id="contact-name"
                                placeholder="John Doe"
                                required
                                className="h-12"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact-phone">Phone Number *</Label>
                            <Input
                                id="contact-phone"
                                type="tel"
                                placeholder="+91 XXXXX XXXXX"
                                required
                                className="h-12"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contact-email">Email Address *</Label>
                        <Input
                            id="contact-email"
                            type="email"
                            placeholder="your.email@example.com"
                            required
                            className="h-12"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contact-subject">Subject *</Label>
                        <Input
                            id="contact-subject"
                            placeholder="How can we help you?"
                            required
                            className="h-12"
                            value={formData.subject}
                            onChange={(e) => handleInputChange("subject", e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contact-message">Message *</Label>
                        <Textarea
                            id="contact-message"
                            placeholder="Tell us more about your query..."
                            rows={6}
                            required
                            value={formData.message}
                            onChange={(e) => handleInputChange("message", e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full rounded-full bg-primary hover:bg-primary/90 h-14"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-5 w-5" />
                                Send Message
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
