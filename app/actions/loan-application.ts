"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface LoanApplicationData {
    fullName: string
    email: string
    phone: string
    gender: string
    dateOfBirth: string
    currentAddress: string
    permanentAddress: string
    panNumber: string
    aadharNumber: string
    loanType: string
    loanAmount: number
    tenure: string
    purpose: string
    employmentType: string
    monthlyIncome: number
    companyName: string
    referralCode?: string
}

export async function submitLoanApplication(data: LoanApplicationData) {
    try {
        const supabase = await createClient()

        // Prepare the data for insertion
        const applicationData = {
            full_name: data.fullName,
            email: data.email,
            phone: data.phone,
            gender: data.gender,
            date_of_birth: data.dateOfBirth,
            current_address: data.currentAddress,
            permanent_address: data.permanentAddress,
            pan_number: data.panNumber,
            aadhar_number: data.aadharNumber,
            loan_type: data.loanType,
            loan_amount: data.loanAmount,
            loan_purpose: data.purpose,
            employment_type: data.employmentType,
            monthly_income: data.monthlyIncome,
            company_name: data.companyName,
            referral_code: data.referralCode,
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
