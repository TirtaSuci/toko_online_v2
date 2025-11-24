import Modal from "@/components/layouts/Modal";
import Button from "@/components/layouts/UI/Button";
import Input from "@/components/layouts/UI/Input";
import Select from "@/components/layouts/UI/Select/indext";
import { products } from "@/types/products.type";
import { Dispatch, SetStateAction, useState } from "react";
import style from "./ModalAddProduct.module.scss";
import InputFile from "@/components/layouts/UI/InputFile";

type PropsType = {
  setProductsData: Dispatch<SetStateAction<products[]>>;
  setAddProduct: Dispatch<SetStateAction<boolean>>;
  setToaster?: (
    t: { variant: "success" | "error"; message?: string } | null
  ) => void;
  variant: "success" | "error";
  message?: string;
};

const ModalAddProduct = (props: PropsType) => {
  const { setProductsData, setAddProduct, setToaster } = props;
  const [stockCount, setStockCount] = useState([{ size: "", qty: 0 }]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number,
    field: "size" | "qty"
  ) => {
    const newStockCount: any = [...stockCount];
    newStockCount[i][field] = e.target.value;
    setStockCount(newStockCount);
  };
  return (
    <Modal
      onClose={() => {
        setAddProduct(false);
      }}
    >
      <h1>Add Product</h1>
      <div className={style.header}>
        <form action="">
          <Input label="Nama Produk" name="name" />
          <Select
            label="Status"
            name="status"
            options={[
              { label: "Released", value: "true" },
              { label: "Not Release", value: "false" },
            ]}
          ></Select>
          {stockCount.map((item: { size: string; qty: number }, i: number) => (
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
          ))}
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
