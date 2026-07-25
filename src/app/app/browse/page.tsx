"use client";

import { useEffect, useState } from "react";
import { SwipeStack } from "@/components/SwipeStack";

interface Profile {
  id: string;
  name: string;
  bio?: string | null;
  location?: string | null;
  education?: string | null;
  occupation?: string | null;
  height?: number | null;
  religion?: string | null;
  photos: { url: string; isPrimary: boolean }[];
}

export default function BrowsePage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/browse")
      .then((res) => res.json())
      .then((data) => {
        setProfiles(data.profiles ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-500">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Browse</h1>
      <SwipeStack profiles={profiles} />
    </div>
  );
}
