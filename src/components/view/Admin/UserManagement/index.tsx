import AdminLayout from "@/components/layouts/AdminLayout";
import Button from "@/components/layouts/UI/Button";
import style from "./UserManagement.module.scss";
import { useEffect, useState } from "react";
import ModalUpdateUser from "./ModalUpdateUSer";
import ModalDeleteUser from "./ModalDeleteUser";

type Propstype = {
  users: any[];
};

const UsersAdminView = (props: Propstype) => {
  const { users } = props;
  const [updateData, setUpdateData] = useState<any>({});
  const [usersData, setUserData] = useState<any>([]);
  const [deletedUser, setDeletedUser] = useState<any>([]);

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
              {usersData.map((user: any, index: number) => (
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
      {Object.keys(updateData).length > 0 && (
        <ModalUpdateUser
          updateData={updateData}
          setUpdateData={setUpdateData}
          setUserData={setUserData}
        ></ModalUpdateUser>
      )}
      {Object.keys(deletedUser).length > 0 && (
        <ModalDeleteUser
          deletedUser={deletedUser}
          setDeletedUser={setDeletedUser}
          setUserData={setUserData}
        ></ModalDeleteUser>
      )}
    </>
  );
};

export default UsersAdminView;
