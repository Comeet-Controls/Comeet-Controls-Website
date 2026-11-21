import { NextResponse } from "next/server";
import { initDB, getServices } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await initDB();
    const services = await getServices();
    return NextResponse.json(services);
  } catch (e) {
    console.error("Services API error:", e);
    return NextResponse.json({ error: "Data temporarily unavailable." }, { status: 500 });
  }
}
