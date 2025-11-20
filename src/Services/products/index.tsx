import instance from "@/lib/axios/instance";
import { products } from "@/types/products.type";

const productServices = {
  getAllProducts: () => instance.get("/api/admin/products"),

  updateServices: (id: string, data: Partial<products>, token: string) =>
    instance.put(`/api/admin/products?product=${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
export default productServices;
