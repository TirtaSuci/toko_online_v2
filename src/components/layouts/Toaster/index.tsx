import { title } from "process";
import style from "./Toaster.module.scss";
import { useEffect, useRef, useState } from "react";
import { on } from "events";

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
    barColor: "#4CAF50",
    icon: "bx-check-circle",
  },
  error: {
    title: "Error",
    message: "An error occurred",
    barColor: "#F44336",
    color: "#E57373",
    icon: "bx-x-circle",
  },
  info: {
    title: "Info",
    message: "Here is some information",
    barColor: "#2196F3",
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
      setLengthBar((prev) => prev - 0.07);
    }, 1);
  };

  useEffect(() => {
    startTimer();
  }, []);

  return (
    <div className={`${style.toaster} ${style[`toaster--${variant}`]}`}>
      <div className={style.toaster__main}>
        <div className={style.toaster__main__icon}>
          <i
            className={`bx ${toasterVariants[variant].icon}`}
            onClick={() => setToaster({})}
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
        <i className={`bx bx-x ${style.toaster__main__close}`}></i>
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
    </div>
  );
};
export default Toaster;
