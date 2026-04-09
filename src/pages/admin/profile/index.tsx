import ProfileView from "@/components/view/Admin/Profile";
import {useEffect, useState } from "react";
import userService from "@/Services/user";
import { useSession } from "next-auth/react";


const ProfilePage = () => {
  const [profile, setProfile] = useState<Record<string, unknown>>({});
  const { data: session, status } = useSession();

  const getProfile = async () => {
    const response = await userService.getProfile();
    setProfile(response.data.data);
  };

  useEffect(() => {
    if (status === "authenticated") {
      getProfile();
    }
  }, [status]);

  return (
    <div>
      <ProfileView
        profile={profile}
        setProfile={setProfile}
      />
    </div>
  );
};

export default ProfilePage;
