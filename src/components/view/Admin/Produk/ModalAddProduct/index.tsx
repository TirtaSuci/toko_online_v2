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

  const uploadImages = (id: string, form: any) => {
    const file = form.image.target.files[0];
    const newName = `product.${file.name.split(".")[1]}`;
    if (file) {
      uploadImage(
        id,
        file,
        newName,
        "products",
        async (status: boolean, newImageURL?: string) => {
          if (status) {
            const data = { image: newImageURL };
            const result = await productServices.updateServices(
              id,
              data,
              session?.data?.accessToken
            );
            if (result.status === 200) {
              setIsLoading(false);
              setUploadedImage(null);
              form.reset();
              setAddProduct(false);
              setToaster?.({
                variant: "success",
                message: "Product updated successfully",
              });
            } else {
              setIsLoading(false);
              setToaster?.({
                variant: "error",
                message: "Failed to update product",
              });
            }
          }
        }
      );
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target as HTMLFormElement;
    const data = {
      name: form.nama.value,
      category: form.category.value,
      price: form.harga.value,
      status: form.status.value,
      stock: stockCount,
      image: "",
    };
    const result = await productServices.addProducts(
      data,
      session?.data?.accessToken
    );
    if (result.status === 200) {
      setIsLoading(false);
      uploadImages(result.data.data.id, form);
      setProductsData((prev) => [...prev, result.data.data]);
      setAddProduct(false);
      setToaster?.({
        variant: "success",
        message: "Product added successfully",
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
