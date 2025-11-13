import instance from "@/lib/axios/instance";
import { user } from "@/types/user.type";

const userServices = {
  getAllUsers: () => instance.get("/api/user"),
  updateServices: (id: string, data: Partial<user>, token: string) =>
    instance.put(`/api/user?user=${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  deleteUser: (id: string, token: string) =>
    instance.delete(`/api/user?user=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getProfile: (token: string) =>
    instance.get(`/api/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  updateProfile: (data: Partial<user>, token: string) =>
    instance.put(`/api/user/profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  changePassword: (
    data: { userId: string; oldPassword: string; newPassword: string },
    token: string
  ) =>
    instance.put(`/api/user/change-password`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
export default userServices;
