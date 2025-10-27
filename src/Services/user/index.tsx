import instance from "@/lib/axios/instance";

const userServices = () => instance.get("/api/user");

export default userServices;
