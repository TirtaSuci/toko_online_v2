import AdminLayout from "@/components/layouts/AdminLayout";
import Button from "@/components/layouts/UI/Button";
import style from "./UserManagement.module.scss";

type Propstype = {
  users: any[];
};

const UsersAdminView = (props: Propstype) => {
  const { users } = props;
  return (
    <div className={style.Users}>
      <AdminLayout>
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
                    <Button type="button">Update</Button>
                    <Button type="button">Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminLayout>
    </div>
  );
};

export default UsersAdminView;
