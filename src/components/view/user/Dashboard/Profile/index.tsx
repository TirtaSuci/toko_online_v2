import UserLayout from "@/components/layouts/UserLayout";
import AvatarView from "./Avatar";
import DataProfileView from "./DataProfile";
import style from "./Profile.module.scss";

const ProfileView = ({ profile, setProfile, session, setToaster }: any) => {
  return (
    <UserLayout>
      <h1>Profile Page</h1>
      <div className={style.profile}>
        <AvatarView
          className={style.profile__avatar}
          profile={profile}
          setProfile={setProfile}
          session={session}
          setToaster={setToaster}
        />
        <DataProfileView
          className={style.profile__data}
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
