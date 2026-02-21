import { NextResponse } from "next/server";

export async function POST() {
  // TODO: Revoke session/token on backend
  return NextResponse.json({ success: true });
}
