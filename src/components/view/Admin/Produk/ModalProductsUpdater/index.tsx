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
import {
  uploadImage,
  getAllImagesFromStorage,
  deleteFile,
} from "@/lib/firebase/service";
import Image from "next/image";
import MultiInputFile from "@/components/layouts/UI/MultiInputFile";
import { UpdateData } from "firebase/firestore";

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
    Array<{ name: string; url: string; fullPath?: string }>
  >([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const session: any = useSession();
  const token = session.data?.accessToken;

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
              if (file && shouldUpdateProduct) {
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
    if (uploadedImage) {
      await processUpload(uploadedImage, `productImage1`, true);
    }

    if (uploadedImages.length > 0) {
      for (let i = 1; i < uploadedImages.length; i++) {
        const file = uploadedImages[i];
        // Continue numbering from existing images count
        const nextNumber = allImages.length + i;
        const newName = `productImage${nextNumber}`;
        await processUpload(file, newName, false);
      }
    }

    if (uploadCount === uploadedImages.length) {
      setIsLoading(false);
      setUploadedImages([]);
      setUpdateData(null);
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

  const isDataChanged = (form: HTMLFormElement): boolean => {
    // Check if any field has changed
    const hasBasicInfoChanged =
      updateData?.name !== form.nama.value ||
      updateData?.category !== form.category.value ||
      String(updateData?.price) !== form.harga.value;

    // Check if stock has changed
    const hasStockChanged =
      JSON.stringify(updateData?.stock) !== JSON.stringify(stockCount);

    // Check if new images were uploaded
    const hasNewImages = !!uploadedImage || uploadedImages.length > 0;

    return hasBasicInfoChanged || hasStockChanged || hasNewImages;
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
    /*if (!uploadedImage) {
      setToaster?.({ variant: "error", message: "Gambar harus dipilih" });
      setIsLoading(false);
      return;
    }*/
    if (stockCount.some((item) => !item.size || item.qty <= 0)) {
      setToaster?.({
        variant: "error",
        message: "Semua size dan quantity harus diisi dengan benar",
      });
      setIsLoading(false);
      return;
    }

    // Check if there are any changes
    if (!isDataChanged(form)) {
      setIsLoading(false);
      setToaster?.({
        variant: "error",
        message: "Tidak ada perubahan data untuk diupdate",
      });
      return;
    }

    const data = {
      name: form.nama.value,
      category: form.category.value,
      price: form.harga.value,
      status: form.status.value,
      stock: stockCount,
      image: updateData?.image,
    };
    const result = await productServices.updateProducts(
      updateData?.id || "",
      data,
      session?.data?.accessToken
    );
    if (result.status === 200) {
      if (uploadedImage || uploadedImages.length > 0) {
        UploadImages(updateData?.id || "");
      } else {
        setIsLoading(false);
        setUpdateData(null);
        const { data: productsData } = await productServices.getAllProducts();
        setProductsData(productsData.data);
        setToaster?.({
          variant: "success",
          message: "Produk berhasil diperbarui",
        });
      }
    } else {
      setIsLoading(false);
      setToaster?.({
        variant: "error",
        message: "Gagal menambahkan produk",
      });
    }
  };

  const handleDeleteImage = async (fullPath?: string, name?: string) => {
    if (!fullPath) {
      setToaster?.({ variant: "error", message: "Path gambar tidak tersedia" });
      return;
    }

    const confirmed =
      typeof window !== "undefined"
        ? window.confirm(`Hapus gambar ${name || "ini"} ?`)
        : true;
    if (!confirmed) return;

    setImagesLoading(true);
    deleteFile(fullPath, async (success: boolean) => {
      setImagesLoading(false);
      if (success) {
        setAllImages((prev) => prev.filter((img) => img.fullPath !== fullPath));
        setToaster?.({
          variant: "success",
          message: "Gambar berhasil dihapus",
        });
        try {
          const { data: productsData } = await productServices.getAllProducts();
          setProductsData(productsData.data);
        } catch (err) {
          console.error("Failed to refresh products after image delete", err);
        }
      } else {
        setToaster?.({ variant: "error", message: "Gagal menghapus gambar" });
      }
    });
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
                    <Button
                      type="button"
                      className={style.form__button__removeStock}
                      onClick={() => {
                        const newStock = stockCount.filter(
                          (_: any, index: number) => index !== i
                        );
                        setStockCount(newStock);
                      }}
                    >
                      <i className="bx bxs-trash" />
                    </Button>
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
                <p className={style.form__label}>Gambar Utama</p>
                <label htmlFor="image">
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
                </label>
                <Button
                  className={style.form__button__add}
                  type="button"
                  onClick={() => {
                    setUploadedImage(null);
                  }}
                >
                  Ganti Gambar
                </Button>
              </div>
              <InputFile
                className={style.form__inputFile}
                name="image"
                setUploadedImage={setUploadedImage || null}
                uploadedImage={uploadedImage || null}
              />
              <div className={style.form__uploadHelps}>
                <p className={style.form__label}>Unggah Gambar Konten</p>
                <MultiInputFile
                  className={style.form__multiInputFile}
                  name="images"
                  setUploadedImages={setUploadedImages}
                  uploadedImages={uploadedImages}
                >
                  <p>Klik untuk unggah gambar</p>
                  <p>Ukuran gambar harus 1:1</p>
                  <p>Ukuran unggah maksimal 1 MB per file</p>
                </MultiInputFile>
              </div>
            </div>
            {allImages.length > 0 && (
              <div className={style.form__gallery}>
                <p className={style.form__label}>
                  Gambar lainnya ({allImages.length - 1})
                </p>
                <div className={style.form__galleryGrid}>
                  {allImages.slice(1).map((img, index) => (
                    <div key={index} className={style.form__galleryItemWrapper}>
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
                      <Button
                        className={style.form__button__removeImage}
                        type="button"
                        onClick={() =>
                          handleDeleteImage(img.fullPath, img.name)
                        }
                      >
                        Hapus
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {imagesLoading && (
              <p className={style.form__loadingText}>Memuat gambar...</p>
            )}
          </div>
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
