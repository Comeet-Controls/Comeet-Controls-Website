import { NextResponse } from "next/server";
import { initDB, getStats } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await initDB();
    const stats = await getStats();
    return NextResponse.json(stats);
  } catch (e) {
    console.error("Stats API error:", e);
    return NextResponse.json({ error: "Data temporarily unavailable." }, { status: 500 });
  }
}
