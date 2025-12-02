import { Dispatch, SetStateAction } from "react";
import style from "./MultiInputFile.module.scss";
import Image from "next/image";
import { p } from "motion/react-client";
import Button from "../Button";

type PropsType = {
  className?: string;
  children?: React.ReactNode;
  uploadedImages: File[];
  name?: string;
  setUploadedImages: Dispatch<SetStateAction<File[]>>;
};

const MultiInputFile = (props: PropsType) => {
  const { className, setUploadedImages, uploadedImages, name, children } =
    props;
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.currentTarget.files) {
      const newFiles = Array.from(e.currentTarget.files);
      setUploadedImages([...uploadedImages, ...newFiles]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  return (
    <div className={`${style.multiInputFile} ${className}`}>
      {uploadedImages.length === 0 && (
        <>
          <label className={style.multiInputFile__label} htmlFor={name}>
            {children || (
              <>
                <p> Upload Image</p>
                <p>
                  Max Upload Size <b>1 MB</b> per file
                </p>
              </>
            )}
          </label>
          <input
            className={style.multiInputFile__input}
            type="file"
            id={name}
            name={name}
            multiple
            onChange={handleFileChange}
            accept="image/*"
          />
        </>
      )}
      {uploadedImages.length > 0 && (
        <>
          <div className={style.multiInputFile__preview}>
            <p>Selected Images ({uploadedImages.length}):</p>
            <ul className={style.multiInputFile__list}>
              {uploadedImages.map((file, index) => (
                <li key={index} className={style.multiInputFile__item}>
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Image${index + 1}`}
                    width={100}
                    height={100}
                  />
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className={style.multiInputFile__removeBtn}
                  >
                    Hapus
                  </button>
                </li>
              ))}
              <li className={style.multiInputFile__item}>
                <label className={style.multiInputFile__label} htmlFor={name}>
                  <i className="bx  bx-image-plus"></i>
                </label>
                <input
                  className={style.multiInputFile__input}
                  type="file"
                  id={name}
                  name={name}
                  multiple
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </li>
            </ul>
          </div>
          {uploadedImages.length > 5 && (
            <Button
              className={style.multiInputFile__removeAllBtn}
              onClick={() => setUploadedImages([])}
            >
              Hapus Semua
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default MultiInputFile;
