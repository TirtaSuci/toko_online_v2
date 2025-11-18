import AdminLayout from "@/components/layouts/AdminLayout";
import Button from "@/components/layouts/UI/Button";
import style from "./Produk.module.scss";
import { useEffect, useState } from "react";
import Image from "next/image";
import { products } from "@/types/products.type";
import converIDR from "@/utils/currency";

type Propstype = {
  products: products[] | [];
  setToaster?: (
    toaster: { variant: "success" | "error"; message?: string } | null
  ) => void;
};

const ProductAdminView = (props: Propstype) => {
  const { products, setToaster } = props;
  const [updateData, setUpdateData] = useState<Partial<products> | null>(null);
  const [productsData, setProductsData] = useState<products[]>([]);
  const [deletedProduct, setDeletedProduct] =
    useState<Partial<products> | null>(null);

  console.log(products);

  useEffect(() => {
    setProductsData(products);
  }, [products]);

  return (
    <>
      <AdminLayout>
        <div className={style.Users}>
          <h1>Users Managemen</h1>
          <table className={style.Users__table}>
            <thead>
              <tr>
                <th rowSpan={2}>No.</th>
                <th rowSpan={2}>Image</th>
                <th rowSpan={2}>Name</th>
                <th rowSpan={2}>Category</th>
                <th rowSpan={2}>Price</th>
                <th colSpan={2}>Stock</th>
                <th rowSpan={2}>Action</th>
              </tr>
              <tr>
                <th>Size</th>
                <th>Qty</th>
              </tr>
            </thead>
            <tbody>
              {productsData.map((product: products, index: number) => (
                <>
                  <tr key={product.id}>
                    <td rowSpan={product.stock.length}>{index + 1}</td>
                    <td rowSpan={product.stock.length}>
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={100}
                        height={100}
                      />
                    </td>
                    <td rowSpan={product.stock.length}>{product.name}</td>
                    <td rowSpan={product.stock.length}>{product.category}</td>
                    <td rowSpan={product.stock.length}>
                      {converIDR(product.price)}
                    </td>
                    <td>{product.stock[0].size}</td>
                    <td>{product.stock[0].qty}</td>
                    <td rowSpan={product.stock.length}>
                      <div className={style.Users__table__action}>
                        <Button
                          type="button"
                          className={style.Users__table__action__button__edit}
                          onClick={() => setUpdateData(product)}
                        >
                          <i className="bx bxs-edit" />
                        </Button>
                        <Button
                          type="button"
                          className={style.Users__table__action__button__delete}
                          onClick={() => setDeletedProduct(product)}
                        >
                          <i className="bx bxs-trash" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {product.stock
                    .slice(1)
                    .map((stock: { size: string; qty: number }) => (
                      <tr key={stock.size}>
                        <td>{stock.size}</td>
                        <td>{stock.qty}</td>
                      </tr>
                    ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </AdminLayout>
    </>
  );
};

export default ProductAdminView;
