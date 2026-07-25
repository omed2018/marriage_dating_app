import { getMatches } from "@/features/chat/actions";
import { MatchList } from "@/components/MatchList";

export default async function MatchesPage() {
  const matches = await getMatches();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Matches</h1>
      <MatchList matches={matches as any} />
    </div>
  );
}
