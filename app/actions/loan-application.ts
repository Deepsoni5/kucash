"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { uploadToCloudinary } from "@/lib/cloudinary";

export interface LoanApplicationData {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  currentAddress: string;
  permanentAddress: string;
  panNumber: string;
  aadharNumber: string;
  loanType: string;
  loanAmount: number;
  tenure: string;
  purpose: string;
  employmentType: string;
  monthlyIncome: number;
  companyName: string;
  referralCode?: string;
  // Document files
  panCard?: File;
  aadharCard?: File;
  incomeProof?: File;
  addressProof?: File;
  otherDocuments?: { name: string; file: File }[];
}

// Commission calculation based on loan amount
function calculateCommission(loanAmount: number): number {
  if (loanAmount <= 500000) return 1000;
  if (loanAmount <= 1000000) return 3000;
  if (loanAmount <= 1500000) return 5000;
  if (loanAmount <= 3000000) return 7500;
  if (loanAmount <= 5000000) return 15000;
  return 20000; // Above 50 lakh
}

// Generate loan ID with format: KC + YY + F + SSS
// KC = Fixed prefix, YY = Last 2 digits of year, F = First char of name, SSS = Sequence
async function generateLoanId(fullName: string): Promise<string> {
  try {
    const supabase = await createClient();

    // Get current year's last 2 digits
    const currentYear = new Date().getFullYear();
    const yearSuffix = currentYear.toString().slice(-2); // e.g., "25" for 2025

    // Extract first character of first word from full name
    const firstWord = fullName.trim().split(" ")[0];
    const firstChar = firstWord.charAt(0).toUpperCase();

    // Create first 5 characters: KC + YY + F
    const prefix = `KC${yearSuffix}${firstChar}`; // e.g., "KC25D"

    console.log("=== LOAN ID GENERATION ===");
    console.log("Full Name:", fullName);
    console.log("Current Year:", currentYear);
    console.log("Year Suffix:", yearSuffix);
    console.log("First Character:", firstChar);
    console.log("Prefix (first 5 chars):", prefix);

    // Query database to find existing loan IDs with same prefix
    const { data: existingLoans, error } = await supabase
      .from("loan_applications")
      .select("loan_id")
      .like("loan_id", `${prefix}%`)
      .order("loan_id", { ascending: false });

    if (error) {
      console.error("Error querying existing loans:", error);
      // Fallback to 001 if query fails
      const loanId = `${prefix}001`;
      console.log("Query failed, using fallback:", loanId);
      return loanId;
    }

    console.log("Existing loans with prefix:", existingLoans);

    let nextSequence = 1;

    if (existingLoans && existingLoans.length > 0) {
      // Extract sequence numbers from existing loan IDs
      const sequences = existingLoans
        .map((loan: { loan_id: string }) => {
          const loanId = loan.loan_id;
          if (loanId && loanId.startsWith(prefix) && loanId.length === 8) {
            const sequenceStr = loanId.slice(-3); // Last 3 characters
            const sequenceNum = parseInt(sequenceStr, 10);
            return isNaN(sequenceNum) ? 0 : sequenceNum;
          }
          return 0;
        })
        .filter((seq: number) => seq > 0)
        .sort((a: number, b: number) => b - a); // Sort descending

      console.log("Extracted sequences:", sequences);

      if (sequences.length > 0) {
        nextSequence = sequences[0] + 1; // Increment highest sequence
      }
    }

    // Format sequence as 3-digit string with leading zeros
    const sequenceStr = nextSequence.toString().padStart(3, "0");
    const loanId = `${prefix}${sequenceStr}`;

    console.log("Next sequence:", nextSequence);
    console.log("Generated Loan ID:", loanId);
    console.log("=== END LOAN ID GENERATION ===");

    return loanId;
  } catch (error) {
    console.error("Error in generateLoanId:", error);
    // Fallback to timestamp-based ID if everything fails
    const timestamp = Date.now().toString();
    const fallbackId = `KC${timestamp.slice(-6)}`;
    console.log("Using fallback ID:", fallbackId);
    return fallbackId;
  }
}

// Upload file to Cloudinary
async function uploadFile(
  file: File,
  folder: string,
  filename: string
): Promise<string | null> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadToCloudinary(buffer, {
      folder: `kucash/documents/${folder}`,
      public_id: filename,
      resource_type: file.type === "application/pdf" ? "raw" : "image",
      tags: ["loan-application", "document"],
    });

    return result.secure_url;
  } catch (error) {
    console.error(`Error uploading ${filename}:`, error);
    return null;
  }
}

// Validate referral code (agent ID)
export async function validateReferralCode(referralCode: string) {
  try {
    const supabase = await createClient();

    if (!referralCode || referralCode.trim() === "") {
      return { valid: true }; // Empty referral code is allowed
    }

    const { data: agent, error } = await supabase
      .from("users")
      .select("id, agent_id, full_name")
      .eq("agent_id", referralCode.toUpperCase())
      .eq("role", "agent")
      .eq("is_active", true)
      .single();

    if (error || !agent) {
      return {
        valid: false,
        error: "Please enter a valid referral code",
      };
    }

    return {
      valid: true,
      agent: {
        id: agent.id,
        agentId: agent.agent_id,
        name: agent.full_name,
      },
    };
  } catch (error) {
    console.error("Referral code validation error:", error);
    return {
      valid: false,
      error: "Unable to validate referral code. Please try again.",
    };
  }
}

export async function submitLoanApplication(formData: FormData) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !authUser) {
      return {
        success: false,
        error: "You must be logged in to submit an application.",
      };
    }

    // Extract form data
    const data = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      gender: formData.get("gender") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
      currentAddress: formData.get("currentAddress") as string,
      permanentAddress: formData.get("permanentAddress") as string,
      panNumber: formData.get("panNumber") as string,
      aadharNumber: formData.get("aadharNumber") as string,
      loanType: formData.get("loanType") as string,
      loanAmount: Number(formData.get("loanAmount")),
      tenure: Number(formData.get("tenure")),
      purpose: formData.get("purpose") as string,
      employmentType: formData.get("employmentType") as string,
      monthlyIncome: Number(formData.get("monthlyIncome")),
      companyName: formData.get("companyName") as string,
      referralCode: (formData.get("referralCode") as string) || null,
    };

    // Validate field lengths before processing
    console.log("=== FORM DATA VALIDATION ===");
    const validationErrors: string[] = [];

    if (data.panNumber && data.panNumber.length > 12) {
      validationErrors.push(
        `PAN Number too long: ${data.panNumber.length} chars (max 12)`
      );
    }
    if (data.aadharNumber && data.aadharNumber.length > 12) {
      validationErrors.push(
        `Aadhaar Number too long: ${data.aadharNumber.length} chars (max 12)`
      );
    }
    if (data.phone && data.phone.length > 15) {
      validationErrors.push(
        `Phone too long: ${data.phone.length} chars (max 15)`
      );
    }
    if (data.gender && data.gender.length > 10) {
      validationErrors.push(
        `Gender too long: ${data.gender.length} chars (max 10)`
      );
    }
    if (data.loanType && data.loanType.length > 20) {
      validationErrors.push(
        `Loan Type too long: ${data.loanType.length} chars (max 20)`
      );
    }
    if (data.employmentType && data.employmentType.length > 20) {
      validationErrors.push(
        `Employment Type too long: ${data.employmentType.length} chars (max 20)`
      );
    }

    // Validate file sizes (2MB limit per file)
    const maxFileSize = 2 * 1024 * 1024; // 2MB
    const panCardFile = formData.get("panCard") as File;
    const aadharCardFile = formData.get("aadharCard") as File;
    const incomeProofFile = formData.get("incomeProof") as File;
    const addressProofFile = formData.get("addressProof") as File;

    if (panCardFile && panCardFile.size > maxFileSize) {
      validationErrors.push(
        `PAN Card file too large: ${(panCardFile.size / 1024 / 1024).toFixed(
          2
        )}MB (max 2MB)`
      );
    }
    if (aadharCardFile && aadharCardFile.size > maxFileSize) {
      validationErrors.push(
        `Aadhaar Card file too large: ${(
          aadharCardFile.size /
          1024 /
          1024
        ).toFixed(2)}MB (max 2MB)`
      );
    }
    if (incomeProofFile && incomeProofFile.size > maxFileSize) {
      validationErrors.push(
        `Income Proof file too large: ${(
          incomeProofFile.size /
          1024 /
          1024
        ).toFixed(2)}MB (max 2MB)`
      );
    }
    if (addressProofFile && addressProofFile.size > maxFileSize) {
      validationErrors.push(
        `Address Proof file too large: ${(
          addressProofFile.size /
          1024 /
          1024
        ).toFixed(2)}MB (max 2MB)`
      );
    }

    if (validationErrors.length > 0) {
      console.error("Validation errors:", validationErrors);
      return {
        success: false,
        error: `Validation failed: ${validationErrors.join(", ")}`,
      };
    }
    console.log("=== VALIDATION PASSED ===");

    // Generate loan ID
    const loanId = await generateLoanId(data.fullName);

    // Handle referral code and agent commission
    let agentId: string | null = null;
    let agentCommission: number = 0;

    if (data.referralCode) {
      // Check if referral code exists in users table
      const { data: agent, error: agentError } = await supabase
        .from("users")
        .select("id, agent_id, full_name")
        .eq("agent_id", data.referralCode)
        .eq("role", "agent")
        .eq("is_active", true)
        .single();

      console.log("=== AGENT LOOKUP DEBUG ===");
      console.log("Referral code:", data.referralCode);
      console.log("Agent found:", agent);
      console.log("Agent error:", agentError);
      console.log("=== END AGENT DEBUG ===");

      if (agent && !agentError) {
        agentId = data.referralCode;
        agentCommission = calculateCommission(data.loanAmount);
        console.log(
          "Agent assigned - Agent ID:",
          agent.agent_id,
          "Commission:",
          agentCommission
        );
      } else {
        console.log(
          "Agent not found or error occurred, proceeding without agent assignment"
        );
        // Don't assign agent if not found or error occurred
        agentId = null;
        agentCommission = 0;
      }
    }

    // Upload documents to Cloudinary
    const timestamp = Date.now();
    let panCardUrl: string | null = null;
    let aadharCardUrl: string | null = null;
    let incomeProofUrl: string | null = null;
    let addressProofUrl: string | null = null;
    let otherDocumentsData: { name: string; url: string }[] | null = null;

    // Upload PAN card
    if (panCardFile && panCardFile.size > 0) {
      panCardUrl = await uploadFile(
        panCardFile,
        "pan",
        `pan_${loanId}_${timestamp}`
      );
    }

    // Upload Aadhaar card
    if (aadharCardFile && aadharCardFile.size > 0) {
      aadharCardUrl = await uploadFile(
        aadharCardFile,
        "aadhar",
        `aadhar_${loanId}_${timestamp}`
      );
    }

    // Upload income proof
    if (incomeProofFile && incomeProofFile.size > 0) {
      incomeProofUrl = await uploadFile(
        incomeProofFile,
        "income",
        `income_${loanId}_${timestamp}`
      );
    }

    // Upload address proof
    if (addressProofFile && addressProofFile.size > 0) {
      addressProofUrl = await uploadFile(
        addressProofFile,
        "address",
        `address_${loanId}_${timestamp}`
      );
    }

    // Handle other documents
    const otherDocsCount = Number(formData.get("otherDocsCount") || "0");
    if (otherDocsCount > 0) {
      const otherDocs = [];
      for (let i = 0; i < otherDocsCount; i++) {
        const docName = formData.get(`otherDocName_${i}`) as string;
        const docFile = formData.get(`otherDocFile_${i}`) as File;

        if (docFile && docFile.size > 0 && docName) {
          const docUrl = await uploadFile(
            docFile,
            "other",
            `other_${loanId}_${i}_${timestamp}`
          );
          if (docUrl) {
            otherDocs.push({ name: docName, url: docUrl });
          }
        }
      }
      if (otherDocs.length > 0) {
        otherDocumentsData = otherDocs;
      }
    }

    // Get client IP and user agent
    const headers = new Headers();
    const ipAddress =
      headers.get("x-forwarded-for") || headers.get("x-real-ip") || null;
    const userAgent = headers.get("user-agent") || null;

    // Prepare the data for insertion
    const applicationData = {
      loan_id: loanId,
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
      tenure: data.tenure,
      employment_type: data.employmentType,
      monthly_income: data.monthlyIncome,
      company_name: data.companyName,
      status: "pending",
      referral_code: data.referralCode,
      agent_id: agentId,
      agent_commission: agentCommission,
      user_id: authUser.id,
      pan_card_url: panCardUrl,
      aadhar_card_url: aadharCardUrl,
      income_proof_url: incomeProofUrl,
      address_proof_url: addressProofUrl,
      other_documents: otherDocumentsData,
      application_source: "website",
      ip_address: ipAddress,
      user_agent: userAgent,
    };

    // Log data lengths for debugging
    console.log("=== LOAN APPLICATION DATA LENGTHS ===");
    console.log("loan_id:", loanId, "length:", loanId?.length);
    console.log("full_name:", data.fullName, "length:", data.fullName?.length);
    console.log("email:", data.email, "length:", data.email?.length);
    console.log("phone:", data.phone, "length:", data.phone?.length);
    console.log("gender:", data.gender, "length:", data.gender?.length);
    console.log(
      "pan_number:",
      data.panNumber,
      "length:",
      data.panNumber?.length
    );
    console.log(
      "aadhar_number:",
      data.aadharNumber,
      "length:",
      data.aadharNumber?.length
    );
    console.log("loan_type:", data.loanType, "length:", data.loanType?.length);
    console.log(
      "employment_type:",
      data.employmentType,
      "length:",
      data.employmentType?.length
    );
    console.log(
      "referral_code:",
      data.referralCode,
      "length:",
      data.referralCode?.length
    );
    console.log("agent_id:", agentId, "length:", agentId?.length);
    console.log("status:", "pending", "length:", "pending".length);
    console.log("application_source:", "website", "length:", "website".length);
    console.log("=== END DATA LENGTHS ===");

    const { data: result, error } = await supabase
      .from("loan_applications")
      .insert(applicationData)
      .select()
      .single();

    if (error) {
      console.error("=== DETAILED SUPABASE ERROR ===");
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Error details:", error.details);
      console.error("Error hint:", error.hint);
      console.error("Full error object:", JSON.stringify(error, null, 2));
      console.error(
        "Application data being inserted:",
        JSON.stringify(applicationData, null, 2)
      );
      console.error("=== END DETAILED ERROR ===");
      return {
        success: false,
        error: `Database error: ${error.message} (Code: ${error.code})`,
      };
    }

    // Revalidate the path if needed
    revalidatePath("/");

    return {
      success: true,
      data: result,
      applicationId: result.loan_id,
    };
  } catch (error) {
    console.error("Server action error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
