import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { auth } from "@/server/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ profiles: [] });
  }

  const userId = session.user.id;

  const currentUser = await db.user.findUnique({
    where: { id: userId },
  });

  if (!currentUser) {
    return NextResponse.json({ profiles: [] });
  }

  const interactedIds = (
    await db.interaction.findMany({
      where: { senderId: userId },
      select: { receiverId: true },
    })
  ).map((i: { receiverId: string }) => i.receiverId);

  const blockedByMe = (
    await db.block.findMany({
      where: { blockerId: userId },
      select: { blockedId: true },
    })
  ).map((b: { blockedId: string }) => b.blockedId);

  const blockedMe = (
    await db.block.findMany({
      where: { blockedId: userId },
      select: { blockerId: true },
    })
  ).map((b: { blockerId: string }) => b.blockerId);

  const excludeIds = [userId, ...interactedIds, ...blockedByMe, ...blockedMe];
  const targetGender = currentUser.gender === "MALE" ? "FEMALE" : "MALE";

  const profiles = await db.user.findMany({
    where: {
      id: { notIn: excludeIds },
      gender: targetGender,
      isActive: true,
      isProfileComplete: true,
    },
    include: { photos: { where: { isPrimary: true }, take: 1 } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({ profiles });
}
