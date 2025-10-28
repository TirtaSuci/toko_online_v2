import { Dispatch, useEffect, useRef } from "react";
import style from "./Modal.module.scss";

const Modal = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: any;
}) => {
  const ref: any = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={style.modal}>
      <div className={style.modal__main} ref={ref}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
