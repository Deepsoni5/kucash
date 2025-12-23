"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface ContactFormData {
    name: string
    email: string
    phone: string
    subject: string
    message: string
}

export async function submitContactForm(data: ContactFormData) {
    try {
        const supabase = await createClient()

        // Prepare the data for insertion
        const contactData = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            subject: data.subject,
            message: data.message,
            status: "new",
        }

        const { data: result, error } = await supabase.from("contact_submissions").insert(contactData).select().single()

        if (error) {
            console.error("Supabase error:", error)
            return {
                success: false,
                error: "Failed to submit your message. Please try again.",
            }
        }

        // Revalidate the path if needed
        revalidatePath("/contact")

        return {
            success: true,
            data: result,
            submissionId: result.id,
        }
    } catch (error) {
        console.error("Server action error:", error)
        return {
            success: false,
            error: "An unexpected error occurred. Please try again.",
        }
    }
}
