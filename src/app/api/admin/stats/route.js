// ---------------------------------------------------------------------------
// Shared auth check helper for all admin API routes
// ---------------------------------------------------------------------------
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { initDB, getStats, createStat, updateStat, deleteStat } from "@/lib/db";

async function checkAuth(request) {
  if (!getAdminSession(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

// Field length limits
const LIMITS = { icon: 60, value: 9999999, suffix: 10, label: 120, sort_order: 9999 };

function validateStat(body) {
  const { icon, value, suffix, label } = body;
  if (!icon || typeof icon !== "string" || icon.trim().length === 0 || icon.length > LIMITS.icon)
    return "Invalid icon field.";
  if (value === undefined || isNaN(Number(value)))
    return "Value must be a number.";
  if (!suffix || typeof suffix !== "string" || suffix.length > LIMITS.suffix)
    return "Invalid suffix.";
  if (!label || typeof label !== "string" || label.trim().length === 0 || label.length > LIMITS.label)
    return "Invalid label.";
  return null;
}

export async function GET(request) {
  const authError = await checkAuth(request);
  if (authError) return authError;
  try {
    await initDB();
    const stats = await getStats();
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats." }, { status: 500 });
  }
}

export async function POST(request) {
  const authError = await checkAuth(request);
  if (authError) return authError;
  try {
    await initDB();
    const body = await request.json();
    const validationError = validateStat(body);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
    const item = await createStat(body);
    revalidatePath("/");
    revalidatePath("/about");
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create stat." }, { status: 500 });
  }
}

export async function PUT(request) {
  const authError = await checkAuth(request);
  if (authError) return authError;
  try {
    await initDB();
    const body = await request.json();
    const { id, ...fields } = body;
    if (!id) return NextResponse.json({ error: "id required." }, { status: 400 });
    const validationError = validateStat(fields);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
    const item = await updateStat(id, fields);
    revalidatePath("/");
    revalidatePath("/about");
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed to update stat." }, { status: 500 });
  }
}

export async function DELETE(request) {
  const authError = await checkAuth(request);
  if (authError) return authError;
  try {
    await initDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id || isNaN(Number(id))) return NextResponse.json({ error: "Valid id required." }, { status: 400 });
    await deleteStat(id);
    revalidatePath("/");
    revalidatePath("/about");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete stat." }, { status: 500 });
  }
}
