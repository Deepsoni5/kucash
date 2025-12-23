"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface LoanApplicationData {
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth: string
    loanType: string
    loanAmount: number
    tenure: string
    purpose: string
    employmentType: string
    monthlyIncome: number
    companyName: string
}

export async function submitLoanApplication(data: LoanApplicationData) {
    try {
        const supabase = await createClient()

        // Prepare the data for insertion
        const applicationData = {
            full_name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            phone: data.phone,
            loan_type: data.loanType,
            loan_amount: data.loanAmount,
            loan_purpose: data.purpose,
            employment_type: data.employmentType,
            monthly_income: data.monthlyIncome,
            company_name: data.companyName,
            status: "pending",
        }

        const { data: result, error } = await supabase.from("loan_applications").insert(applicationData).select().single()

        if (error) {
            console.error("Supabase error:", error)
            return {
                success: false,
                error: "Failed to submit application. Please try again.",
            }
        }

        // Revalidate the path if needed
        revalidatePath("/")

        return {
            success: true,
            data: result,
            applicationId: result.id,
        }
    } catch (error) {
        console.error("Server action error:", error)
        return {
            success: false,
            error: "An unexpected error occurred. Please try again.",
        }
    }
}
