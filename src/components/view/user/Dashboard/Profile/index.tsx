import UserLayout from "@/components/layouts/UserLayout";
import AvatarView from "./Avatar";
import DataProfileView from "./DataProfile";
import style from "./Profile.module.scss";

type PropsType = {
  profile: Record<string, unknown>;
  setProfile: (profile: Record<string, unknown>) => void;
  session: Record<string, unknown>;
  setToaster?: (toaster: { variant: string; message: string }) => void;
};

const ProfileView = (props: PropsType) => {
  const { profile, setProfile, session, setToaster } = props;

  return (
    <UserLayout>
      <h1>Profile Page</h1>
      <div className={style.profile}>
        <AvatarView
          profile={profile}
          setProfile={setProfile}
          session={session}
          setToaster={setToaster}
        />
        <DataProfileView
          profile={profile}
          setProfile={setProfile}
          session={session}
          setToaster={setToaster}
        />
      </div>
    </UserLayout>
  );
};

export default ProfileView;
