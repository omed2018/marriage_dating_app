"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { logger } from "@/lib/logger";

interface PhotoUploadProps {
  userId: string;
  onUploadComplete: (url: string) => void;
}

export function PhotoUpload({ userId, onUploadComplete }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => setPreview(event.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const res = await fetch("/api/upload/presigned-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          userId,
        }),
      });

      const { presignedUrl, publicUrl } = await res.json();

      await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      onUploadComplete(publicUrl);
      logger.info("Photo uploaded successfully", { userId });
    } catch (error) {
      logger.error("Photo upload failed", { userId, error: String(error) });
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {preview && (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <Button
        variant="secondary"
        onClick={() => fileRef.current?.click()}
        loading={uploading}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Photo"}
      </Button>
    </div>
  );
}
