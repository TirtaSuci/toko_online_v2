import Modal from "@/components/layouts/Modal";
import Button from "@/components/layouts/UI/Button";
import Input from "@/components/layouts/UI/Input";
import Select from "@/components/layouts/UI/Select/indext";
import { products } from "@/types/products.type";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import style from "./ModalAddProduct.module.scss";
import InputFile from "@/components/layouts/UI/InputFile";
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
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const session: any = useSession();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number,
    field: "size" | "qty"
  ) => {
    const newStockCount: any = [...stockCount];
    newStockCount[i][field] = e.target.value;
    setStockCount(newStockCount);
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
    if (!uploadedImage) {
      setToaster?.({ variant: "error", message: "Gambar harus dipilih" });
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

    // Upload image first if provided, get download URL
    let imageUrl = "";
    if (uploadedImage) {
      const newName = `product.${uploadedImage.name.split(".")[1]}`;
      imageUrl = await new Promise<string>((resolve) => {
        uploadImage(
          "temp",
          uploadedImage,
          newName,
          "products",
          (status: boolean, downloadURL: string) => {
            if (!status) {
              setToaster?.({
                variant: "error",
                message: "Gagal upload gambar",
              });
            }
            resolve(status ? downloadURL : "");
          }
        );
      });
      if (!imageUrl) {
        setIsLoading(false);
        return;
      }
    }

    const data = {
      name: form.nama.value,
      category: form.category.value,
      price: form.harga.value,
      status: form.status.value,
      stock: stockCount,
      image: imageUrl,
    };
    const result = await productServices.addProducts(
      data,
      session?.data?.accessToken
    );
    if (result.status === 200) {
      setIsLoading(false);
      setProductsData((prev) => [...prev, result.data.data]);
      setAddProduct(false);
      form.reset();
      setUploadedImage(null);
      setStockCount([{ size: "", qty: 0 }]);
      setToaster?.({
        variant: "success",
        message: "Produk dan gambar berhasil ditambahkan",
      });
      const { data: productsData } = await productServices.getAllProducts();
      setProductsData(productsData.data);
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
                      name="size"
                      type="text"
                      placeholder="Insert product size"
                      onChange={(e) => {
                        handleChange(e, i, "size");
                      }}
                    />
                  </div>
                  <div className={style.form__stock__item}>
                    <Input
                      label="Quantity"
                      name="qty"
                      type="number"
                      placeholder="Insert product quantity"
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
          <InputFile
            name="image"
            setUploadedImage={setUploadedImage}
            uploadedImage={uploadedImage}
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
