import style from "@/components/layouts/UI/Input/Input.module.scss";

type Propstype = {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  deafultValue?: string;
  disabled?: boolean;
};

const Input = (props: Propstype) => {
  const {
    label,
    name,
    type = "text",
    placeholder,
    deafultValue,
    disabled,
  } = props;
  return (
    <div className={style.form__item}>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        className={style.form__input}
        name={name}
        id={name}
        type={type}
        placeholder={placeholder}
        defaultValue={deafultValue}
        disabled={disabled}
      />
    </div>
  );
};
export default Input;
