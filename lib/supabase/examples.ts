// Example: How to use Supabase in your application

// ============================================
// 1. CLIENT COMPONENT EXAMPLE
// ============================================
// Use this in "use client" components (e.g., forms, interactive UI)

import { createClient } from "@/lib/supabase/client"

export function ClientComponentExample() {
    const supabase = createClient()

    // Example: Insert data
    async function handleSubmit(formData: any) {
        const { data, error } = await supabase.from("loan_applications").insert({
            name: formData.name,
            email: formData.email,
            amount: formData.amount,
        })

        if (error) {
            console.error("Error:", error)
        } else {
            console.log("Success:", data)
        }
    }

    // Example: Fetch data
    async function fetchApplications() {
        const { data, error } = await supabase.from("loan_applications").select("*")

        if (error) {
            console.error("Error:", error)
        } else {
            console.log("Applications:", data)
        }
    }

    return <div>Client Component Example </div>
}

// ============================================
// 2. SERVER COMPONENT EXAMPLE
// ============================================
// Use this in Server Components (default in Next.js App Router)

import { createClient as createServerClient } from "@/lib/supabase/server"

export async function ServerComponentExample() {
    const supabase = await createServerClient()

    // Example: Fetch data on the server
    const { data: applications, error } = await supabase.from("loan_applications").select("*")

    if (error) {
        console.error("Error:", error)
        return <div>Error loading applications </div>
    }

    return (
        <div>
        { applications?.map((app) => (
            <div key= { app.id } > { app.name } </div>
      ))
}
</div>
  )
}

// ============================================
// 3. SERVER ACTION EXAMPLE
// ============================================
// Use this for form submissions and mutations

"use server"

import { createClient as createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitLoanApplication(formData: FormData) {
    const supabase = await createServerClient()

    const { data, error } = await supabase.from("loan_applications").insert({
        name: formData.get("name"),
        email: formData.get("email"),
        amount: formData.get("amount"),
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/applications")
    return { success: true, data }
}

// ============================================
// 4. AUTHENTICATION EXAMPLE
// ============================================

// Sign Up
export async function signUp(email: string, password: string) {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    return { data, error }
}

// Sign In
export async function signIn(email: string, password: string) {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    return { data, error }
}

// Sign Out
export async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
}

// Get Current User
export async function getCurrentUser() {
    const supabase = await createServerClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    return user
}
