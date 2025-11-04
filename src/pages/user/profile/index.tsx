import ProfileView from "@/components/view/user/Dashboard/Profile";
import { useEffect, useState } from "react";
import userService from "@/Services/user";
import { useSession } from "next-auth/react";

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const session: any = useSession();
  const { status } = useSession();

  useEffect(() => {
    const getAllUsers = async () => {
      if (status === "authenticated" && session.data?.accessToken) {
        const response = await userService.getProfile(
          session.data?.accessToken
        );
        setProfile(response.data.data);
      }
    };
    getAllUsers();
  }, [status, session.data?.accessToken]); // tidak pakai [session] langsung

  return (
    <div>
      <ProfileView profile={profile} />
    </div>
  );
};

export default ProfilePage;
