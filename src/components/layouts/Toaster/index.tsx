import { motion } from "motion/react";
import style from "./Toaster.module.scss";
import { useEffect, useRef, useState } from "react";

type PropsType = {
  variant?: "success" | "error" | "info";
  message?: string;
  setToaster?: any;
};

const toasterVariants: any = {
  success: {
    title: "Success",
    message: "Success Update Profile",
    color: "#81C784",
    barColor: "#16921aff",
    icon: "bx-check-circle",
  },
  error: {
    title: "Error",
    message: "An error occurred",
    barColor: "#ff1100ff",
    color: "#ffbfbfff",
    icon: "bx-x-circle",
  },
  info: {
    title: "Info",
    message: "Here is some information",
    barColor: "#1884ddff",
    color: "#64B5F6",
    icon: "bx-info-circle",
  },
};

const Toaster = (props: PropsType) => {
  const { variant = "success", message, setToaster } = props;
  const [lengthBar, setLengthBar] = useState(100);
  const timerRef = useRef<any>(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setLengthBar((prev) => prev - 0.092);
    }, 1);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (lengthBar <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      setLengthBar(0);
      setToaster?.({});
    }
  }, [lengthBar, setToaster]);

  return (
    <motion.div
      className={`${style.toaster} ${style[`toaster--${variant}`]}`}
      initial={{ opacity: 0, x: 0, y: -20, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 0, y: -20, scale: 0.98 }}
      transition={{ duration: 0.25 }}
    >
      <div className={style.toaster__main}>
        <div className={style.toaster__main__icon}>
          <i
            className={`bx ${toasterVariants[variant].icon}`}
            onClick={() => setToaster?.({})}
          ></i>
        </div>
        <div className={style.toaster__main__text}>
          <p className={style.toaster__main__text__title}>
            {toasterVariants[variant].title}
          </p>
          <p className={style.toaster__main__text__description}>
            {message || toasterVariants[variant].message}
          </p>
        </div>
        <i
          className={`bx bx-x ${style.toaster__main__close}`}
          onClick={() => setToaster?.({})}
        ></i>
        <div
          className={`${style.toaster__main__action}`}
          style={{ backgroundColor: toasterVariants[variant].color }}
        >
          <div
            style={{
              height: "100%",
              width: `${lengthBar}%`,
              backgroundColor: toasterVariants[variant].barColor,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};
export default Toaster;
