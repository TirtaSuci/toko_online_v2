import Modal from "@/components/layouts/Modal";
import Button from "@/components/layouts/UI/Button";
import Input from "@/components/layouts/UI/Input";
import Select from "@/components/layouts/UI/Select/indext";
import { products } from "@/types/products.type";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import style from "./ModalAddProduct.module.scss";
import MultiInputFile from "@/components/layouts/UI/MultiInputFile";
import productServices from "@/Services/products";
import { useSession } from "next-auth/react";
import { uploadImage } from "@/lib/firebase/service";

type PropsType = {
  setProductsData: Dispatch<SetStateAction<products[]>>;
  setAddProduct: Dispatch<SetStateAction<boolean>>;
  setToaster?: (
    toaster: { variant: "success" | "error"; message?: string } | null
  ) => void;
};

const ModalAddProduct = (props: PropsType) => {
  const { setProductsData, setAddProduct, setToaster } = props;
  const [stockCount, setStockCount] = useState([{ size: "", qty: 0 }]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const session: any = useSession();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number,
    field: "size" | "qty"
  ) => {
    setStockCount((prev) => {
      const copy = [...prev];
      copy[i] = {
        ...copy[i],
        [field]: field === "qty" ? Number(e.target.value) : e.target.value,
      };
      return copy;
    });
  };

  const UploadImages = async (id: string) => {
    if (uploadedImages.length === 0) return;

    let uploadCount = 0;

    const processUpload = (
      file: File,
      newName: string,
      shouldUpdateProduct = false
    ) =>
      new Promise<void>((resolve) => {
        uploadImage(
          id,
          file,
          "products",
          newName,
          async (status: boolean, downloadURL: string) => {
            if (status) {
              if (shouldUpdateProduct) {
                const data = { image: downloadURL };
                const result = await productServices.updateProducts(
                  id,
                  data,
                  session.data?.accessToken
                );
                if (result.status === 200) {
                  uploadCount++;
                }
              } else {
                // For productImage2+ we only upload to storage (no product update)
                uploadCount++;
              }
            }
            resolve();
          }
        );
      });

    // Upload productImage1 and update product record with its URL
    await processUpload(uploadedImages[0], `productImage1`, true);

    // Upload the rest (productImage2, productImage3, ...) only to storage
    for (let i = 1; i < uploadedImages.length; i++) {
      const file = uploadedImages[i];
      const newName = `productImage${i + 1}`;
      await processUpload(file, newName, false);
    }

    if (uploadCount === uploadedImages.length) {
      setIsLoading(false);
      setUploadedImages([]);
      setAddProduct(false);
      const { data: productsData } = await productServices.getAllProducts();
      setProductsData(productsData.data);
      setToaster?.({
        variant: "success",
        message: `${uploadCount} gambar berhasil ditambahkan`,
      });
    } else {
      setIsLoading(false);
      setToaster?.({
        variant: "error",
        message: "Beberapa gambar gagal diupload",
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target as HTMLFormElement;

    // Validate required fields
    if (!form.nama.value.trim()) {
      setToaster?.({ variant: "error", message: "Nama produk harus diisi" });
      setIsLoading(false);
      return;
    }
    if (!form.category.value.trim()) {
      setToaster?.({ variant: "error", message: "Kategori harus diisi" });
      setIsLoading(false);
      return;
    }
    if (!form.harga.value || Number(form.harga.value) <= 0) {
      setToaster?.({ variant: "error", message: "Harga harus lebih dari 0" });
      setIsLoading(false);
      return;
    }
    if (!uploadedImages || uploadedImages.length === 0) {
      setToaster?.({
        variant: "error",
        message: "Minimal 1 gambar harus dipilih",
      });
      setIsLoading(false);
      return;
    }
    if (stockCount.some((item) => !item.size || item.qty <= 0)) {
      setToaster?.({
        variant: "error",
        message: "Semua size dan quantity harus diisi dengan benar",
      });
      setIsLoading(false);
      return;
    }

    const data = {
      name: form.nama.value,
      category: form.category.value,
      price: form.harga.value,
      status: form.status.value,
      stock: stockCount,
      image: ``,
    };
    const result = await productServices.addProducts(
      data,
      session?.data?.accessToken
    );
    if (result.status === 200) {
      await UploadImages(result.data.data.id);
    } else {
      setIsLoading(false);
      setToaster?.({
        variant: "error",
        message: "Gagal menambahkan produk",
      });
    }
  };

  return (
    <Modal
      onClose={() => {
        setAddProduct(false);
      }}
    >
      <h1>Add Product</h1>
      <div className={style.header}>
        <form onSubmit={handleSubmit}>
          <Input label="Nama Produk" name="nama" type="text" />
          <Input label="Kategori" name="category" type="text" />
          <Input label="Harga Produk" name="harga" type="number" />
          <Select
            label="Status"
            name="status"
            options={[
              { label: "Released", value: "true" },
              { label: "Not Release", value: "false" },
            ]}
          ></Select>
          <h4>Stock</h4>
          <div className={style.form__stockContainer}>
            {stockCount.map(
              (item: { size: string; qty: number }, i: number) => (
                <div className={style.form__stock} key={i}>
                  <div className={style.form__stock__item}>
                    <Input
                      label="Size"
                      type="text"
                      placeholder="Insert product size"
                      value={item.size}
                      onChange={(e) => {
                        handleChange(e, i, "size");
                      }}
                    />
                  </div>
                  <div className={style.form__stock__item}>
                    <Input
                      label="Quantity"
                      type="number"
                      placeholder="Insert product quantity"
                      value={String(item.qty)}
                      onChange={(e) => {
                        handleChange(e, i, "qty");
                      }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
          <div className={style.form__button}>
            <Button
              className={style.form__button__add}
              type="button"
              onClick={() =>
                setStockCount([...stockCount, { size: "", qty: 0 }])
              }
            >
              Add Stock
            </Button>
            {stockCount.length > 1 && (
              <Button
                className={style.form__button__remove}
                type="button"
                onClick={() =>
                  setStockCount(stockCount.slice(0, stockCount.length - 1))
                }
              >
                Remove Stock
              </Button>
            )}
          </div>
          <MultiInputFile
            name="images"
            setUploadedImages={setUploadedImages}
            uploadedImages={uploadedImages}
          />
          <Button
            className={style.form__button__submit}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Add Data"}
          </Button>
        </form>
      </div>
    </Modal>
  );
};
export default ModalAddProduct;
