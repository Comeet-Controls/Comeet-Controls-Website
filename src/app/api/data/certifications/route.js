import { NextResponse } from "next/server";
import { initDB, getCertifications } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await initDB();
    const certifications = await getCertifications();
    return NextResponse.json(certifications);
  } catch (e) {
    console.error("Certifications API error:", e);
    return NextResponse.json({ error: "Data temporarily unavailable." }, { status: 500 });
  }
}
