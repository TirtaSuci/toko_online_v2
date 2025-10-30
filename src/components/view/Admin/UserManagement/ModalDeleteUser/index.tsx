import Modal from "@/components/layouts/Modal";
import Button from "@/components/layouts/UI/Button";
import userServices from "@/Services/user";

const ModalDeleteUser = (props: any) => {
  const { deletedUser, setDeletedUser } = props;
  return (
    <Modal onClose={() => setDeletedUser({})}>
      <h1>Are you sure</h1>
      <Button
        onClick={() => {
          userServices.deleteUser(deletedUser.id);
          setDeletedUser({});
        }}
      >
        Yes
      </Button>
    </Modal>
  );
};

export default ModalDeleteUser;
