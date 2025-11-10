import { useState, FormEvent } from "react";
import style from "./DataProfile.module.scss";
// session passed as prop from parent
import userServices from "@/Services/user";
import Input from "@/components/layouts/UI/Input";
import Button from "@/components/layouts/UI/Button";
import Modal from "@/components/layouts/Modal";

const DataProfileView = ({ profile, setProfile, session }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const update = (session as any)?.update;
  const [showChangePw, setShowChangePw] = useState(false);
  const [pwForm, setPwForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isPwLoading, setIsPwLoading] = useState(false);

  const handleChangeProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target as HTMLFormElement;
    const data = {
      fullname: form.fullname.value,
      email: form.email.value,
    };
    const result = await userServices.updateProfile(
      profile.id,
      data,
      session.data?.accessToken
    );
    if (result.status === 200) {
      setIsLoading(false);
      setProfile({ ...profile, fullname: data.fullname, email: data.email });
      await update({
        user: {
          ...session.data.user,
          fullname: data.fullname,
          email: data.email,
        },
      });
      form.reset();
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
            <Button
              type="button"
              onClick={() => setShowChangePw(true)}
              className={style.profile__main__details__data__button}
            >
              Ganti Password
            </Button>
          </div>
        </form>
        {showChangePw && (
          <Modal
            className={style.modalMain}
            onClose={() => setShowChangePw(false)}
          >
            <div className={style.changePwModal}>
              <h3>Ganti Password</h3>
              <div className={style.changePwModal__body}>
                <label>Password Lama</label>
                <Input
                  type="password"
                  value={pwForm.oldPassword}
                  onChange={(e) =>
                    setPwForm((p) => ({ ...p, oldPassword: e.target.value }))
                  }
                />
                <label>Password Baru</label>
                <Input
                  type="password"
                  value={pwForm.newPassword}
                  onChange={(e) =>
                    setPwForm((p) => ({ ...p, newPassword: e.target.value }))
                  }
                />
                <label>Konfirmasi Password Baru</label>
                <Input
                  type="password"
                  value={pwForm.confirmPassword}
                  onChange={(e) =>
                    setPwForm((p) => ({
                      ...p,
                      confirmPassword: e.target.value,
                    }))
                  }
                />
              </div>
              <div className={style.changePwModal__actions}>
                <Button
                  type="button"
                  onClick={async () => {
                    // client-side validation
                    if (!pwForm.oldPassword || !pwForm.newPassword) {
                      alert("Lengkapi field password");
                      return;
                    }
                    if (pwForm.newPassword !== pwForm.confirmPassword) {
                      alert("Konfirmasi password tidak cocok");
                      return;
                    }
                    setIsPwLoading(true);
                    try {
                      const token = session?.data?.accessToken;
                      const payload = {
                        userId: profile.id,
                        oldPassword: pwForm.oldPassword,
                        newPassword: pwForm.newPassword,
                      };
                      const res = await userServices.changePassword(
                        payload,
                        token
                      );
                      if (res.status === 200) {
                        alert("Password berhasil diubah.");
                        setShowChangePw(false);
                        setPwForm({
                          oldPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      } else {
                        alert(res.data?.message || "Gagal mengubah password");
                      }
                    } catch (err) {
                      console.error(err);
                      alert(
                        (err as any)?.response?.data?.message ||
                          "Terjadi kesalahan"
                      );
                    } finally {
                      setIsPwLoading(false);
                    }
                  }}
                >
                  {isPwLoading ? "Loading..." : "Simpan"}
                </Button>
                <Button type="button" onClick={() => setShowChangePw(false)}>
                  Batal
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default DataProfileView;
