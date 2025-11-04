import UserLayout from "@/components/layouts/UserLayout";
import style from "./Profile.module.scss";
import Input from "@/components/layouts/UI/Input";

const ProfileView = ({ profile }: any) => {
  console.log("profile = ", profile);
  return (
    <UserLayout>
      <h1 className={style.profile__title}>Profile Page</h1>
      <div className={style.profile__main}>
        <div className={style.profile__main__avatar}>
          <div className={style.profile__main__avatar__image}></div>
          <div>Foto Profil </div>
        </div>
        <div className={style.profile__main__details}>
          <div>Data Profil</div>
          <div className={style.profile__main__details__data}>
            <Input
              name="fullname"
              type="text"
              deafultValue={profile.fullname}
            />
            <Input name="email" type="text" deafultValue={profile.email} />
            <Input name="phone" type="text" deafultValue={profile.phone} />
            <Input name="address" type="text" deafultValue={profile.address} />
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default ProfileView;
