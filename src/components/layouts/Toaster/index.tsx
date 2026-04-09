import { motion } from "motion/react";
import style from "./Toaster.module.scss";
import { useContext, useEffect, useState } from "react";
import { ToasterContext } from "@/context/ToasterContexts";
import { ToasterType } from "@/types/toaster.type";

const toasterVariants = {
  success: {
    title: "Success",
    defaultMessage: "Success",
    bgColor: "#e8f5e9",
    barColor: "#43a047",
    icon: "bx-check-circle",
  },
  error: {
    title: "Error",
    defaultMessage: "An error occurred",
    bgColor: "#ffebee",
    barColor: "#e53935",
    icon: "bx-x-circle",
  },
  info: {
    title: "Info",
    defaultMessage: "Info",
    bgColor: "#e3f2fd",
    barColor: "#1e88e5",
    icon: "bx-info-circle",
  },
} as const;

const Toaster = () => {
  const { toaster, setToaster }: ToasterType = useContext(ToasterContext);
  const [progress, setProgress] = useState(100);
  const duration = 4000
  useEffect(() => {
    const start = setTimeout(() => setProgress(0), 20);
    const hide = setTimeout(() => setToaster?.({}), duration + 50);
    return () => {
      clearTimeout(start);
      clearTimeout(hide);
    };
  }, [duration, setToaster]);

  useEffect(() => {
    if (progress < 0) {
      setToaster?.({});
    }
  }, [progress, setToaster]);

  if (!toaster?.variant) return null;

  const v = toasterVariants[toaster?.variant ?? "success"];

  return (
    <motion.div
      className={`${style.toaster} ${style[`toaster--${toaster.variant}`]}`}
    >
      <div className={style.toaster__main} style={{ backgroundColor: v.bgColor }}>
        <div className={style.toaster__main__icon}>
          <i className={`bx ${v.icon}`} aria-hidden />
        </div>
        <div className={style.toaster__main__text}>
          <p className={style.toaster__main__text__title}>{v.title}</p>
          <p className={style.toaster__main__text__description}>{toaster.message ?? v.defaultMessage}</p>
        </div>
        <button className={style.toaster__main__close} aria-label="Close" onClick={() => setToaster?.({})}>
          <i className="bx bx-x" />
        </button>
        <div className={style.toaster__main__action}>
          <div
            className={style.toaster__main__action__bar}
            style={{ width: `${progress}%`, backgroundColor: v.barColor, transition: `width ${duration / 1000}s linear` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Toaster;
