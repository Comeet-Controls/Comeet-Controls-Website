import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { initDB, getJourney, createJourneyItem, updateJourneyItem, deleteJourneyItem } from "@/lib/db";

async function checkAuth(request) {
  if (!getAdminSession(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

function validateJourney(body) {
  const { year, title } = body;
  if (!year || typeof year !== "string" || year.trim().length === 0 || year.length > 20)
    return "Year is required (max 20 characters).";
  if (!title || typeof title !== "string" || title.trim().length === 0 || title.length > 200)
    return "Title is required (max 200 characters).";
  if (body.description && body.description.length > 2000) return "Description too long.";
  return null;
}

export async function GET(request) {
  const authError = await checkAuth(request);
  if (authError) return authError;
  try {
    await initDB();
    const items = await getJourney();
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Failed to fetch journey." }, { status: 500 });
  }
}

export async function POST(request) {
  const authError = await checkAuth(request);
  if (authError) return authError;
  try {
    await initDB();
    const body = await request.json();
    const validationError = validateJourney(body);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
    const item = await createJourneyItem(body);
    revalidatePath("/about");
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create journey item." }, { status: 500 });
  }
}

export async function PUT(request) {
  const authError = await checkAuth(request);
  if (authError) return authError;
  try {
    await initDB();
    const body = await request.json();
    const { id, ...fields } = body;
    if (!id || isNaN(Number(id))) return NextResponse.json({ error: "Valid id required." }, { status: 400 });
    const validationError = validateJourney(fields);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
    const item = await updateJourneyItem(id, fields);
    revalidatePath("/about");
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed to update journey item." }, { status: 500 });
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
    await deleteJourneyItem(id);
    revalidatePath("/about");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete journey item." }, { status: 500 });
  }
}
