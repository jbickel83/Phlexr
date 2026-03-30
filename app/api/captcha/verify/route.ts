import { NextRequest, NextResponse } from "next/server";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function POST(request: NextRequest) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return NextResponse.json(
      { success: false, message: "Verification is unavailable right now." },
      { status: 503 }
    );
  }

  const { token } = await request.json();

  if (!token || typeof token !== "string") {
    return NextResponse.json(
      { success: false, message: "Complete verification to continue." },
      { status: 400 }
    );
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const remoteIp = forwardedFor?.split(",")[0]?.trim() || "";

  const verificationBody = new URLSearchParams({
    secret,
    response: token,
  });

  if (remoteIp) {
    verificationBody.set("remoteip", remoteIp);
  }

  const verificationResponse = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: verificationBody,
  });

  if (!verificationResponse.ok) {
    return NextResponse.json(
      { success: false, message: "Verification failed. Try again." },
      { status: 502 }
    );
  }

  const verificationResult = await verificationResponse.json();

  if (!verificationResult.success) {
    return NextResponse.json(
      { success: false, message: "Complete verification to continue." },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
