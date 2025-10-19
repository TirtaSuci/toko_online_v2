import Link from "next/link";
import style from "./Register.module.scss";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";

const RegisterView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { push } = useRouter();

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
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
      setIsLoading(false);
      alert("Registration successful. Please login.");
      push("/auth/login");
    } else {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className={style.register}>
      <div className={style.register__label}>Register View</div>
      {error && <p className={style.register__error}>{error}</p>}
      <form onSubmit={handleRegister}>
        <div className={style.register__form}>
          <div className={style.register__form__item}>
            <label htmlFor="fullname">Full Name</label>
            <input
              className={style.register__form__input}
              name="fullname"
              id="fullname"
              type="text"
            />
          </div>
          <div className={style.register__form__item}>
            <label htmlFor="email">Email</label>
            <input
              className={style.register__form__input}
              name="email"
              id="email"
              type="email"
            />
          </div>
          <div className={style.register__form__item}>
            <label htmlFor="password">Password</label>
            <input
              className={style.register__form__input}
              name="password"
              id="password"
              type="password"
            />
          </div>
          <button type="submit" className={style.register__form__button}>
            {isLoading ? "Loading..." : "Register"}
          </button>
        </div>
      </form>
      <p className={style.register__link}>
        Do you already have an account ? <Link href="/auth/login">Login</Link>{" "}
      </p>
    </div>
  );
};

export default RegisterView;
