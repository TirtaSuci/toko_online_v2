import instance from "@/lib/axios/instance";

const userServices = {
  getAllUsers: () => instance.get("/api/user"),
  updateServices: (id: string, data: any) =>
    instance.put("/api/user", { id, data }),
};
export default userServices;
