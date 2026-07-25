import { auth } from "@/server/auth";
import { getOwnProfile } from "@/features/profile/queries";
import { ProfileForm } from "./ProfileForm";

export default async function EditProfilePage() {
  const session = await auth();
  const profile = await getOwnProfile();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>
      <ProfileForm profile={profile} userId={session?.user?.id ?? ""} />
    </div>
  );
}
