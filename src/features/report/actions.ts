"use server";

import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { reportSchema, type ReportInput } from "./schema";

export async function blockUser(targetUserId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const userId = session.user.id;
  if (userId === targetUserId) {
    return { success: false, error: "Cannot block yourself" };
  }

  const existing = await db.block.findUnique({
    where: { blockerId_blockedId: { blockerId: userId, blockedId: targetUserId } },
  });

  if (existing) return { success: false, error: "Already blocked" };

  await db.block.create({
    data: { blockerId: userId, blockedId: targetUserId },
  });

  return { success: true };
}

export async function reportUser(data: ReportInput) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const parsed = reportSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const userId = session.user.id;

  if (userId === parsed.data.reportedId) {
    return { success: false, error: "Cannot report yourself" };
  }

  await db.report.create({
    data: {
      reporterId: userId,
      reportedId: parsed.data.reportedId,
      reason: parsed.data.reason,
      description: parsed.data.description,
    },
  });

  return { success: true };
}
