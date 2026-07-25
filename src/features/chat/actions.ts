"use server";

import { db } from "@/server/db";
import { auth } from "@/server/auth";

export async function getMatches() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const userId = session.user.id;

  const matches = await db.match.findMany({
    where: {
      OR: [{ userAId: userId }, { userBId: userId }],
    },
    include: {
      userA: {
        select: {
          id: true,
          name: true,
          photos: { where: { isPrimary: true }, take: 1, select: { url: true } },
        },
      },
      userB: {
        select: {
          id: true,
          name: true,
          photos: { where: { isPrimary: true }, take: 1, select: { url: true } },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { content: true, createdAt: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return matches.map((match: any) => {
    const otherUser =
      match.userAId === userId ? match.userB : match.userA;
    return {
      id: match.id,
      otherUser,
      lastMessage: match.messages[0] ?? null,
      createdAt: match.createdAt,
    };
  });
}

export async function getChatHistory(matchId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const match = await db.match.findUnique({ where: { id: matchId } });
  if (!match) return { error: "Match not found" };

  if (match.userAId !== session.user.id && match.userBId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  const messages = await db.message.findMany({
    where: { matchId },
    orderBy: { createdAt: "asc" },
    take: 50,
    include: { sender: { select: { id: true, name: true } } },
  });

  return { messages };
}

export async function sendMessage(matchId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const match = await db.match.findUnique({ where: { id: matchId } });
  if (!match) return { error: "Match not found" };

  if (match.userAId !== session.user.id && match.userBId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  if (!content.trim() || content.length > 2000) {
    return { error: "Invalid message" };
  }

  const message = await db.message.create({
    data: {
      matchId,
      senderId: session.user.id,
      content: content.trim(),
    },
    include: { sender: { select: { id: true, name: true } } },
  });

  return { message };
}
