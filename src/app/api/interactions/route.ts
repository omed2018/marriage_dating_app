import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { InteractionType } from "@prisma/client";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { targetUserId, type } = await request.json();

  if (!targetUserId || !["LIKE", "PASS"].includes(type)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const userId = session.user.id;

  if (userId === targetUserId) {
    return NextResponse.json({ error: "Invalid target" }, { status: 400 });
  }

  const existing = await db.interaction.findUnique({
    where: {
      senderId_receiverId: { senderId: userId, receiverId: targetUserId },
    },
  });

  if (existing) {
    return NextResponse.json({ error: "Already interacted" }, { status: 409 });
  }

  await db.interaction.create({
    data: {
      senderId: userId,
      receiverId: targetUserId,
      type: type as InteractionType,
    },
  });

  if (type === "LIKE") {
    const reverse = await db.interaction.findUnique({
      where: {
        senderId_receiverId: {
          senderId: targetUserId,
          receiverId: userId,
        },
      },
    });

    if (reverse?.type === InteractionType.LIKE) {
      const [userA, userB] = [userId, targetUserId].sort();
      const existingMatch = await db.match.findUnique({
        where: { userAId_userBId: { userAId: userA, userBId: userB } },
      });

      if (!existingMatch) {
        await db.match.create({
          data: { userAId: userA, userBId: userB },
        });
        return NextResponse.json({ matched: true });
      }
    }
  }

  return NextResponse.json({ matched: false });
}
