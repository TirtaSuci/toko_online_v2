import { useState } from "react";
import Modal from "@/components/layouts/Modal";
import Button from "@/components/layouts/UI/Button";
import Input from "@/components/layouts/UI/Input";
import userServices from "@/Services/user";
import style from "../DataProfile/DataProfile.module.scss";
import type { user } from "@/types/user.type";

type ResetPasswordProps = {
  isOpen: boolean;
  onClose: () => void;
  profile: Partial<user>;
  session: { data?: { accessToken?: string } };
  setToaster?: (toaster: {
    variant: "success" | "error";
    message: string;
  }) => void;
};

const ResetPasswordView = ({
  isOpen,
  onClose,
  profile,
  session,
  setToaster,
}: ResetPasswordProps) => {
  const [pwForm, setPwForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isPwLoading, setIsPwLoading] = useState(false);

  const handleResetPassword = async () => {
    // client-side validation
    if (!pwForm.oldPassword || !pwForm.newPassword) {
      alert("Lengkapi field password");
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      alert("Konfirmasi password tidak cocok");
      return;
    }
    if (!profile.id) {
      alert("User ID tidak ditemukan");
      return;
    }

    setIsPwLoading(true);
    try {
      const token = session?.data?.accessToken;
      if (!token) {
        alert("Token tidak ditemukan");
        return;
      }
      const payload = {
        userId: profile.id,
        oldPassword: pwForm.oldPassword,
        newPassword: pwForm.newPassword,
      };
      const res = await userServices.changePassword(payload, token);
      if (res.status === 200) {
        onClose();
        setPwForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setToaster?.({
          variant: "success",
          message: "Password berhasil diubah.",
        });
      } else {
        alert(res.data?.message || "Gagal mengubah password");
      }
    } catch (err) {
      console.error(err);
      const axiosErr = err as unknown as {
        response?: { data?: { message?: string } };
      };
      alert(axiosErr?.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setIsPwLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal className={style.modalMain} onClose={onClose}>
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
            onClick={handleResetPassword}
            disabled={isPwLoading}
          >
            {isPwLoading ? "Loading..." : "Simpan"}
          </Button>
          <Button type="button" onClick={onClose}>
            Batal
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ResetPasswordView;
