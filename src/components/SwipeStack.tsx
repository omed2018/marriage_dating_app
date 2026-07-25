"use client";

import { useState } from "react";
import { ProfileCard } from "./ProfileCard";
import { sendLike, sendPass } from "@/features/browse/actions";
import { blockUser, reportUser } from "@/features/report/actions";
import { logger } from "@/lib/logger";

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

interface SwipeStackProps {
  profiles: Profile[];
}

export function SwipeStack({ profiles }: SwipeStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchPopup, setMatchPopup] = useState(false);
  const [matchedName, setMatchedName] = useState("");

  const handleLike = async (userId: string) => {
    const result = await sendLike(userId);
    if (result.success && result.matched) {
      const matchedProfile = profiles.find((p) => p.id === userId);
      setMatchedName(matchedProfile?.name ?? "");
      setMatchPopup(true);
      setTimeout(() => setMatchPopup(false), 3000);
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePass = async (userId: string) => {
    await sendPass(userId);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleBlock = async (userId: string) => {
    await blockUser(userId);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleReport = async (userId: string) => {
    await reportUser({
      reportedId: userId,
      reason: "OTHER",
      description: "Reported from browse",
    });
    setCurrentIndex((prev) => prev + 1);
  };

  if (currentIndex >= profiles.length) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center space-y-4">
          <p className="text-2xl font-bold text-gray-900">No more profiles</p>
          <p className="text-gray-500">
            Check back later for new matches!
          </p>
        </div>
      </div>
    );
  }

  const profile = profiles[currentIndex];
  const age = profile.photos[0]?.url
    ? Math.floor(
        (Date.now() - new Date().getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      )
    : undefined;

  return (
    <div className="relative">
      {matchPopup && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 rounded-xl">
          <div className="bg-white rounded-2xl p-8 text-center space-y-4 shadow-2xl">
            <p className="text-4xl">🎉</p>
            <p className="text-2xl font-bold text-rose-600">It&apos;s a Match!</p>
            <p className="text-gray-600">
              You and {matchedName} liked each other!
            </p>
          </div>
        </div>
      )}

      <ProfileCard
        user={{ ...profile, age }}
        onLike={handleLike}
        onPass={handlePass}
        onBlock={handleBlock}
        onReport={handleReport}
      />

      <div className="flex justify-center gap-2 mt-4">
        {profiles.slice(currentIndex, currentIndex + 5).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i === 0 ? "bg-rose-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
