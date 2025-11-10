import { uploadImage } from "@/lib/firebase/service";
import style from "./Avatar.module.scss";
import { useState } from "react";
import userServices from "@/Services/user";
import Image from "next/image";
import Input from "@/components/layouts/UI/Input";
import Button from "@/components/layouts/UI/Button";

const AvatarView = ({ profile, setProfile, session, setToaster }: any) => {
  const [changeImage, setChangeImage] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

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
              setToaster({
                variant: "success",
                message: "Profile image updated successfully",
              });
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
          <Button type="submit" className={style.profile__main__avatar__button}>
            {isLoading ? "Loading..." : "Simpan Perubahan"}
          </Button>
        )}
      </form>
    </div>
  );
};
export default AvatarView;
