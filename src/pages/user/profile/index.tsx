import ProfileView from "@/components/view/Member/Dashboard/Profile";
import { useEffect, useState } from "react";
import userService from "@/Services/user";
import { useSession } from "next-auth/react";


const ProfilePage = () => {
  const [profile, setProfile] = useState<Record<string, unknown>>({});
  const session = useSession();

  const getProfile = async () => {
    const response = await userService.getProfile();
    setProfile(response.data.data);
  };

  useEffect(() => {
    if (session.status === "authenticated") {
      getProfile();
    }
  }, [session.status]);

  return (
    <div>
      <ProfileView
        profile={profile}
        setProfile={setProfile}
        session={session}
      />
    </div>
  );
};

export default ProfilePage;
