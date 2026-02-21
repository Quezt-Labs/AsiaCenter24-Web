import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, countryCode, otp } = body;
    if (!phone || !countryCode || !otp) {
      return NextResponse.json(
        { success: false, error: "phone, countryCode and otp required" },
        { status: 400 }
      );
    }
    // TODO: Verify OTP with your provider, then issue tokens
    // For dev: accept any 6-digit OTP
    const mockUser = {
      id: `user_${Date.now()}`,
      phone,
      name: undefined,
      isVerified: true,
    };
    const mockToken = `mock_access_${Date.now()}`;
    const mockRefresh = `mock_refresh_${Date.now()}`;
    return NextResponse.json({
      success: true,
      user: mockUser,
      accessToken: mockToken,
      refreshToken: mockRefresh,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
