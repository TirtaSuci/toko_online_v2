import Modal from "@/components/layouts/Modal";
import Input from "@/components/layouts/UI/Input";

const ModalUpdateUser = (props: any) => {
  const { modal, setModal } = props;
  return (
    <Modal onClose={() => setModal({})}>
      <h1>Update User</h1>
      <Input
        label="Fullname"
        name="fullname"
        deafultValue={modal.fullname}
        disabled
      />
      <Input label="Email" name="email" deafultValue={modal.email} disabled />
      <Input label="Role" name="role" deafultValue={modal.role} />
    </Modal>
  );
};

export default ModalUpdateUser;
