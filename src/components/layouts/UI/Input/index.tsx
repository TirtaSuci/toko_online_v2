import style from "@/components/layouts/UI/Input/Input.module.scss";

type Propstype = {
  label?: string;
  name?: string;
  id?: string;
  type?: string;
  placeholder?: string;
  deafultValue?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
};

const Input = (props: Propstype) => {
  const {
    label,
    name,
    id = name,
    type = "text",
    placeholder,
    deafultValue,
    disabled,
    onChange,
    value,
  } = props;
  return (
    <div className={style.form__item}>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        className={style.form__input}
        name={name}
        id={id}
        type={type}
        placeholder={placeholder}
        defaultValue={deafultValue}
        disabled={disabled}
        onChange={onChange}
        value={value}
      />
    </div>
  );
};
export default Input;
