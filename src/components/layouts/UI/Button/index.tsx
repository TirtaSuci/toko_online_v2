import style from "./Button.module.scss";

type PropsType = {
  type?: "button" | "submit" | "reset" | undefined;
  variant?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

const Button = (props: PropsType) => {
  const { type, onClick, children, className, variant = "primary" } = props;
  return (
    <button
      type={type || "button"}
      onClick={onClick}
      className={`${style.button} ${style[variant]} ${className}`}
      disabled={props.disabled}
    >
      {children}
    </button>
  );
};
export default Button;
