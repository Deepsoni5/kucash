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

  // 3. Generate Magic Link for Session
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return { error: "Server configuration error" };
  }

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

  // We use type: 'magiclink' which creates a link the user can visit to sign in
  const { data: linkData, error: linkError } =
    await adminSupabase.auth.admin.generateLink({
      type: "magiclink",
      email: user.email,
    });

  if (linkError || !linkData.properties?.action_link) {
    console.error("Link Gen Error:", linkError);
    return { error: "Failed to generate login session" };
  }

  // Return the link so client can redirect
  return { success: true, redirectUrl: linkData.properties.action_link };
}
