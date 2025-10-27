import UsersAdminView from "@/components/view/Admin/UserManagement";
import userServices from "@/Services/user";
import { useEffect, useState } from "react";

const UserIndex = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getAllUsers = async () => {
      const response = await userServices();
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
