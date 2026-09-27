import { NextResponse } from "next/server";
import { initDB, getStats } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await initDB();
    const stats = await getStats();
    return NextResponse.json(stats);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
