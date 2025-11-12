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
        async (status: boolean, newImageURL?: string, message?: string) => {
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
                message: "Profile picture updated successfully",
              });
              // clear file input safely
              const inputEl = document.getElementById(
                "upload_image"
              ) as HTMLInputElement | null;
              if (inputEl) inputEl.value = "";
            } else {
              setIsLoading(false);
              setToaster?.({
                variant: "error",
                message: "Failed to update profile",
              });
            }
          } else {
            setIsLoading(false);
            setToaster?.({
              variant: "error",
              message: message || "Failed to upload image",
            });
          }
        }
      );
    }
  };

  const handleImageCancel = () => {
    setChangeImage({});
    const inputEl = document.getElementById(
      "upload_image"
    ) as HTMLInputElement | null;
    if (inputEl) inputEl.value = "";
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
          <div className={style.profile__main__avatar__button}>
            <Button
              type="submit"
              className={style.profile__main__avatar__button_submit}
            >
              {isLoading ? "Loading..." : "Simpan"}
            </Button>
            <Button
              type="button"
              className={style.profile__main__avatar__button_cancel}
              onClick={handleImageCancel}
            >
              Batal
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
export default AvatarView;
