import { auth } from "@/server/auth";
import { getChatHistory } from "@/features/chat/actions";
import { ChatWindow } from "@/components/ChatWindow";
import { db } from "@/server/db";
import Link from "next/link";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return <div>Please log in.</div>;
  }

  const match = await db.match.findUnique({ where: { id: matchId } });
  if (!match) {
    return (
      <div className="text-center py-20">
        <p className="text-lg">Match not found.</p>
        <Link href="/app/matches" className="text-rose-600 hover:underline">
          Back to matches
        </Link>
      </div>
    );
  }

  if (match.userAId !== userId && match.userBId !== userId) {
    return <div>Unauthorized.</div>;
  }

  const result = await getChatHistory(matchId);
  const messages = "messages" in result ? result.messages : [];

  return (
    <div className="max-w-2xl">
      <Link
        href="/app/matches"
        className="text-sm text-rose-600 hover:underline mb-4 inline-block"
      >
        ← Back to matches
      </Link>
      <ChatWindow
        matchId={matchId}
        currentUserId={userId}
        initialMessages={messages as any}
      />
    </div>
  );
}
