import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { refreshToken } = body;
    if (!refreshToken) {
      return NextResponse.json(
        { error: "refreshToken required" },
        { status: 400 },
      );
    }
    // TODO: Validate refresh token, issue new access token
    const mockToken = `mock_access_${Date.now()}`;
    return NextResponse.json({
      accessToken: mockToken,
      token: mockToken,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
