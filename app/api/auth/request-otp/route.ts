import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, countryCode } = body;
    if (!phone || !countryCode) {
      return NextResponse.json(
        { success: false, error: "phone and countryCode required" },
        { status: 400 },
      );
    }
    if (!["IN", "DE"].includes(countryCode)) {
      return NextResponse.json(
        { success: false, error: "countryCode must be IN or DE" },
        { status: 400 },
      );
    }
    // TODO: Integrate with your OTP provider (Twilio, MSG91, etc.)
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 },
    );
  }
}
