import UserLayout from "@/components/layouts/UserLayout";
import style from "./Profile.module.scss";
import Input from "@/components/layouts/UI/Input";
import Button from "@/components/layouts/UI/Button";
import Image from "next/image";

const ProfileView = ({ profile }: any) => {
  return (
    <UserLayout>
      <h1 className={style.profile__title}>Profile Page</h1>
      <div className={style.profile__main}>
        <div className={style.profile__main__avatar}>
          <div className={style.profile__main__avatar__image}>
            <Image src={profile.image} alt="Profile" width={100} height={100} />
          </div>
          <div>Foto Profil </div>
        </div>
        <div className={style.profile__main__details}>
          <div className={style.profile__main__details__title}>Data Profil</div>
          <div className={style.profile__main__details__data}>
            <form action="">
              <Input
                label="Fullname"
                name="fullname"
                type="text"
                deafultValue={profile.fullname}
              />
              <Input
                label="Email"
                name="email"
                type="text"
                deafultValue={profile.email}
              />
              <Input
                label="Phone"
                name="phone"
                type="text"
                deafultValue={profile.phone}
              />
              <Input
                label="Alamat"
                name="address"
                type="text"
                deafultValue={profile.address}
              />
              <Button>Simpan</Button>
            </form>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default ProfileView;
