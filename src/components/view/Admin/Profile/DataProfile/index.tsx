import { useState, FormEvent } from "react";
import style from "./DataProfile.module.scss";
import userServices from "@/Services/user";
import Input from "@/components/layouts/UI/Input";
import Button from "@/components/layouts/UI/Button";
import ResetPasswordView from "../ResetPassword";

const DataProfileView = ({
  profile,
  setProfile,
  session,
  setToaster,
}: {
  profile: any;
  setProfile: (profile: any) => void;
  session: any;
  setToaster?: (toaster: {
    variant: "success" | "error";
    message: string;
  }) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const update = (session as any)?.update;
  const [showChangePw, setShowChangePw] = useState(false);

  const handleChangeProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target as HTMLFormElement;
    const data = {
      fullname: form.fullname.value,
      email: form.email.value,
      phone: form.phone.value,
    };
    const result = await userServices.updateProfile(
      data,
      session.data?.accessToken
    );
    if (result.status === 200) {
      setIsLoading(false);
      setProfile({
        ...profile,
        fullname: data.fullname,
        email: data.email,
        phone: data.phone,
      });
      await update({
        user: {
          ...session.data.user,
          fullname: data.fullname,
          email: data.email,
          phone: data.phone,
        },
      });
      setIsEditing(false);
      form.reset();
      setToaster?.({
        variant: "success",
        message: "Profile updated successfully",
      });
    } else {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className={style.profile__main__details}>
      <div className={style.profile__main__details__title}>Data Profil</div>
      <div className={style.profile__main__details__data}>
        <form onSubmit={handleChangeProfile}>
          <Input
            label="Fullname"
            name="fullname"
            type="text"
            deafultValue={profile.fullname}
            disabled={!isEditing}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            deafultValue={profile.email}
            disabled={!isEditing}
          />
          <Input
            label="Phone"
            name="phone"
            type="number"
            deafultValue={profile.phone}
            disabled={!isEditing}
          />
          <Input
            label="Role"
            name="role"
            type="text"
            deafultValue={profile.role}
            disabled
          />
          <div className={style.profile__main__details__data__actions}>
            {!isEditing ? (
              <>
                <Button
                  type="button"
                  onClick={handleEdit}
                  className={style.profile__main__details__data__button}
                >
                  Edit
                </Button>
              </>
            ) : (
              <div className={style.profile__main__details__data__edit}>
                <Button
                  type="submit"
                  className={style.profile__main__details__data__button}
                >
                  {isLoading ? "Loading..." : "Simpan"}
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  className={style.profile__main__details__data__button}
                >
                  batal
                </Button>
              </div>
            )}
            {(session?.user as any)?.type !== "google" && (
              <Button
                type="button"
                onClick={() => setShowChangePw(true)}
                className={style.profile__main__details__data__button}
              >
                Ganti Password
              </Button>
            )}
          </div>
        </form>
        <ResetPasswordView
          isOpen={showChangePw}
          onClose={() => setShowChangePw(false)}
          profile={profile}
          session={session}
          setToaster={setToaster}
        />
      </div>
    </div>
  );
};

export default DataProfileView;
