"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { PhotoUpload } from "@/components/PhotoUpload";
import { updateProfile } from "@/features/profile/actions";

interface ProfileFormProps {
  profile: {
    bio?: string | null;
    location?: string | null;
    education?: string | null;
    occupation?: string | null;
    height?: number | null;
    religion?: string | null;
    photos?: { id: string; url: string; isPrimary: boolean }[];
  } | null;
  userId: string;
}

export function ProfileForm({ profile, userId }: ProfileFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    bio: profile?.bio ?? "",
    location: profile?.location ?? "",
    education: profile?.education ?? "",
    occupation: profile?.occupation ?? "",
    height: profile?.height?.toString() ?? "",
    religion: profile?.religion ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const result = await updateProfile({
      ...form,
      height: form.height ? parseInt(form.height) : undefined,
    });

    setSaving(false);
    if (result.success) {
      router.push("/app/dashboard");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Bio"
              id="bio"
              value={form.bio}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, bio: e.target.value }))
              }
              placeholder="Tell us about yourself..."
            />

            <Input
              label="Location"
              id="location"
              value={form.location}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="City, Country"
            />

            <Input
              label="Education"
              id="education"
              value={form.education}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, education: e.target.value }))
              }
              placeholder="Your education"
            />

            <Input
              label="Occupation"
              id="occupation"
              value={form.occupation}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, occupation: e.target.value }))
              }
              placeholder="Your occupation"
            />

            <Input
              label="Height (cm)"
              id="height"
              type="number"
              value={form.height}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, height: e.target.value }))
              }
              placeholder="170"
            />

            <Input
              label="Religion"
              id="religion"
              value={form.religion}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, religion: e.target.value }))
              }
              placeholder="Your religion"
            />

            <Button type="submit" className="w-full" loading={saving}>
              Save Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Photos</h3>
          <PhotoUpload userId={userId} onUploadComplete={() => router.refresh()} />

          {profile?.photos && profile.photos.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {profile.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  {photo.isPrimary && (
                    <span className="absolute top-1 left-1 bg-rose-600 text-white text-xs px-2 py-0.5 rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
