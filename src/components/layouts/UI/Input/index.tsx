import style from "@/components/layouts/UI/Input/Input.module.scss";

type Propstype = {
  label?: string;
  name: string;
  placeholder?: string;
};

const Input = (props: Propstype) => {
  const { label, name, placeholder } = props;
  return (
    <div className={style.form__item}>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        className={style.form__input}
        name={name}
        id={name}
        type={name}
        placeholder={placeholder}
      />
    </div>
  );
};
export default Input;
