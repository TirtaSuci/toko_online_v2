import instance from "@/lib/axios/instance";

const productServices = {
  getAllProducts: () => instance.get("/api/admin/products"),

  getDetailProducts: (id: string) => instance.get(`/api/admin/products?product=${id}`),

  addProducts: (data: Record<string, unknown>) =>
    instance.post(`/api/admin/products`, data),

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

  updateProducts: (id: string, data: Record<string, unknown>) =>
    instance.put(`/api/admin/products?product=${id}`, data),

  deleteProduct: (id: string) =>
    instance.delete(`/api/admin/products?product=${id}`),
};
export default productServices;
