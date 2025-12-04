import Modal from "@/components/layouts/Modal";
import Button from "@/components/layouts/UI/Button";
import Input from "@/components/layouts/UI/Input";
import Select from "@/components/layouts/UI/Select/indext";
import userServices from "@/Services/user";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import { user } from "@/types/user.type";
import style from "./ModalUpdateUser.module.scss";

type ModalUpdateUserProps = {
  updateData: Partial<user> | null;
  setUpdateData: (v: Partial<user> | null) => void;
  setUserData: (data: user[]) => void;
  setToaster?: (
    toaster: { variant: "success" | "error"; message?: string } | null
  ) => void;
};

const ModalUpdateUser = (props: ModalUpdateUserProps) => {
  const { updateData, setUpdateData, setUserData, setToaster } = props;
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const form = event.target as HTMLFormElement;
    const roleSelect = form.elements.namedItem("role") as HTMLSelectElement;
    const data: Partial<user> = {
      role: roleSelect?.value,
    };
    const result = await userServices.updateServices(
      updateData?.id || "",
      data,
      (session.data as unknown as { accessToken: string })
        ?.accessToken as string
    );

    if (result.status === 200) {
      setIsLoading(false);
      setUpdateData(null);
      setToaster?.({
        variant: "success",
        message: "User updated successfully",
      });
      const response = await userServices.getAllUsers();
      setUserData(response.data.data);
    } else {
      setIsLoading(false);
      setToaster?.({
        variant: "error",
        message: "Failed to update user",
      });
    }
  };
  return (
    <Modal onClose={() => setUpdateData(null)}>
      <h1>Update User</h1>
      <form onSubmit={handleRegister}>
        <Input
          label="Fullname"
          name="fullname"
          deafultValue={updateData?.fullname}
          disabled
        />
        <Input
          label="Email"
          name="email"
          deafultValue={updateData?.email}
          disabled
        />
        <Select
          label="Role"
          name="role"
          defaultValue={updateData?.role}
          options={[
            { label: "member", value: "member" },
            { label: "admin", value: "admin" },
          ]}
        ></Select>
        <Button type="submit">{isLoading ? "Loading..." : "Update"}</Button>
      </form>
    </Modal>
  );
};

export default ModalUpdateUser;
