import Modal from "@/components/layouts/Modal";
import Button from "@/components/layouts/UI/Button";
import userServices from "@/Services/user";
import { useSession } from "next-auth/react";

const ModalDeleteUser = (props: any) => {
  const { deletedUser, setDeletedUser, setUserData } = props;

  const session: any = useSession();

  console.log("session =", session);

  const handleDelete = async () => {
    userServices.deleteUser(deletedUser.id, session.data?.accessToken);
    const response = await userServices.getAllUsers();
    setUserData(response.data.data);
    setDeletedUser({});
  };

  return (
    <Modal onClose={() => setDeletedUser({})}>
      <h1>Are you sure</h1>
      <Button onClick={handleDelete}>Yes</Button>
    </Modal>
  );
};

export default ModalDeleteUser;
