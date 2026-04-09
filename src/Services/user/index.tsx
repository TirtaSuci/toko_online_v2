import instance from "@/lib/axios/instance";
import { user } from "@/types/user.type";

const endpoint = {
  getAllUsers: "/api/user",
  updateUser: (id: string) => `/api/user?user=${id}`,
  deleteUser: (id: string) => `/api/user?user=${id}`,
  getProfile: `/api/user/profile/`,
  updateProfile: `/api/user/profile/`,
  changePassword: `/api/user/change-password`,
  getCart: `/api/user/cart`,
  addToCart: `/api/user/cart`,
  updateAddress: (id: string) => `/api/user/address?address=${id}`,
  deleteAddress: (id: string) => `/api/user/address?address=${id}`,
};

const userServices = {
  getAllUsers: () => instance.get(endpoint.getAllUsers),

  updateUser: (id: string, data: Partial<user>) =>
    instance.put(endpoint.updateUser(id), data),

  deleteUser: (id: string) => instance.delete(endpoint.deleteUser(id)),

  getProfile: () => instance.get(endpoint.getProfile),

  updateProfile: (data: Partial<user>) =>
    instance.put(endpoint.updateProfile, data),

  changePassword: (data: {
    userId: string;
    oldPassword: string;
    newPassword: string;
  }) => instance.put(endpoint.changePassword, data),

  getCart: () => instance.get(endpoint.getCart),

  addToCart: (data: { carts: { productId: string; qty: number; size: string }[] }) => instance.put(endpoint.addToCart, { data }),

  addAddress: (data: Record<string, unknown>) => instance.put(`/api/user/address`, { data }),

  updateAddress: (id: string, data: Record<string, unknown>) => instance.put(endpoint.updateAddress(id), { data }),

  deleteAddress: (id: string) => instance.delete(endpoint.deleteAddress(id)),
};
export default userServices;
