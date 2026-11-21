import { NextResponse } from "next/server";
import { initDB, getProjects } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await initDB();
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (e) {
    console.error("Projects API error:", e);
    return NextResponse.json({ error: "Data temporarily unavailable." }, { status: 500 });
  }
}
