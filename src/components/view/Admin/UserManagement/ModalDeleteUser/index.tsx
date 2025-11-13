import Modal from "@/components/layouts/Modal";
import Button from "@/components/layouts/UI/Button";
import userServices from "@/Services/user";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { user } from "@/types/user.type";

type ModalDeleteUserProps = {
  deletedUser: Partial<user> | null;
  setDeletedUser: (v: Partial<user> | null) => void;
  setUserData: (data: user[]) => void;
  setToaster?: (
    t: { variant: "success" | "error"; message?: string } | null
  ) => void;
};

const ModalDeleteUser = (props: ModalDeleteUserProps) => {
  const { deletedUser, setDeletedUser, setUserData, setToaster } = props;

  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!deletedUser?.id) return;
    const token = (session as unknown as { data?: { accessToken?: string } })
      ?.data?.accessToken;
    if (!token) {
      setToaster?.({ variant: "error", message: "Not authenticated" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await userServices.deleteUser(deletedUser.id, token);

      if (res?.status >= 200 && res?.status < 300) {
        try {
          const response = await userServices.getAllUsers();
          setUserData(response.data.data);
        } catch (err) {
          // non-fatal: still close modal but notify user
          console.error("Failed to refresh users after delete", err);
        }

        setToaster?.({ variant: "success", message: "User deleted." });
        setDeletedUser(null);
      } else {
        const msg = res?.data?.message || "Failed to delete user";
        setToaster?.({ variant: "error", message: msg });
      }
    } catch (err) {
      console.error(err);
      const e = err as unknown as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        e.response?.data?.message || e.message || "Terjadi kesalahan";
      setToaster?.({ variant: "error", message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal onClose={() => setDeletedUser(null)}>
      <h1>Are you sure</h1>
      <Button onClick={handleDelete} disabled={isLoading}>
        {isLoading ? "Loading..." : "Yes"}
      </Button>
    </Modal>
  );
};

export default ModalDeleteUser;
