import { auth } from "@/server/auth";
import { db } from "@/server/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const user = userId
    ? await db.user.findUnique({
        where: { id: userId },
        include: {
          photos: true,
          _count: {
            select: {
              sentLikes: true,
              receivedLikes: true,
              matchesA: true,
              matchesB: true,
            },
          },
        },
      })
    : null;

  const matchCount =
    (user?._count.matchesA ?? 0) + (user?._count.matchesB ?? 0);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.name ?? "User"}!
        </h1>
        <p className="text-gray-500 mt-1">
          {!user?.isProfileComplete
            ? "Complete your profile to start browsing."
            : "Here's your dashboard."}
        </p>
      </div>

      {!user?.isProfileComplete && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent>
            <p className="text-amber-800">
              Your profile is incomplete.{" "}
              <Link href="/app/profile/edit" className="underline font-medium">
                Complete it now
              </Link>{" "}
              to start browsing.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-3xl font-bold text-rose-600">
              {user?._count.receivedLikes ?? 0}
            </p>
            <p className="text-sm text-gray-500">Likes Received</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <p className="text-3xl font-bold text-rose-600">{matchCount}</p>
            <p className="text-sm text-gray-500">Matches</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <p className="text-3xl font-bold text-rose-600">
              {user?._count.sentLikes ?? 0}
            </p>
            <p className="text-sm text-gray-500">Likes Sent</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/app/browse">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="py-8 text-center">
              <p className="text-4xl mb-2">🔍</p>
              <p className="text-lg font-semibold">Browse Profiles</p>
              <p className="text-sm text-gray-500">
                Find your perfect match
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/app/matches">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="py-8 text-center">
              <p className="text-4xl mb-2">💬</p>
              <p className="text-lg font-semibold">Your Matches</p>
              <p className="text-sm text-gray-500">
                Chat with your matches
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
