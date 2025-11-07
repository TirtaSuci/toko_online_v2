import ProfileView from "@/components/view/user/Dashboard/Profile";
import { useEffect, useState } from "react";
import userService from "@/Services/user";
import { useSession } from "next-auth/react";

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const session: any = useSession();
  console.log("profile =", profile);

  useEffect(() => {
    const getProfile = async () => {
      if (session.data?.accessToken && Object.keys(profile).length === 0) {
        const response = await userService.getProfile(
          session.data?.accessToken
        );
        setProfile(response.data.data);
      }
    };
    getProfile();
  }, [profile, session]); // tidak pakai [session] langsung

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
