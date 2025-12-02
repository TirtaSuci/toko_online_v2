import Modal from "@/components/layouts/Modal";
import Button from "@/components/layouts/UI/Button";
import Input from "@/components/layouts/UI/Input";
import Select from "@/components/layouts/UI/Select/indext";
import { products } from "@/types/products.type";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
  useEffect,
} from "react";
import style from "./ModalProductsUpdater.module.scss";
import InputFile from "@/components/layouts/UI/InputFile";
import productServices from "@/Services/products";
import { useSession } from "next-auth/react";
import { uploadImage, getAllImagesFromStorage } from "@/lib/firebase/service";
import Image from "next/image";

type PropsType = {
  updateData: Partial<products>;
  setProductsData: Dispatch<SetStateAction<products[]>>;
  setUpdateData: Dispatch<SetStateAction<Partial<products> | null>>;
  setToaster?: (
    toaster: { variant: "success" | "error"; message?: string } | null
  ) => void;
};

const ModalProductsUpdater = (props: PropsType) => {
  const { updateData, setProductsData, setUpdateData, setToaster } = props;
  const [stockCount, setStockCount] = useState(
    updateData?.stock || [{ size: "", qty: 0 }]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [allImages, setAllImages] = useState<
    Array<{ name: string; url: string }>
  >([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const session: any = useSession();

  // Fetch all images when modal opens
  useEffect(() => {
    if (updateData?.id) {
      setImagesLoading(true);
      getAllImagesFromStorage(updateData.id)
        .then((images) => {
          setAllImages(images);
        })
        .catch((error) => {
          console.error("Error loading images:", error);
          setAllImages([]);
        })
        .finally(() => {
          setImagesLoading(false);
        });
    }
  }, [updateData?.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number,
    field: "size" | "qty"
  ) => {
    const newStockCount: any = [...stockCount];
    newStockCount[i][field] = e.target.value;
    setStockCount(newStockCount);
  };

  const UploadImage = (id: string, form: any) => {
    const file = form.image.files[0];
    if (file) {
      uploadImage(
        id,
        file,
        "productImage1",
        "products/image",
        async (status: boolean, newImageURL?: string, message?: string) => {
          if (status) {
            const data = { image: newImageURL };
            const result = await productServices.updateProducts(
              id,
              data,
              session.data?.accessToken
            );
            if (result.status === 200) {
              setIsLoading(false);
              setUploadedImage(null);
              form.reset();
              setUpdateData(null);
              const { data } = await productServices.getAllProducts();
              setProductsData(data.data);
              setToaster?.({
                variant: "success",
                message: "Produk berhasil diperbarui",
              });
            } else {
              setToaster?.({ variant: "error", message: result.data.message });
              setIsLoading(false);
            }
          } else {
            setToaster?.({
              variant: "error",
              message: message || "Upload failed",
            });
            setIsLoading(false);
          }
        }
      );
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

    const data = {
      name: form.nama.value,
      category: form.category.value,
      price: form.harga.value,
      status: form.status.value,
      stock: stockCount,
      image: ``,
    };
    const result = await productServices.updateProducts(
      updateData?.id || "",
      data,
      session?.data?.accessToken
    );
    if (result.status === 200) {
      UploadImage(result.data.data.id, form);
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
        setUpdateData(null);
      }}
    >
      <h2>Update Product</h2>
      <div className={style.header}>
        <form onSubmit={handleSubmit}>
          {/* Basic Info Section */}
          <div className={style.form__section}>
            <h3 className={style.form__sectionTitle}>Informasi Produk</h3>
            <div className={style.form__sectionInner}>
              <Input
                label="Nama Produk"
                name="nama"
                type="text"
                deafultValue={updateData.name}
              />
              <Input
                label="Kategori"
                name="category"
                type="text"
                deafultValue={updateData.category}
              />
              <Input
                label="Harga Produk"
                name="harga"
                type="number"
                deafultValue={updateData.price}
              />
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

          {/* Stock Section */}
          <div className={style.form__section}>
            <h3 className={style.form__sectionTitle}>Stock Management</h3>
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
                        value={item.size}
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

          {/* Images Section */}
          <div className={style.form__section}>
            <h3 className={style.form__sectionTitle}>Gambar Produk</h3>

            {/* Main Product Image Preview */}
            <div className={style.form__imageSection}>
              <div className={style.form__mainImage}>
                <p className={style.form__label}>Preview Gambar Utama</p>
                <Image
                  src={
                    uploadedImage
                      ? URL.createObjectURL(uploadedImage)
                      : updateData?.image || "/image/deafult.jpg"
                  }
                  alt="Main Product Image"
                  width={250}
                  height={250}
                  className={style.form__imagePreview}
                />
              </div>

              <InputFile
                name="image"
                setUploadedImage={setUploadedImage}
                uploadedImage={uploadedImage}
              />
            </div>

            {/* All Images Gallery */}
            {allImages.length > 0 && (
              <div className={style.form__gallery}>
                <p className={style.form__label}>
                  Semua Gambar ({allImages.length})
                </p>
                <div className={style.form__galleryGrid}>
                  {allImages.map((img, index) => (
                    <div key={index} className={style.form__galleryItem}>
                      <Image
                        src={img.url}
                        alt={img.name}
                        width={120}
                        height={120}
                        className={style.form__galleryImage}
                      />
                      <p className={style.form__galleryName}>{img.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {imagesLoading && (
              <p className={style.form__loadingText}>Memuat gambar...</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            className={style.form__button__submit}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Update Product"}
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default ModalProductsUpdater;
