import Modal from "@/components/layouts/Modal";
import Button from "@/components/layouts/UI/Button";
import Input from "@/components/layouts/UI/Input";
import Select from "@/components/layouts/UI/Select/indext";
import userServices from "@/Services/user";
import { FormEvent, useState } from "react";

const ModalUpdateUser = (props: any) => {
  const { updateData, setUpdateData, setUserData } = props;
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const form: any = event.target as HTMLFormElement;
    const data = {
      role: form.role.value,
    };
    const result = await userServices.updateServices(updateData.id, data);

    if (result.status === 200) {
      setIsLoading(false);
      setUpdateData({});
      const response = await userServices.getAllUsers();
      setUserData(response.data.data);
    } else {
      setIsLoading(false);
    }
  };
  return (
    <Modal onClose={() => setUpdateData({})}>
      <h1>Update User</h1>
      <form onSubmit={handleRegister}>
        <Input
          label="Fullname"
          name="fullname"
          deafultValue={updateData.fullname}
          disabled
        />
        <Input
          label="Email"
          name="email"
          deafultValue={updateData.email}
          disabled
        />
        <Select
          label="Role"
          name="role"
          defaultValue={updateData.role}
          options={[
            { label: "member", value: "member" },
            { label: "admin", value: "admin" },
          ]}
        ></Select>
        <Button type="submit" variant="primary">
          {isLoading ? "Loading..." : "Update"}
        </Button>
      </form>
    </Modal>
  );
};

export default ModalUpdateUser;
