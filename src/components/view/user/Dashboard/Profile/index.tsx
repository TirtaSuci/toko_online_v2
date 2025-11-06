import UserLayout from "@/components/layouts/UserLayout";
import style from "./Profile.module.scss";
import Input from "@/components/layouts/UI/Input";
import Button from "@/components/layouts/UI/Button";
import Image from "next/image";
import { uploadImage } from "@/lib/firebase/service";

const ProfileView = ({ profile }: any) => {
  const handleChangeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("data =", file);
      await uploadImage(profile.id, file);
    }
  };

  return (
    <UserLayout>
      <h1 className={style.profile__title}>Profile Page</h1>
      <div className={style.profile__main}>
        <div className={style.profile__main__avatar}>
          <div className={style.profile__main__avatar__title}>Foto Profil </div>
          <form>
            <label htmlFor="upload_image">
              <Image
                className={style.profile__main__avatar__image}
                src={profile.image || "/image/deafult.jpg"}
                alt="Profile"
                width={200}
                height={200}
              />
            </label>
            <label
              className={style.profile__main__avatar__label}
              htmlFor="upload_image"
            >
              Pilih Gambar
            </label>
            <p>Ukuran gambar maks. 1MB</p>
            <Input
              name="image"
              id="upload_image"
              type="file"
              onChange={handleChangeAvatar}
            />
            <Button
              type="submit"
              className={style.profile__main__avatar__button}
            >
              Upload Gambar
            </Button>
          </form>
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
