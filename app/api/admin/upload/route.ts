import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { isAuthed } from "@/lib/admin-auth";

// Generic authenticated upload used by the admin panel for both event
// flyers and the hero video. Vercel Blob needs BLOB_READ_WRITE_TOKEN set
// on the project — create a Blob store in the Vercel dashboard and it's
// wired in automatically.
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Blob storage not configured — add a Blob store to this project in Vercel." },
      { status: 500 }
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  const folder = String(form.get("folder") || "uploads");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-") || "upload";
  const pathname = `${folder}/${Date.now()}-${safeName}`;

  try {
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
      // Some mobile browsers hand File objects with an empty or unusual
      // .type; pass it through explicitly and fall back to a generic
      // binary type rather than let an empty string reach the Blob API.
      contentType: file.type || "application/octet-stream",
    });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    // [upload-diag] prefix: grep Vercel runtime logs for this to see the
    // real name/message/stack behind any upload failure, since Blob SDK
    // errors (e.g. pathname/content-type validation on Vercel's end) can
    // surface as generic-sounding messages that don't say what tripped.
    console.error("[upload-diag] Blob put() failed", {
      pathname,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      errorName: err instanceof Error ? err.name : typeof err,
      errorMessage: err instanceof Error ? err.message : String(err),
    });
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
