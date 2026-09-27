import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { initDB, getCertifications, createCertification, updateCertification, deleteCertification } from "@/lib/db";

async function checkAuth(request) {
  if (!getAdminSession(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

function validateCertification(body) {
  const { code, title } = body;
  if (!code || typeof code !== "string" || code.trim().length === 0 || code.length > 100)
    return "Code is required (max 100 characters).";
  if (!title || typeof title !== "string" || title.trim().length === 0 || title.length > 200)
    return "Title is required (max 200 characters).";
  if (body.description && body.description.length > 1000) return "Description too long.";
  return null;
}

export async function GET(request) {
  const authError = await checkAuth(request);
  if (authError) return authError;
  try {
    await initDB();
    const items = await getCertifications();
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Failed to fetch certifications." }, { status: 500 });
  }
}

export async function POST(request) {
  const authError = await checkAuth(request);
  if (authError) return authError;
  try {
    await initDB();
    const body = await request.json();
    const validationError = validateCertification(body);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
    const item = await createCertification(body);
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create certification." }, { status: 500 });
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
    const validationError = validateCertification(fields);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
    const item = await updateCertification(id, fields);
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed to update certification." }, { status: 500 });
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
    await deleteCertification(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete certification." }, { status: 500 });
  }
}
