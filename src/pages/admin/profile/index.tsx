import ProfileView from "@/components/view/Admin/Profile";
import { useEffect, useState } from "react";
import userService from "@/Services/user";
import { useSession } from "next-auth/react";

type PropsType = {
  setToaster: (toaster: { variant: string; message: string }) => void;
};

const ProfilePage = ({ setToaster }: PropsType) => {
  const [profile, setProfile] = useState<Record<string, unknown>>({});
  const session = useSession();

  useEffect(() => {
    const getProfile = async () => {
      const token = (session.data as unknown as { accessToken?: string })
        ?.accessToken;
      if (token && Object.keys(profile).length === 0) {
        const response = await userService.getProfile(token);
        setProfile(response.data.data);
      }
    };
    getProfile();
  }, [profile, session]);

  return (
    <div>
      <ProfileView
        profile={profile}
        setProfile={setProfile}
        session={session}
        setToaster={setToaster}
      />
    </div>
  );
};

export default ProfilePage;
