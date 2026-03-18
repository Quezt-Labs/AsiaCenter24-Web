import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE || "";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { refreshToken, deviceId, deviceSecret } = body;
    if (!refreshToken) {
      return NextResponse.json(
        { error: "refreshToken required" },
        { status: 400 },
      );
    }

    // Proxy to real backend with full body (refreshToken, deviceId, deviceSecret)
    if (BACKEND_URL && !BACKEND_URL.startsWith("/")) {
      const backendUrl = BACKEND_URL.replace(/\/$/, "");
      const res = await fetch(`${backendUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "client-type": "WEB",
        },
        body: JSON.stringify({
          refreshToken,
          deviceId: deviceId ?? "",
          deviceSecret: deviceSecret ?? "",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return NextResponse.json(data, { status: res.status });
      }
      return NextResponse.json(data);
    }

    // Fallback: mock for local dev
    const mockToken = `mock_access_${Date.now()}`;
    return NextResponse.json({
      accessToken: mockToken,
      token: mockToken,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
