import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "online", system: "ChronoNav API v1" });
}
