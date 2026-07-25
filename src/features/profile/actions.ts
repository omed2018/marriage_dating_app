"use server";

import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { profileSchema, type ProfileInput } from "./schema";

export async function updateProfile(data: ProfileInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = profileSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const userId = session.user.id;
  const profileData = parsed.data;

  const photoCount = await db.photo.count({ where: { userId } });
  const isComplete =
    photoCount >= 1 &&
    !!profileData.bio &&
    !!profileData.location &&
    !!profileData.education;

  await db.user.update({
    where: { id: userId },
    data: {
      ...profileData,
      isProfileComplete: isComplete,
    },
  });

  return { success: true };
}

export async function completeOnboarding(data: ProfileInput) {
  const result = await updateProfile(data);
  if (!result.success) return result;

  const session = await auth();
  const userId = session!.user!.id;

  const photoCount = await db.photo.count({ where: { userId } });
  if (photoCount >= 1) {
    await db.user.update({
      where: { id: userId },
      data: { isProfileComplete: true },
    });
  }

  return { success: true };
}
