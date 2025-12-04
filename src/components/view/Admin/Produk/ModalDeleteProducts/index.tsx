import Modal from "@/components/layouts/Modal";
import Button from "@/components/layouts/UI/Button";
import {
  deleteMultipleFiles,
  getAllImagesFromStorage,
} from "@/lib/firebase/service";
import productServices from "@/Services/products";
import { products } from "@/types/products.type";
import { useSession } from "next-auth/react";
import { useState } from "react";
import style from "./ModalDeleteProducts.module.scss";

type ModalDeleteProductsProps = {
  deletedProduct: Partial<products> | null;
  setDeletedProduct: (v: Partial<products> | null) => void;
  setProductsData: (data: products[]) => void;
  setToaster?: (
    t: { variant: "success" | "error"; message?: string } | null
  ) => void;
};

const ModalDeleteProducts = (props: ModalDeleteProductsProps) => {
  const { deletedProduct, setDeletedProduct, setProductsData, setToaster } =
    props;
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!deletedProduct?.id) return;
    const token = (session as unknown as { data?: { accessToken?: string } })
      ?.data?.accessToken;
    if (!token) {
      setToaster?.({ variant: "error", message: "Not authenticated" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await productServices.deleteProduct(deletedProduct.id, token);
      if (res?.status >= 200 && res?.status < 300) {
        try {
          // Fetch all images for this product from storage
          const allImages = await getAllImagesFromStorage(deletedProduct.id);

          if (allImages.length > 0) {
            // Extract file paths from the image objects
            const imagePaths = allImages.map((img) => img.fullPath);

            // Delete all images
            deleteMultipleFiles(
              imagePaths,
              async (successCount, totalCount) => {
                console.log(`Deleted ${successCount}/${totalCount} images`);
                const response = await productServices.getAllProducts();
                setProductsData(response.data.data);
              }
            );
          } else {
            const response = await productServices.getAllProducts();
            setProductsData(response.data.data);
          }
        } catch (err) {
          console.error("Failed to delete images", err);
          const response = await productServices.getAllProducts();
          setProductsData(response.data.data);
        }
        setToaster?.({ variant: "success", message: "Product deleted." });
        setDeletedProduct(null);
      } else {
        const msg = res?.data?.message || "Failed to delete product";
        setToaster?.({ variant: "error", message: msg });
      }
    } catch (err) {
      console.error(err);
      const e = err as unknown as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        e.response?.data?.message || e.message || "Terjadi kesalahan";
      setToaster?.({ variant: "error", message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal className={style.modal} onClose={() => setDeletedProduct(null)}>
      <div className={style.wrapper}>
        <h1>Are you sure</h1>
        <div className={style.button}>
          <Button
            className={style.button__delete}
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Yes"}
          </Button>
          <Button
            className={style.button__cancel}
            onClick={() => setDeletedProduct(null)}
          >
            No
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDeleteProducts;
