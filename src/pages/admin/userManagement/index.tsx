import UsersAdminView from "@/components/view/Admin/UserManagement";
import userService from "@/Services/user";
import { useEffect, useState } from "react";

const UserIndex = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getAllUsers = async () => {
      const response = await userService.getAllUsers();
      setUsers(response.data.data);
    };
    getAllUsers();
  }, []);
  return (
    <div>
      <UsersAdminView users={users} />
    </div>
  );
};
export default UserIndex;
