import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { matchId, content } = await request.json();

  if (!matchId || !content?.trim()) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  if (content.length > 2000) {
    return NextResponse.json(
      { error: "Message too long" },
      { status: 400 }
    );
  }

  const match = await db.match.findUnique({ where: { id: matchId } });
  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  if (match.userAId !== session.user.id && match.userBId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const message = await db.message.create({
    data: {
      matchId,
      senderId: session.user.id,
      content: content.trim(),
    },
    include: { sender: { select: { id: true, name: true } } },
  });

  return NextResponse.json({ message });
}
