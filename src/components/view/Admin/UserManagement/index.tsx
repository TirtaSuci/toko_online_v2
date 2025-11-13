import AdminLayout from "@/components/layouts/AdminLayout";
import Button from "@/components/layouts/UI/Button";
import style from "./UserManagement.module.scss";
import { useEffect, useState } from "react";
import ModalUpdateUser from "./ModalUpdateUSer";
import ModalDeleteUser from "./ModalDeleteUser";
import { user } from "@/types/user.type";

type Propstype = {
  users: user[] | [];
  setToaster?: (
    toaster: { variant: "success" | "error"; message?: string } | null
  ) => void;
};

const UsersAdminView = (props: Propstype) => {
  const { users, setToaster } = props;
  const [updateData, setUpdateData] = useState<Partial<user> | null>(null);
  const [usersData, setUserData] = useState<user[]>([]);
  const [deletedUser, setDeletedUser] = useState<Partial<user> | null>(null);

  useEffect(() => {
    setUserData(users);
  }, [users]);

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
              {usersData.map((user: user, index: number) => (
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
                        className={style.Users__table__action__button__edit}
                        onClick={() => setUpdateData(user)}
                      >
                        <i className="bx bxs-edit" />
                      </Button>
                      <Button
                        type="button"
                        className={style.Users__table__action__button__delete}
                        onClick={() => setDeletedUser(user)}
                      >
                        <i className="bx bxs-trash" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminLayout>
      {updateData && Object.keys(updateData).length > 0 && (
        <ModalUpdateUser
          updateData={updateData}
          setUpdateData={setUpdateData}
          setUserData={setUserData}
          setToaster={setToaster}
        ></ModalUpdateUser>
      )}
      {deletedUser && Object.keys(deletedUser).length > 0 && (
        <ModalDeleteUser
          deletedUser={deletedUser}
          setDeletedUser={setDeletedUser}
          setUserData={setUserData}
          setToaster={setToaster}
        ></ModalDeleteUser>
      )}
    </>
  );
};

export default UsersAdminView;
