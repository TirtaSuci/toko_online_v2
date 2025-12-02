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
import Image from "next/image";
import InputFile from "@/components/layouts/UI/InputFile";
import { div } from "motion/react-client";

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
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const session = useSession();
  const token = (session as unknown as { data?: { accessToken?: string } })
    ?.data?.accessToken;

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
                  token ?? ""
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
    await processUpload(uploadedImage!, `productImage1`, true);

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
    const result = await productServices.addProducts(data, token ?? "");
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
      className={style.wrapper}
      onClose={() => {
        setAddProduct(false);
      }}
    >
      <h2>Add Product</h2>
      <div className={style.header}>
        <form onSubmit={handleSubmit}>
          <div className={style.form__section}>
            <h3 className={style.form__sectionTitle}>Informasi Produk</h3>
            <div className={style.form__sectionInner}>
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
            </div>
          </div>
          <div className={style.form__section}>
            <h3 className={style.form__sectionTitle}>Stock</h3>
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
                + Add Stock
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
          </div>

          <div className={style.form__section}>
            <h3 className={style.form__sectionTitle}>Gambar Produk</h3>
            <div className={style.form__imageSection}>
              <div className={style.form__mainImage}>
                <p className={style.form__label}>Unggah Gambar Cover</p>
                {uploadedImage ? (
                  <>
                    <div className={style.form__imageWrap}>
                      <label htmlFor="image" className={style.form__imageLabel}>
                        <Image
                          src={URL.createObjectURL(uploadedImage)}
                          alt="Preview"
                          width={250}
                          height={250}
                          className={style.form__imagePreview}
                        />
                      </label>
                    </div>
                    <Button
                      className={style.form__imageRemove}
                      onClick={() => setUploadedImage(null)}
                    >
                      Hapus gambar
                    </Button>
                  </>
                ) : (
                  <>
                    <InputFile
                      className={style.form__inputFile}
                      name="image"
                      setUploadedImage={setUploadedImage}
                      uploadedImage={uploadedImage}
                    >
                      <p>Klik untuk unggah gambar cover</p>
                      <p>Ukuran unggah maksimal 1 MB</p>
                    </InputFile>
                  </>
                )}
              </div>
              <div className={style.form__uploadHelps}>
                <p className={style.form__label}>Unggah Gambar Konten</p>
                <MultiInputFile
                  className={style.form__multiInputFile}
                  name="images"
                  setUploadedImages={setUploadedImages}
                  uploadedImages={uploadedImages}
                >
                  <p>Klik untuk unggah gambar</p>
                  <p>Ukuran unggah maksimal 1 MB per file</p>
                </MultiInputFile>

                {/* {uploadedImages.length > 0 && (
                  <div className={style.form__thumbs}>
                    {uploadedImages.map((f, idx) => (
                      <div key={idx} className={style.form__thumbItem}>
                        <Image
                          src={URL.createObjectURL(f)}
                          alt={`img-${idx}`}
                          width={80}
                          height={80}
                          className={style.form__thumbImage}
                        />
                        <span className={style.form__thumbLabel}>
                          productImage{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )} */}
              </div>
            </div>
          </div>

          <Button
            className={style.form__button__submit}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Add Product"}
          </Button>
        </form>
      </div>
    </Modal>
  );
};
export default ModalAddProduct;
