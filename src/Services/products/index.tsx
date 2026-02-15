import instance from "@/lib/axios/instance";
import { products } from "@/types/products.type";

const productServices = {
  getAllProducts: () => instance.get("/api/admin/products"),
  getDetailProducts: (id: string) => instance.get(`/api/admin/products?product=${id}`),

  addProducts: (data: any, token: string) =>
    instance.post(`/api/admin/products`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // addImage: (id: string, data: any, token: string) =>
  //   instance.put(
  //     `/api/admin/products?product=${id}`,
  //     { data },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   ),

  updateProducts: (id: string, data: any, token: string) =>
    instance.put(`/api/admin/products?product=${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  deleteProduct: (id: string, token: string) =>
    instance.delete(`/api/admin/products?product=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
export default productServices;
