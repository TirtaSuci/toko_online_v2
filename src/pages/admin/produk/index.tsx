import ProductAdminView from "@/components/view/Admin/Produk";
import productServices from "@/Services/products";
import { useEffect, useState } from "react";

const ProdukPage = () => {
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    const response = await productServices.getAllProducts();
    setProducts(response.data.data);
  };

  useEffect(() => {
    getAllProducts();
  }, []);
  return (
    <div>
      <ProductAdminView products={products}></ProductAdminView>
    </div>
  );
};
export default ProdukPage;
