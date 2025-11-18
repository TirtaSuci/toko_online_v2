import instance from "@/lib/axios/instance";

const productServices = {
  getAllProducts: () => instance.get("/api/admin/products"),
};
export default productServices;
