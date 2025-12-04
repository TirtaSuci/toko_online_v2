import { uploadImage } from "@/lib/firebase/service";
import style from "./Avatar.module.scss";
import React, { useState } from "react";
import userServices from "@/Services/user";
import Image from "next/image";
import Input from "@/components/layouts/UI/Input";
import Button from "@/components/layouts/UI/Button";
import { user } from "@/types/user.type";

type PropsType = {
  profile: {
    id?: string;
    image?: string;
    name?: string;
    fullname?: string;
  } & Record<string, unknown>;
  setProfile: (profile: Record<string, unknown>) => void;
  session: {
    data?: { accessToken?: string; user?: Record<string, unknown> };
  } | null;
  setToaster?: (toaster: { variant: string; message: string }) => void;
};

const AvatarView = (props: PropsType) => {
  const { profile, setProfile, session, setToaster } = props;
  const [changeImage, setChangeImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChangeAvatar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const file = changeImage;
    if (file) {
      uploadImage(
        profile.id as string,
        file,
        "users",
        "profile",
        async (status: boolean, newImageURL?: string, message?: string) => {
          if (status) {
            const data = { image: newImageURL } as Partial<user>;
            const result = await userServices.updateProfile(
              data,
              (session?.data?.accessToken as string) || ""
            );
            if (result.status === 200) {
              setIsLoading(false);
              setProfile({ ...profile, image: newImageURL });
              setChangeImage(null);
              setToaster?.({
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
    setChangeImage(null);
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
        {changeImage?.name ? (
          <div className={style.profile__main__avatar__label}>
            {changeImage.name}
          </div>
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            const input = e.currentTarget;
            setChangeImage(input.files?.[0] ?? null);
          }}
        />
        {changeImage?.name && (
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
