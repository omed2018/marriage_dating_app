"use server";

import { db } from "@/server/db";
import { auth } from "@/server/auth";

export async function getPendingReports() {
  const session = await auth();
  if (!session?.user?.id) return [];

  // For v1: simple admin check by email
  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user || user.email !== "admin@example.com") return [];

  return db.report.findMany({
    where: { status: "PENDING" },
    include: {
      reporter: { select: { id: true, name: true, email: true } },
      reported: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateReportStatus(
  reportId: string,
  status: "REVIEWED" | "RESOLVED" | "DISMISSED"
) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user || user.email !== "admin@example.com") {
    return { success: false, error: "Not admin" };
  }

  await db.report.update({
    where: { id: reportId },
    data: { status },
  });

  return { success: true };
}
