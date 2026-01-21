"use server";

import { createClient } from "@/lib/supabase/server";

const META_TOKEN = process.env.META_WHATSAPP_TOKEN;
const PHONE_ID = process.env.META_PHONE_NUMBER_ID;
const TEMPLATE_NAME = process.env.META_TEMPLATE_NAME || "kucash_status";

export async function sendOtp(formData: FormData) {
  const phone = formData.get("phone") as string;

  if (!phone) return { error: "Phone number is required" };

  // Sanitize phone number (keep only digits)
  // We expect a 10-digit number from the frontend
  let cleanPhone = phone.replace(/\D/g, "");

  // Ensure we have the 10-digit number for DB lookup
  // If somehow it has 91 prefix (12 digits), strip it to match DB format
  if (cleanPhone.length === 12 && cleanPhone.startsWith("91")) {
    cleanPhone = cleanPhone.substring(2);
  }

  // Basic validation for Indian numbers (10 digits)
  if (cleanPhone.length !== 10) {
    return { error: "Please enter a valid 10-digit mobile number." };
  }

  const supabase = await createClient();

  // 1. Check if user exists with this phone
  // DB stores number WITHOUT country code (e.g. "7383858204")
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("user_id, email, mobile_number")
    .eq("mobile_number", cleanPhone)
    .single();

  if (userError || !user) {
    console.error("OTP User Check Error:", userError);
    return {
      error:
        "Sorry, phone number does not exist. Do enter a number which is registered.",
    };
  }

  // 2. Rate Limiting (Check last 5 minutes)
  const { count, error: countError } = await supabase
    .from("otp_verifications")
    .select("*", { count: "exact", head: true })
    .eq("phone_number", cleanPhone)
    .gt("created_at", new Date(Date.now() - 5 * 60 * 1000).toISOString());

  if (count && count >= 3) {
    return { error: "Too many attempts. Please try again in 5 minutes." };
  }

  // 3. Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // 4. Save OTP
  // We store the 10-digit number in otp_verifications for consistency
  const { error: insertError } = await supabase
    .from("otp_verifications")
    .insert({
      phone_number: cleanPhone,
      otp_code: otp,
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 mins
      verified: false,
    });

  if (insertError) {
    console.error("OTP Save Error:", insertError);
    return { error: "Failed to generate OTP system error" };
  }

  // 5. Send via Meta WhatsApp API
  // Meta requires country code, so we prepend 91
  const whatsappNumber = "91" + cleanPhone;
  console.log(whatsappNumber);

  try {
    const response = await fetch(
      `https://graph.facebook.com/v24.0/${PHONE_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${META_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: whatsappNumber,
          type: "template",
          template: {
            name: TEMPLATE_NAME,
            language: { code: "en_US" },
            components: [
              {
                type: "body",
                parameters: [{ type: "text", text: otp }],
              },
            ],
          },
        }),
      }
    );

    console.log(response);

    const data = await response.json();

    if (!response.ok) {
      console.error("Meta API Error:", JSON.stringify(data));
      // Don't reveal internal API errors to user, but log it
      return {
        error: "Failed to send OTP via WhatsApp. Please try again later.",
      };
    }
  } catch (err) {
    console.error("Meta Fetch Error:", err);
    return { error: "Failed to connect to WhatsApp service" };
  }

  return { success: true, message: "OTP sent to your WhatsApp number" };
}

export async function verifyOtp(formData: FormData) {
  const phone = formData.get("phone") as string;
  const otp = formData.get("otp") as string;

  let cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.length === 12 && cleanPhone.startsWith("91")) {
    cleanPhone = cleanPhone.substring(2);
  }

  const supabase = await createClient();

  // 1. Verify OTP
  const { data: verification, error: verifyError } = await supabase
    .from("otp_verifications")
    .select("*")
    .eq("phone_number", cleanPhone)
    .eq("otp_code", otp)
    .eq("verified", false)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (verifyError || !verification) {
    return { error: "Invalid or expired OTP" };
  }

  // Mark as verified
  await supabase
    .from("otp_verifications")
    .update({ verified: true })
    .eq("id", verification.id);

  // 2. Get User Email to generate session
  const { data: user } = await supabase
    .from("users")
    .select("email")
    .eq("mobile_number", cleanPhone)
    .single();

  if (!user || !user.email) {
    return { error: "User email not found" };
  }

  // 3. Create Session Directly
    // Instead of magic link, we'll sign in the user using the admin client
    // Note: Supabase doesn't allow creating a session for another user easily without password
    // BUT we can use the admin `generateLink` with type `magiclink` and return the token details
    // OR better: use `signInWithOtp` if phone auth was enabled, but we are using custom table.
    //
    // Since we verified the OTP ourselves, we can trust this request.
    // We will use the Admin API to generate a session (access_token/refresh_token) for the user.

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
        return { error: "Server configuration error" };
    }

    const { createClient: createAdminClient } = await import("@supabase/supabase-js");
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

    // We can use admin.generateLink to get a session
    // But a cleaner way for direct login without redirect is needed.
    // Actually, generateLink returns action_link which is a URL with token hash.
    // We can parse it or just return it. 
    // BUT user said "no magic link". They mean no EMAIL sent.
    // They want direct login. 
    
    // Strategy:
    // 1. Generate the magic link (it doesn't send email if we use generateLink)
    // 2. Extract the tokens or just return the URL and let frontend `router.push` to it
    //    The `router.push` will hit the callback and set cookies.
    //    This is technically a "magic link" flow but it feels instant to the user (no email checking).
    //
    // However, if the user means "don't even redirect to /auth/callback", that's harder with server actions + httpOnly cookies.
    // The standard way in Next.js with Supabase is to hit a route handler to set cookies.
    // So returning the `action_link` and redirecting the browser to it IS the most robust way 
    // to set the session cookies for the user.
    //
    // Let's verify if the user meant "don't email me a link".
    // "dont want any extra step like sending magic link then user can login... they can directly login"
    //
    // If I return `redirectUrl`, the frontend does `window.location.href = result.redirectUrl`.
    // This is instant. The user doesn't check email.
    // So the previous implementation ALREADY does this (generateLink does NOT email by default).
    //
    // Wait, maybe the user thinks "magic link" = "email".
    // "sending magic link" implies email.
    //
    // However, to be 100% sure we don't depend on "clicking", 
    // we can try to set the session on the server if we were using `supabase-ssr` fully here?
    // `supabase.auth.signInWithPassword` works if we had password.
    // `supabase.auth.signInWithOtp` sends SMS.
    //
    // We are doing CUSTOM OTP.
    // So we are effectively the identity provider here.
    //
    // If we want to set cookies *right here* in the Server Action:
    // We can't easily "sign in as user X" without their password or an admin bypass.
    // The admin bypass IS `generateLink`.
    //
    // Let's stick to `generateLink` but ensure the frontend handles it seamlessly.
    // The user said "no need to send magic link".
    // The current code:
    // `const { data: linkData } = await adminSupabase.auth.admin.generateLink({ type: "magiclink", ... })`
    // This DOES NOT send email. It returns the link.
    // Frontend: `window.location.href = result.redirectUrl`
    // This redirects user -> callback -> dashboard.
    // This IS direct login from user perspective.
    //
    // Maybe the user saw "Magic Link" in my comments or code and got worried?
    // OR maybe they want to avoid the redirect?
    //
    // To avoid redirect, we'd need to get `access_token` and `refresh_token` and set cookies.
    // `verifyOtp` (Supabase native) returns session.
    // But we aren't using Supabase native OTP (we use WhatsApp + Custom Table).
    //
    // Can we get a session directly?
    // We can use `admin.auth.admin.getUserById(id)` but that gets user, not session.
    //
    // Actually, `generateLink` is the standard way for "Admin logs in user".
    //
    // Let's look at what I can do to make it "direct".
    // If I use `grant_type=password` but I don't have password.
    //
    // Let's assume the current implementation (Redirect to action_link) IS what is needed, 
    // but maybe I should rename variables to avoid confusion or ensure it's fast.
    //
    // Wait, the user said: "mobile respective email address no need to send magic link".
    // Maybe they thought I was sending an email?
    // My previous code:
    // `adminSupabase.auth.admin.generateLink({ type: "magiclink", email: user.email })`
    // This function *returns* the link, it *doesn't* send it if you consume the data.
    //
    // BUT, let's look at `otp-actions.ts` again.
    // I am returning `redirectUrl`.
    //
    // I will double check if there is a way to set session directly.
    // We can manually create a session? No.
    //
    // Re-reading user request: "when user logs in using mobile and with correct otp thats it they can directly login... no need to send magic link"
    //
    // I will optimize the flow to ensure it feels like a direct login.
    // I'll keep using `generateLink` but I'll make sure the frontend handles it purely as a "login token"
    // and maybe I can fetch the session *from* that link on the server?
    // No, the link contains the token hash.
    //
    // Let's update the comments and ensure it works as expected.
    // AND CRITICALLY: Check `verifyOtp` logic.
    //
    // I will assume the user just wants to ensure NO EMAIL IS SENT.
    // I will add `console.log` to confirm no email is sent.
    //
    // ALSO, I need to check the Admin View issue.

    const { data: linkData, error: linkError } = await adminSupabase.auth.admin.generateLink({
        type: "magiclink",
        email: user.email,
    });

    if (linkError || !linkData.properties?.action_link) {
        console.error("Link Gen Error:", linkError);
        return { error: "Failed to generate login session" };
    }

    // Return the link. The frontend will redirect to it.
    // This is the most secure way to set the session cookies (via the callback route).
    // It does NOT send an email.
    return { success: true, redirectUrl: linkData.properties.action_link };
}
