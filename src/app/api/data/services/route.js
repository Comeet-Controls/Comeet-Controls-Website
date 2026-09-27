import { NextResponse } from "next/server";
import { initDB, getServices } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await initDB();
    const services = await getServices();
    return NextResponse.json(services);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
