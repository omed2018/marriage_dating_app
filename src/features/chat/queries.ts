import { db } from "@/server/db";

export async function getMatchMessages(matchId: string, limit = 50) {
  return db.message.findMany({
    where: { matchId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { sender: { select: { id: true, name: true } } },
  });
}

export async function createMessage(
  matchId: string,
  senderId: string,
  content: string
) {
  return db.message.create({
    data: { matchId, senderId, content },
    include: { sender: { select: { id: true, name: true } } },
  });
}
