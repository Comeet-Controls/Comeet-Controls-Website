import { NextResponse } from "next/server";
import { initDB, getJourney } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await initDB();
    const journey = await getJourney();
    return NextResponse.json(journey);
  } catch (e) {
    console.error("Journey API error:", e);
    return NextResponse.json({ error: "Data temporarily unavailable." }, { status: 500 });
  }
}
