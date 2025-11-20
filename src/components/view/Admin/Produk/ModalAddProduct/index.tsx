import Modal from "@/components/layouts/Modal";
import Button from "@/components/layouts/UI/Button";
import Input from "@/components/layouts/UI/Input";
import Select from "@/components/layouts/UI/Select/indext";
import { products } from "@/types/products.type";
import { Dispatch, SetStateAction, useState } from "react";
import style from "./ModalAddProduct.module.scss";

type PropsType = {
  addProduct: Dispatch<SetStateAction<boolean>>;
  setAddProduct: Dispatch<SetStateAction<products[]>>;
  setToaster?: (
    t: { variant: "success" | "error"; message?: string } | null
  ) => void;
  variant: "success" | "error";
  message?: string;
};

const ModalAddProduct = (props: PropsType) => {
  const { addProduct, setAddProduct, setToaster } = props;
  const [stockCount, setStockCount] = useState([{ size: "", qty: 0 }]);
  const [isLoading, setIsLoading] = useState(false);

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
    <Modal onClose={() => {}}>
      <>
        <h1>Add Product</h1>
        <form action="">
          <Input label="Nama Produk" name="name" />
          <Input label="Image" name="image" />
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
          <Button
            className={style.form__button__add}
            type="button"
            onClick={() => setStockCount([...stockCount, { size: "", qty: 0 }])}
          >
            Add Stock
          </Button>
          <Button
            className={style.form__button__submit}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Add Data"}
          </Button>
        </form>
      </>
    </Modal>
  );
};

export default ModalAddProduct;
