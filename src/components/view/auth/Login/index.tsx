import Link from "next/link";
import style from "./Register.module.scss";
import { FormEvent } from "react";
import { useRouter } from "next/router";

const LoginView = () => {
  const { push } = useRouter();

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = {
      fullname: form.fullname.value,
      email: form.email.value,
      password: form.password.value,
    };

    const result = await fetch("/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (result.status === 200) {
      form.reset();
      push("/auth/login");
    } else {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className={style.login}>
      <div className={style.login__label}>Login View</div>
      <form onSubmit={handleRegister}>
        <div className={style.login__form}>
          <div className={style.login__form__item}>
            <label htmlFor="email">Email</label>
            <input
              className={style.login__form__input}
              name="email"
              id="email"
              type="email"
            />
          </div>
          <div className={style.login__form__item}>
            <label htmlFor="password">Password</label>
            <input
              className={style.login__form__input}
              name="password"
              id="password"
              type="password"
            />
          </div>
          <button type="submit" className={style.login__form__button}>
            Login
          </button>
        </div>
      </form>
      <p className={style.login__link}>
        Dont have an account ? <Link href="/auth/login">Register</Link>{" "}
      </p>
    </div>
  );
};

export default LoginView;
