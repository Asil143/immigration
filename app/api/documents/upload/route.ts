import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { extractDocumentFields } from "@/lib/claude/client";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  const docType = (formData.get("docType") as string) || "Unknown";

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json({ error: "Unsupported file type. Use PDF, JPEG, or PNG." }, { status: 400 });
  if (file.size > MAX_BYTES)
    return NextResponse.json({ error: "File too large. Maximum 10 MB." }, { status: 400 });

  // Convert to base64 for Claude
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");

  // AI extraction
  let extraction;
  try {
    extraction = await extractDocumentFields(base64, file.type, docType);
  } catch (err) {
    console.error("Claude extraction error:", err);
    extraction = {
      summary: "Extraction failed",
      extracted_fields: {},
      expiry_date: null,
      issues: ["AI extraction failed — fields not available."],
      recommendations: [],
    };
  }

  const supabase = createAdminClient();

  // Ensure bucket exists (no-op if already created)
  await supabase.storage.createBucket("documents", { public: false }).catch(() => {});

  // Upload to Supabase Storage
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${userId}/${Date.now()}-${safeName}`;
  const { error: storageError } = await supabase.storage
    .from("documents")
    .upload(storagePath, buffer, { contentType: file.type, upsert: false });

  if (storageError) console.error("Storage error:", storageError.message);

  // Save document record
  const { data: doc, error: dbError } = await supabase
    .from("documents")
    .insert({
      clerk_id: userId,
      name: file.name,
      document_type: docType,
      storage_path: storageError ? null : storagePath,
      file_size: file.size,
      extracted_data: extraction,
    })
    .select()
    .single();

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ document: doc, extraction });
}
