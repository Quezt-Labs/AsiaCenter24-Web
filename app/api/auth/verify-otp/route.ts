import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE || "";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, countryCode, otp, deviceId } = body;
    if (!phone || !countryCode || !otp) {
      return NextResponse.json(
        { success: false, error: "phone, countryCode and otp required" },
        { status: 400 }
      );
    }

    // Proxy to real backend
    if (BACKEND_URL && !BACKEND_URL.startsWith("/")) {
      const backendUrl = BACKEND_URL.replace(/\/$/, "");
      const res = await fetch(`${backendUrl}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "client-type": "WEB",
        },
        body: JSON.stringify({
          phone,
          countryCode,
          otp,
          deviceId: deviceId ?? "",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return NextResponse.json(data, { status: res.status });
      }
      return NextResponse.json(data);
    }

    // Fallback: mock for local dev
    const mockUser = {
      id: `user_${Date.now()}`,
      phone,
      firstName: null,
      lastName: null,
    };
    const mockToken = `mock_access_${Date.now()}`;
    const mockRefresh = `mock_refresh_${Date.now()}`;
    const mockDeviceSecret = `mock_device_${Date.now()}`;
    return NextResponse.json({
      accessToken: mockToken,
      refreshToken: mockRefresh,
      user: mockUser,
      isNewUser: true,
      deviceSecret: mockDeviceSecret,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
