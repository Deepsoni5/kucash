"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface SignupData {
  fullName: string;
  mobileNumber: string;
  email: string;
  password: string;
  role: "user" | "agent";
  postalAddress?: string;
  phoneGpayNumber?: string;
  photoUrl?: string;
}

export async function signupUser(formData: FormData) {
  const supabase = await createClient();

  const signupData: SignupData = {
    fullName: formData.get("fullName") as string,
    mobileNumber: formData.get("mobileNumber") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    role: formData.get("role") as "user" | "agent",
    postalAddress: (formData.get("postalAddress") as string) || undefined,
    phoneGpayNumber: (formData.get("phoneGpayNumber") as string) || undefined,
    photoUrl: (formData.get("photoUrl") as string) || undefined,
  };

  console.log("🔍 SIGNUP DEBUG - Form Data:", {
    fullName: signupData.fullName,
    email: signupData.email,
    role: signupData.role,
    mobileNumber: signupData.mobileNumber,
    postalAddress: signupData.postalAddress,
    phoneGpayNumber: signupData.phoneGpayNumber,
    photoUrl: signupData.photoUrl ? "PROVIDED" : "NOT_PROVIDED",
  });

  try {
    const metaData = {
      full_name: signupData.fullName,
      mobile_number: signupData.mobileNumber,
      role: signupData.role,
      postal_address: signupData.postalAddress,
      phone_gpay_number: signupData.phoneGpayNumber,
      photo_url: signupData.photoUrl,
    };

    console.log("🔍 SIGNUP DEBUG - Metadata being sent:", metaData);

    // Use Supabase Auth for signup
    const { data, error } = await supabase.auth.signUp({
      email: signupData.email,
      password: signupData.password,
      options: {
        data: metaData,
      },
    });

    console.log("🔍 SIGNUP DEBUG - Supabase response:", {
      data: data?.user?.id,
      error: error?.message,
    });

    if (error) {
      console.error("❌ SIGNUP ERROR - Supabase Auth Error:", {
        message: error.message,
        status: error.status,
        name: error.name,
        cause: error.cause,
      });
      return { error: error.message };
    }

    // Get the user profile to retrieve agent_id if generated
    let userProfile = null;
    if (data.user) {
      console.log("🔍 SIGNUP DEBUG - User created, waiting for trigger...");

      // Wait a moment for the trigger to complete
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("🔍 SIGNUP DEBUG - Fetching user profile...");

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", data.user.id)
        .single();

      console.log("🔍 SIGNUP DEBUG - Profile fetch result:", {
        profile: profile ? "FOUND" : "NOT_FOUND",
        profileError: profileError?.message,
        userId: data.user.id,
      });

      if (profileError) {
        console.error("❌ SIGNUP ERROR - Profile fetch failed:", {
          message: profileError.message,
          code: profileError.code,
          details: profileError.details,
          hint: profileError.hint,
        });
      }

      userProfile = profile;
    }

    console.log("🔍 SIGNUP DEBUG - Final result:", {
      userCreated: !!data.user,
      profileCreated: !!userProfile,
      agentId: userProfile?.agent_id,
      role: userProfile?.role,
    });

    return {
      success: true,
      message: data.user?.email_confirmed_at
        ? "Account created successfully!"
        : "Account created! Please check your email to verify your account.",
      user: data.user,
      agentId: userProfile?.agent_id,
      needsEmailVerification: !data.user?.email_confirmed_at,
    };
  } catch (error) {
    console.error("❌ SIGNUP ERROR - Unexpected error:", {
      error: error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { error: "Failed to create account. Please try again." };
  }
}

export async function loginUser(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    // Use Supabase Auth for login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      return { error: error.message };
    }

    if (!data.user) {
      return { error: "Login failed" };
    }

    // Check if email is verified
    if (!data.user.email_confirmed_at) {
      return { error: "Please verify your email before logging in" };
    }

    // Get user profile from our custom table
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", data.user.id)
      .single();

    if (profileError || !userProfile) {
      console.error("Profile fetch error:", profileError);
      return { error: "User profile not found" };
    }

    return {
      success: true,
      message: "Login successful!",
      user: {
        id: userProfile.id,
        userId: userProfile.user_id,
        fullName: userProfile.full_name,
        email: userProfile.email,
        role: userProfile.role,
        agentId: userProfile.agent_id,
        mobileNumber: userProfile.mobile_number,
        isActive: userProfile.is_active,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Failed to login. Please try again." };
  }
}

export async function logoutUser() {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: error.message };
    }
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { error: "Failed to logout" };
  }
}

export async function getCurrentUser() {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return { user: null };
    }

    // Get user profile from our custom table
    const { data: userProfile } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", user.id)
      .single();

    return {
      user: userProfile
        ? {
            id: userProfile.id,
            userId: userProfile.user_id,
            fullName: userProfile.full_name,
            email: userProfile.email,
            role: userProfile.role,
            agentId: userProfile.agent_id,
            mobileNumber: userProfile.mobile_number,
            isActive: userProfile.is_active,
          }
        : null,
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return { user: null };
  }
}

export async function resendVerificationEmail() {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: "", // Will use the current user's email
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true, message: "Verification email sent!" };
  } catch (error) {
    console.error("Resend verification error:", error);
    return { error: "Failed to resend verification email" };
  }
}

export async function uploadPhoto(
  file: File
): Promise<{ url?: string; publicId?: string; error?: string }> {
  try {
    // Create FormData for the upload action
    const formData = new FormData();
    formData.append("file", file);

    // Use the Cloudinary upload action
    const { uploadAgentPhoto } = await import("./upload-actions");
    const result = await uploadAgentPhoto(formData);

    if (!result.success) {
      return { error: result.error };
    }

    return {
      url: result.url,
      publicId: result.publicId,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Failed to upload photo" };
  }
}
