import style from "./Select.module.scss";

type Option = {
  label: string;
  value: string;
};
type Propstype = {
  label?: string;
  name: string;
  type?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  options?: Option[];
};

const Select = (props: Propstype) => {
  const { label, name, defaultValue, options, disabled } = props;
  return (
    <div className={style.form__item}>
      {label && <label htmlFor={name}>{label}</label>}
      <select
        name={name}
        id={name}
        defaultValue={defaultValue}
        disabled={disabled}
        className={style.form__select}
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
export default Select;
