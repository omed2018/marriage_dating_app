"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";

interface Match {
  id: string;
  otherUser: {
    id: string;
    name: string;
    photos: { url: string }[];
  };
  lastMessage: {
    content: string;
    createdAt: string;
  } | null;
}

interface MatchListProps {
  matches: Match[];
}

export function MatchList({ matches }: MatchListProps) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-2xl mb-2">💬</p>
        <p className="text-lg font-medium text-gray-900">No matches yet</p>
        <p className="text-sm text-gray-500">
          Keep swiping to find your perfect match!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {matches.map((match) => (
        <Link key={match.id} href={`/app/chat/${match.id}`}>
          <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                {match.otherUser.photos[0] ? (
                  <Image
                    src={match.otherUser.photos[0].url}
                    alt={match.otherUser.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 font-bold text-xl">
                    {match.otherUser.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {match.otherUser.name}
                </p>
                {match.lastMessage ? (
                  <p className="text-sm text-gray-500 truncate">
                    {match.lastMessage.content}
                  </p>
                ) : (
                  <p className="text-sm text-rose-500">New match!</p>
                )}
              </div>

              {match.lastMessage && (
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {new Date(match.lastMessage.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
