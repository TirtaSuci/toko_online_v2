import ProductsView from "@/components/view/products";
import productServices from "@/Services/products";
import { useEffect, useState } from "react";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    const response = await productServices.getAllProducts();
    setProducts(response.data.data);
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <>
      < ProductsView products={products} />
    </>
  );
};
export default ProductsPage;