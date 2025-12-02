import { Dispatch, SetStateAction } from "react";
import style from "./InputFile.module.scss";

type PropsType = {
  className?: string;
  uploadedImage: File | null;
  name?: string;
  children?: React.ReactNode;
  setUploadedImage: Dispatch<SetStateAction<File | null>>;
};

const InputFile = (props: PropsType) => {
  const { setUploadedImage, uploadedImage, name, className, children } = props;
  return (
    <div className={`${style.inputFile} ${className ?? ""}`}>
      <label className={style.inputFile__label} htmlFor={name}>
        {children ? (
          children
        ) : (
          <>
            <p>Upload Image</p>
            <p>
              Max Upload Size <b>1 MB</b>
            </p>
          </>
        )}
      </label>
      <input
        className={style.inputFile__input}
        type="file"
        id={name}
        name={name}
        onChange={(e: any) => {
          e.preventDefault();
          setUploadedImage(e.currentTarget.files[0]);
        }}
      />
    </div>
  );
};

export default InputFile;
