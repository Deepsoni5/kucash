"use server";

import { createClient } from "@/lib/supabase/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

async function generateAgentId(fullName: string, supabase: any): Promise<string> {
  // 1. Generate Prefix
  // Logic: 'A' + First Char of First Name + Last Char of First Name
  // Example: "Deep Soni" -> "DEEP" -> 'A' + 'D' + 'P' = "ADP"
  
  const cleanName = fullName || "USER";
  const firstWord = cleanName.trim().split(" ")[0].toUpperCase();
  
  let prefix = "A";
  if (firstWord.length > 0) {
    prefix += firstWord.charAt(0);
    prefix += firstWord.charAt(firstWord.length - 1);
  } else {
    prefix = "AXX"; // Fallback if name is empty (shouldn't happen)
  }

  // 2. Find Max Sequence for this prefix
  // We need to find all agent_ids that start with this prefix and are 6 chars long
  const { data: agents, error } = await supabase
    .from("users")
    .select("agent_id")
    .like("agent_id", `${prefix}%`);

  let maxSeq = 0;

  if (agents && agents.length > 0) {
    agents.forEach((agent: any) => {
      if (agent.agent_id && agent.agent_id.length === 6) {
        // Extract the numeric part (last 3 digits)
        const seqStr = agent.agent_id.substring(3);
        const seq = parseInt(seqStr, 10);
        if (!isNaN(seq) && seq > maxSeq) {
          maxSeq = seq;
        }
      }
    });
  }

  // 3. Generate New ID
  const nextSeq = maxSeq + 1;
  const paddedSeq = nextSeq.toString().padStart(3, "0");
  
  return `${prefix}${paddedSeq}`;
}

export async function becomeAgent(formData: FormData) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get form data
    const postalAddress = formData.get("postal_address") as string;
    const gpayNumber = formData.get("phone_gpay_number") as string;
    const photoFile = formData.get("photo_url") as File;

    if (!postalAddress || !gpayNumber || !photoFile) {
      return { success: false, error: "All fields are required" };
    }

    // Validate GPay number (10 digits)
    const cleanGpay = gpayNumber.replace(/\D/g, "");
    if (cleanGpay.length !== 10) {
      return { success: false, error: "Please enter a valid 10-digit GPay number" };
    }

    // Get user profile for name
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("full_name")
      .eq("user_id", user.id)
      .single();

    if (profileError || !userProfile) {
      return { success: false, error: "User profile not found" };
    }

    // Upload photo to Cloudinary
    let photoUrl = "";
    if (photoFile.size > 0) {
      const arrayBuffer = await photoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const uploadResult = await uploadToCloudinary(buffer, {
        folder: "kucash/agents",
        resource_type: "image",
      });
      
      photoUrl = uploadResult.secure_url;
    } else {
       return { success: false, error: "Profile photo is required" };
    }

    // Generate Agent ID using user's specific logic
    const agentId = await generateAgentId(userProfile.full_name, supabase);

    // Update user profile
    const { error } = await supabase
      .from("users")
      .update({
        role: "agent",
        agent_id: agentId,
        postal_address: postalAddress,
        phone_gpay_number: cleanGpay,
        photo_url: photoUrl,
      })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating user to agent:", error);
      // Handle specific database errors
      if (error.code === '22001') {
         return { success: false, error: "Data too long for field. Please contact support." };
      }
      return { success: false, error: "Failed to update profile. Please try again." };
    }

    revalidatePath("/customer/dashboard");
    revalidatePath("/agent/dashboard");
    
    return { success: true, redirectUrl: "/agent/dashboard" };

  } catch (error) {
    console.error("Error in becomeAgent:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
