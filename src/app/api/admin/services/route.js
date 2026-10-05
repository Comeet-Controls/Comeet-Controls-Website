import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { initDB, getServices, createService, updateService, deleteService } from "@/lib/db";

async function checkAuth(request) {
  if (!getAdminSession(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

function validateService(body) {
  const { title } = body;
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
    const services = await getServices();
    return NextResponse.json(services);
  } catch {
    return NextResponse.json({ error: "Failed to fetch services." }, { status: 500 });
  }
}

export async function POST(request) {
  const authError = await checkAuth(request);
  if (authError) return authError;
  try {
    await initDB();
    const body = await request.json();
    const validationError = validateService(body);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
    const item = await createService(body);
    revalidatePath("/");
    revalidatePath("/services");
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create service." }, { status: 500 });
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
    const validationError = validateService(fields);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
    const item = await updateService(id, fields);
    revalidatePath("/");
    revalidatePath("/services");
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed to update service." }, { status: 500 });
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
    await deleteService(id);
    revalidatePath("/");
    revalidatePath("/services");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete service." }, { status: 500 });
  }
}
