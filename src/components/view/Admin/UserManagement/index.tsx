import AdminLayout from "@/components/layouts/AdminLayout";
import Button from "@/components/layouts/UI/Button";
import style from "./UserManagement.module.scss";
import Modal from "@/components/layouts/Modal";
import { useState } from "react";
import ModalUpdateUser from "./ModalUpdateUSer";

type Propstype = {
  users: any[];
};

const UsersAdminView = (props: Propstype) => {
  const { users } = props;
  const [modal, setModal] = useState<any>({});
  return (
    <>
      <AdminLayout>
        <div className={style.Users}>
          <h1>Users Managemen</h1>
          <table className={style.Users__table}>
            <thead>
              <tr>
                <th>No.</th>
                <th>id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index: number) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.id}</td>
                  <td>{user.fullname}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <div className={style.Users__table__action}>
                      <Button
                        type="button"
                        className={style.Users__table__action__button}
                        onClick={() => setModal(user)}
                      >
                        Update
                      </Button>
                      <Button
                        type="button"
                        className={style.Users__table__action__button}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminLayout>
      {Object.keys(modal).length > 0 && (
        <ModalUpdateUser modal={modal} setModal={setModal}></ModalUpdateUser>
      )}
    </>
  );
};

export default UsersAdminView;
