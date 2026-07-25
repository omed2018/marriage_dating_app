import { NextRequest, NextResponse } from "next/server";
import { getPresignedUploadUrl, buildPhotoKey, getPublicUrl } from "@/lib/s3";

export async function POST(request: NextRequest) {
  try {
    const { filename, contentType, userId } = await request.json();

    if (!filename || !contentType || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP" },
        { status: 400 }
      );
    }

    const key = buildPhotoKey(userId, filename);
    const presignedUrl = await getPresignedUploadUrl(key, contentType);
    const publicUrl = getPublicUrl(key);

    return NextResponse.json({ presignedUrl, key, publicUrl });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
