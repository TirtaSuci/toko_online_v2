import UserLayout from "@/components/layouts/UserLayout";
import style from "./Profile.module.scss";
import Input from "@/components/layouts/UI/Input";
import Button from "@/components/layouts/UI/Button";
import Image from "next/image";
import { uploadImage } from "@/lib/firebase/service";
import { useState } from "react";
import userServices from "@/Services/user";
import { sendError } from "next/dist/server/api-utils";

const ProfileView = ({ profile, setProfile, session }: any) => {
  const [changeImage, setChangeImage] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});
  const handleChangeAvatar = (e: any) => {
    setIsLoading(true);
    e.preventDefault();
    const file = e.target[0]?.files[0];
    if (file) {
      uploadImage(
        profile.id,
        file,
        async (status: boolean, newImageURL: string) => {
          if (status) {
            console.log("newimage =>", newImageURL);
            const data = { image: newImageURL };
            const result = await userServices.updateProfile(
              profile.id,
              data,
              session.data?.accessToken
            );
            if (result.status === 200) {
              setIsLoading(false);
              setProfile({ ...profile, image: newImageURL });
              setChangeImage({});
              e.target[0].value = "";
            } else {
              setIsLoading(false);
            }
          }
        }
      );
    }
  };

  return (
    <UserLayout>
      <h1 className={style.profile__title}>Profile Page</h1>
      <div className={style.profile__main}>
        <div className={style.profile__main__avatar}>
          <div className={style.profile__main__avatar__title}>Foto Profil </div>
          <form onSubmit={handleChangeAvatar}>
            <label htmlFor="upload_image">
              {profile.image ? (
                <Image
                  className={style.profile__main__avatar__image}
                  src={profile.image}
                  alt="Profile"
                  width={200}
                  height={200}
                />
              ) : (
                <div className={style.profile__main__avatar__image}>
                  {profile?.name
                    ? /^[A-Za-z]$/.test(profile.name.charAt(0))
                      ? profile.name.charAt(0).toUpperCase()
                      : "#"
                    : "A"}
                </div>
              )}
            </label>
            {changeImage.name ? (
              <p className={style.profile__main__avatar__label}>
                {changeImage.name}
              </p>
            ) : (
              <>
                <label
                  className={style.profile__main__avatar__label}
                  htmlFor="upload_image"
                >
                  Pilih Gambar
                </label>
                <p>Ukuran gambar maks. 1MB</p>
              </>
            )}
            <Input
              name="image"
              id="upload_image"
              type="file"
              onChange={(e: any) => {
                e.preventDefault();
                setChangeImage(e.currentTarget.files[0]);
              }}
            />
            {changeImage.name && (
              <Button
                type="submit"
                className={style.profile__main__avatar__button}
              >
                {isLoading ? "Loading..." : "Simpan Perubahan"}
              </Button>
            )}
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
