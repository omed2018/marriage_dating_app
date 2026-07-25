"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface ProfileCardProps {
  user: {
    id: string;
    name: string;
    bio?: string | null;
    age?: number;
    location?: string | null;
    education?: string | null;
    occupation?: string | null;
    height?: number | null;
    religion?: string | null;
    photos?: { url: string; isPrimary: boolean }[];
  };
  onLike: (userId: string) => void;
  onPass: (userId: string) => void;
  onReport?: (userId: string) => void;
  onBlock?: (userId: string) => void;
}

export function ProfileCard({
  user,
  onLike,
  onPass,
  onReport,
  onBlock,
}: ProfileCardProps) {
  const primaryPhoto = user.photos?.find((p) => p.isPrimary) ?? user.photos?.[0];

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div className="relative aspect-[3/4] bg-gray-100">
        {primaryPhoto ? (
          <Image
            src={primaryPhoto.url}
            alt={user.name}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-6xl font-bold">
            {user.name.charAt(0)}
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {user.name}
            {user.age && (
              <span className="font-normal text-gray-500 ml-2">{user.age}</span>
            )}
          </h3>
          {user.location && (
            <p className="text-sm text-gray-500">{user.location}</p>
          )}
        </div>

        {user.bio && (
          <p className="text-sm text-gray-700 line-clamp-3">{user.bio}</p>
        )}

        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          {user.education && <span className="bg-gray-100 px-2 py-1 rounded">{user.education}</span>}
          {user.occupation && <span className="bg-gray-100 px-2 py-1 rounded">{user.occupation}</span>}
          {user.height && <span className="bg-gray-100 px-2 py-1 rounded">{user.height}cm</span>}
          {user.religion && <span className="bg-gray-100 px-2 py-1 rounded">{user.religion}</span>}
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={() => onPass(user.id)}
          >
            Pass
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={() => onLike(user.id)}
          >
            Like
          </Button>
        </div>

        {(onReport || onBlock) && (
          <div className="flex gap-2 pt-1">
            {onBlock && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBlock(user.id)}
                className="text-xs"
              >
                Block
              </Button>
            )}
            {onReport && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReport(user.id)}
                className="text-xs text-orange-600"
              >
                Report
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
