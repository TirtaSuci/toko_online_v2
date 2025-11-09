import UserLayout from "@/components/layouts/UserLayout";
import AvatarView from "./Avatar";
import DataProfileView from "./DataProfile";
import style from "./Profile.module.scss";

const ProfileView = ({ profile, setProfile, session }: any) => {
  return (
    <UserLayout>
      <h1>Profile Page</h1>
      <div className={style.profile}>
        <AvatarView
          className={style.profile__avatar}
          profile={profile}
          setProfile={setProfile}
          session={session}
        />
        <DataProfileView
          className={style.profile__data}
          profile={profile}
          setProfile={setProfile}
          session={session}
        />
      </div>
    </UserLayout>
  );
};

export default ProfileView;
