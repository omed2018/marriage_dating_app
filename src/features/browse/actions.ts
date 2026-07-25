"use server";

import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { InteractionType } from "@prisma/client";

export async function sendLike(targetUserId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = session.user.id;

  if (userId === targetUserId) {
    return { success: false, error: "Cannot interact with yourself" };
  }

  const existing = await db.interaction.findUnique({
    where: { senderId_receiverId: { senderId: userId, receiverId: targetUserId } },
  });

  if (existing) {
    return { success: false, error: "Already interacted with this user" };
  }

  await db.interaction.create({
    data: {
      senderId: userId,
      receiverId: targetUserId,
      type: InteractionType.LIKE,
    },
  });

  const reverseLike = await db.interaction.findUnique({
    where: {
      senderId_receiverId: {
        senderId: targetUserId,
        receiverId: userId,
      },
    },
  });

  if (reverseLike?.type === InteractionType.LIKE) {
    const [userA, userB] = [userId, targetUserId].sort();
    const existingMatch = await db.match.findUnique({
      where: { userAId_userBId: { userAId: userA, userBId: userB } },
    });

    if (!existingMatch) {
      await db.match.create({
        data: { userAId: userA, userBId: userB },
      });
      return { success: true, matched: true };
    }
  }

  return { success: true, matched: false };
}

export async function sendPass(targetUserId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = session.user.id;

  const existing = await db.interaction.findUnique({
    where: { senderId_receiverId: { senderId: userId, receiverId: targetUserId } },
  });

  if (existing) {
    return { success: false, error: "Already interacted with this user" };
  }

  await db.interaction.create({
    data: {
      senderId: userId,
      receiverId: targetUserId,
      type: InteractionType.PASS,
    },
  });

  return { success: true, matched: false };
}
