import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { initDB, getProjects, createProject, updateProject, deleteProject } from "@/lib/db";

async function checkAuth(request) {
  if (!getAdminSession(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

function validateProject(body) {
  const { title } = body;
  if (!title || typeof title !== "string" || title.trim().length === 0 || title.length > 200)
    return "Title is required (max 200 characters).";
  if (body.tag && body.tag.length > 100) return "Tag too long.";
  if (body.short_desc && body.short_desc.length > 1000) return "Short description too long.";
  if (body.full_desc && body.full_desc.length > 5000) return "Full description too long.";
  return null;
}

export async function GET(request) {
  const authError = await checkAuth(request);
  if (authError) return authError;
  try {
    await initDB();
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Failed to fetch projects." }, { status: 500 });
  }
}

export async function POST(request) {
  const authError = await checkAuth(request);
  if (authError) return authError;
  try {
    await initDB();
    const body = await request.json();
    const validationError = validateProject(body);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
    const item = await createProject(body);
    revalidatePath("/");
    revalidatePath("/projects");
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create project." }, { status: 500 });
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
    const validationError = validateProject(fields);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
    const item = await updateProject(id, fields);
    revalidatePath("/");
    revalidatePath("/projects");
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed to update project." }, { status: 500 });
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
    await deleteProject(id);
    revalidatePath("/");
    revalidatePath("/projects");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete project." }, { status: 500 });
  }
}
