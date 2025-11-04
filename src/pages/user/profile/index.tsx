import ProfileView from "@/components/view/user/Dashboard/Profile";
import { useEffect, useState } from "react";
import userService from "@/Services/user";
import { useSession } from "next-auth/react";

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const session: any = useSession();
  useEffect(() => {
    const getAllUsers = async () => {
      const response = await userService.getProfile(session.data?.accessToken);
      setProfile(response.data.data);
    };
    getAllUsers();
  }, [session]);
  return (
    <>
      <ProfileView profile={profile} />
    </>
  );
};

export default ProfilePage;
