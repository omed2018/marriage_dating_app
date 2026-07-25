import { db } from "@/server/db";
import { auth } from "@/server/auth";

export async function getBrowseProfiles() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const currentUser = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!currentUser) return [];

  const interactedIds = (
    await db.interaction.findMany({
      where: { senderId: session.user.id },
      select: { receiverId: true },
    })
  ).map((i: { receiverId: string }) => i.receiverId);

  const blockedByMe = (
    await db.block.findMany({
      where: { blockerId: session.user.id },
      select: { blockedId: true },
    })
  ).map((b: { blockedId: string }) => b.blockedId);

  const blockedMe = (
    await db.block.findMany({
      where: { blockedId: session.user.id },
      select: { blockerId: true },
    })
  ).map((b: { blockerId: string }) => b.blockerId);

  const excludeIds = [
    session.user.id,
    ...interactedIds,
    ...blockedByMe,
    ...blockedMe,
  ];

  const targetGender = currentUser.gender === "MALE" ? "FEMALE" : "MALE";

  return db.user.findMany({
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
}
