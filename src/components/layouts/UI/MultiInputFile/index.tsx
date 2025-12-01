import { Dispatch, SetStateAction } from "react";
import style from "./MultiInputFile.module.scss";
import Image from "next/image";

type PropsType = {
  uploadedImages: File[];
  name?: string;
  setUploadedImages: Dispatch<SetStateAction<File[]>>;
};

const MultiInputFile = (props: PropsType) => {
  const { setUploadedImages, uploadedImages, name } = props;

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
    <div className={style.multiInputFile}>
      <label className={style.multiInputFile__label} htmlFor={name}>
        <p>Upload Images</p>
        <p>
          Max Upload Size <b>1 MB</b> per file
        </p>
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

      {uploadedImages.length > 0 && (
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
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiInputFile;
