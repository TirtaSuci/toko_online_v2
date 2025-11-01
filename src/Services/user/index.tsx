import instance from "@/lib/axios/instance";

const userServices = {
  getAllUsers: () => instance.get("/api/user"),
  updateServices: (id: string, data: any, token: string) =>
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
};
export default userServices;
