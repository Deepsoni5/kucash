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

export async function resetPassword(formData: FormData) {
  console.log("🚀🚀🚀 RESET PASSWORD FUNCTION CALLED - NEW CODE 🚀🚀🚀");
  const email = formData.get("email") as string;
  console.log("📧 EMAIL:", email);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const redirectTo = `${siteUrl}/reset-password`;

  console.log("🔍 ENVIRONMENT CHECK:", {
    email,
    siteUrl,
    redirectTo,
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasEmailUser: !!process.env.EMAIL_USER,
    hasEmailAppPassword: !!process.env.EMAIL_APP_PASSWORD,
  });

  try {
    // Check if service role key is available for Admin API
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
      console.error("❌ STEP 1 FAILED: SUPABASE_SERVICE_ROLE_KEY not found");
      console.error(
        "⚠️ Please add SUPABASE_SERVICE_ROLE_KEY to your .env file"
      );
      return {
        error: "Email service configuration missing. Please contact support.",
      };
    }
    console.log("✅ STEP 1: Service role key found");

    // Use Admin API to generate link without sending email
    console.log("🔄 STEP 2: Creating Supabase Admin client...");
    const { createClient: createAdminClient } = await import(
      "@supabase/supabase-js"
    );
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
    console.log("✅ STEP 2: Admin client created");

    // First, check if user exists using the users table
    console.log("🔄 STEP 3: Checking if user exists...");
    const supabase = await createClient();
    const { data: userProfile, error: userError } = await supabase
      .from("users")
      .select("user_id, email")
      .eq("email", email)
      .single();

    if (userError || !userProfile) {
      // Don't reveal if user exists or not for security
      console.log(
        "⚠️ STEP 3: User not found, but returning success for security"
      );
      return {
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      };
    }
    console.log("✅ STEP 3: User found:", userProfile.user_id);

    // Generate the recovery link using Admin API
    console.log("🔄 STEP 4: Generating recovery link...");
    const { data: linkData, error: linkError } =
      await adminSupabase.auth.admin.generateLink({
        type: "recovery",
        email: email,
        options: {
          redirectTo,
        },
      });

    if (linkError) {
      console.error("❌ STEP 4 ERROR:", linkError);
      console.error("❌ Link error details:", {
        message: linkError.message,
        status: linkError.status,
        name: linkError.name,
      });
    }

    if (linkError || !linkData?.properties?.action_link) {
      console.error("❌ STEP 4 FAILED: Error generating reset link");
      return { error: "Failed to generate reset link. Please try again." };
    }

    const resetLink = linkData.properties.action_link;
    console.log("✅ STEP 4: Reset link generated successfully");
    console.log("🔗 RESET LINK:", resetLink.substring(0, 100) + "...");

    // Get user's name for email personalization (use the userProfile from step 3)
    console.log("🔄 STEP 5: Using user profile from step 3...");
    const { data: fullUserProfile, error: profileError } = await supabase
      .from("users")
      .select("full_name")
      .eq("email", email)
      .single();

    if (profileError) {
      console.log(
        "⚠️ STEP 5: Could not fetch user profile:",
        profileError.message
      );
    }

    const userName = fullUserProfile?.full_name || undefined;
    console.log(
      "✅ STEP 5: User profile fetched, name:",
      userName || "Not found"
    );

    // Send email using Nodemailer
    console.log("🔄 STEP 6: Preparing email template...");
    const { sendEmail } = await import("@/lib/nodemailer");
    const { getPasswordResetEmailTemplate } = await import(
      "@/lib/email-templates"
    );

    const emailTemplate = getPasswordResetEmailTemplate(resetLink, userName);
    console.log("✅ STEP 6: Email template prepared");
    console.log("📧 EMAIL TEMPLATE:", {
      subject: emailTemplate.subject,
      htmlLength: emailTemplate.html.length,
      textLength: emailTemplate.text.length,
    });

    console.log("🔄 STEP 7: Sending email via Nodemailer...");
    try {
      const emailResult = await sendEmail({
        to: email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      });

      console.log("✅ STEP 7: Email sent successfully!");
      console.log("📧 EMAIL RESULT:", emailResult);
      console.log("=".repeat(60));
      console.log("✅ RESET PASSWORD COMPLETED SUCCESSFULLY");
      console.log("=".repeat(60));

      return {
        success: true,
        message: "Password reset email sent successfully!",
      };
    } catch (emailError: any) {
      console.error("❌ STEP 7 FAILED: Error sending email via Nodemailer");
      console.error("❌ EMAIL ERROR:", emailError);
      console.error("❌ EMAIL ERROR DETAILS:", {
        message: emailError.message,
        code: emailError.code,
        command: emailError.command,
        response: emailError.response,
        responseCode: emailError.responseCode,
        stack: emailError.stack,
      });
      console.log("=".repeat(60));
      return {
        error:
          emailError.message ||
          "Failed to send reset email. Please try again later.",
      };
    }
  } catch (error: any) {
    console.error("❌ RESET PASSWORD FATAL ERROR:", error);
    console.error("❌ ERROR DETAILS:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    console.log("=".repeat(60));
    return {
      error: error.message || "Failed to send reset email. Please try again.",
    };
  }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const code = formData.get("code") as string;

  console.log("🔍 UPDATE PASSWORD DEBUG:", {
    hasPassword: !!password,
    hasCode: !!code,
    code: code?.substring(0, 10) + "...", // Log partial code for debugging
  });

  try {
    // Exchange the code for a session
    const { data: sessionData, error: sessionError } =
      await supabase.auth.exchangeCodeForSession(code);

    console.log("🔍 EXCHANGE CODE RESPONSE:", {
      hasSession: !!sessionData.session,
      hasUser: !!sessionData.user,
      error: sessionError?.message,
    });

    if (sessionError) {
      console.error("❌ Session exchange error:", sessionError);

      // Handle PKCE error specifically
      if (sessionError.message?.includes("PKCE code verifier not found")) {
        return {
          error:
            "Please use the same browser where you requested the password reset. If you're using the same browser, try requesting a new password reset link.",
          errorType: "pkce_error",
        };
      }

      // Handle expired code
      if (
        sessionError.message?.includes("expired") ||
        sessionError.status === 400
      ) {
        return {
          error:
            "This password reset link has expired. Please request a new password reset.",
          errorType: "expired_link",
        };
      }

      return { error: "Invalid or expired reset link" };
    }

    if (!sessionData.session) {
      return { error: "Failed to establish session" };
    }

    // Update the user's password
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    console.log("🔍 PASSWORD UPDATE RESPONSE:", {
      error: error?.message,
    });

    if (error) {
      console.error("❌ Update password error:", error);
      return { error: error.message };
    }

    console.log("✅ Password updated successfully");
    return {
      success: true,
      message: "Password updated successfully!",
    };
  } catch (error) {
    console.error("❌ Update password error:", error);
    return { error: "Failed to update password. Please try again." };
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
