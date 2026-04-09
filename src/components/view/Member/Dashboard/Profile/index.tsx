import UserLayout from "@/components/layouts/UserLayout";
import AvatarView from "./Avatar";
import DataProfileView from "./DataProfile";
import style from "./Profile.module.scss";

type PropsType = {
  profile: Record<string, unknown>;
  setProfile: (profile: Record<string, unknown>) => void;
  session: Record<string, unknown>;
};

const ProfileView = (props: PropsType) => {
  const { profile, setProfile, session} = props;

  return (
    <UserLayout>
      <h1>Profile Page</h1>
      <div className={style.profile}>
        <AvatarView
          profile={profile}
          setProfile={setProfile}
          session={session}
        />
        <DataProfileView
          profile={profile}
          setProfile={setProfile}
          session={session}
        />
      </div>
    </UserLayout>
  );
};

export default ProfileView;
