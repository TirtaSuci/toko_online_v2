import ProductAdminView from "@/components/view/Admin/Produk";
import productServices from "@/Services/products";
import { useEffect, useState } from "react";

type PageProps = {
  setToaster?: (
    toaster: { variant: "success" | "error"; message?: string } | null
  ) => void;
};

const ProdukPage = ({ setToaster }: PageProps) => {
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
      <ProductAdminView products={products} setToaster={setToaster} />
    </div>
  );
};
export default ProdukPage;
