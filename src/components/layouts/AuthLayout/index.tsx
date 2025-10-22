import Link from "next/link";
import style from "./AuthLayout.module.scss";

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  link: string;
  linkText?: string;
  error?: string;
  textLink?: string;
};

const AuthLayout = (props: AuthLayoutProps) => {
  const { children, title, link, linkText, textLink, error } = props;
  return (
    <div className={style.authLayout}>
      <div className={style.authLayout__label}>{title}</div>
      {error && <p className={style.authLayout__error}>{error}</p>}
      <div className={style.authLayout__form}>{children}</div>
      <p className={style.authLayout__link}>
        {linkText}
        <Link href={link}>{textLink}</Link>{" "}
      </p>
    </div>
  );
};

export default AuthLayout;
