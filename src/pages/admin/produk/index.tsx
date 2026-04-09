import ProductAdminView from "@/components/view/Admin/Produk";
import productServices from "@/Services/products";
import { useEffect, useState } from "react";


const ProdukPage = () => {
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const response = await productServices.getAllProducts();
      const productsArray = response.data?.data ?? response.data ?? [];
      setProducts(productsArray);
    } catch (err) {
      console.error("error fetching admin products", err);
      setProducts([]);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div>
      <ProductAdminView/>
    </div>
  );
};
export default ProdukPage;
