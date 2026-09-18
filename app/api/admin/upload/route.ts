import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAuthed } from "@/lib/admin-auth";

// Issues client tokens so the browser uploads directly to Vercel Blob
// instead of routing file bytes through this serverless function.
// Uploading through the function meant every flyer/video went through
// Vercel's ~4.5MB request body limit and any real photo or the hero
// video would 413 before even reaching our code — this route never
// sees the file itself now, only small JSON messages.
export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Blob storage not configured — add a Blob store to this project in Vercel." },
      { status: 500 }
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  // Only the token-generation step needs our own admin auth — the
  // upload-completed callback comes from Vercel's Blob backend itself
  // (server-to-server), not the browser, so it won't carry the admin
  // session cookie.
  if (body.type === "blob.generate-client-token" && !(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/*", "video/*"],
        addRandomSuffix: true,
      }),
    });
    return NextResponse.json(jsonResponse);
  } catch (err) {
    console.error("[upload-diag] handleUpload failed", {
      errorName: err instanceof Error ? err.name : typeof err,
      errorMessage: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 400 }
    );
  }
}
