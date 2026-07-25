import { db } from "@/server/db";
import { auth } from "@/server/auth";

export async function getOwnProfile() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return db.user.findUnique({
    where: { id: session.user.id },
    include: { photos: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getProfileById(id: string) {
  return db.user.findUnique({
    where: { id },
    include: { photos: { orderBy: { sortOrder: "asc" } } },
  });
}
