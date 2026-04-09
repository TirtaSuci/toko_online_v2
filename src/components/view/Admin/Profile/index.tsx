import AvatarView from "./Avatar";
import DataProfileView from "./DataProfile";
import style from "./Profile.module.scss";
import AdminLayout from "@/components/layouts/AdminLayout";

type PropsType = {
  profile: Record<string, unknown>;
  setProfile: (profile: Record<string, unknown>) => void;
  session?: Record<string, unknown>;
};

const ProfileView = (props: PropsType) => {
  const { profile, setProfile } = props;
  const fullname = (profile?.fullname as string) || "Admin";
  const role = (profile?.role as string) || "admin";
  const email = (profile?.email as string) || "";

  return (
    <AdminLayout>
      <div className={style.profile}>
        <header className={style.profile__header}>
          <div>
            <h1 className={style.profile__title}>Profil Saya</h1>
            <p className={style.profile__subtitle}>Kelola informasi akun dan keamanan Anda</p>
          </div>
          <div className={style.profile__breadcrumb}>
            <i className="bx bx-user-circle" />
            <span>{fullname}</span>
            <i className="bx bx-chevron-right" />
            <span className={style.profile__breadcrumb__role}>{role}</span>
          </div>
        </header>

        <div className={style.profile__hero}>
          <div className={style.profile__hero__info}>
            <h2>{fullname}</h2>
            {email && <p><i className="bx bx-envelope" /> {email}</p>}
            <span className={style.profile__hero__badge}>{role}</span>
          </div>
        </div>

        <div className={style.profile__grid}>
          <AvatarView profile={profile} setProfile={setProfile} />
          <DataProfileView profile={profile} setProfile={setProfile} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProfileView;
