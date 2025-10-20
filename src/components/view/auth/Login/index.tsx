import Link from "next/link";
import style from "./Login.module.scss";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";

const LoginView = () => {
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState("");
  const { push, query } = useRouter();

  const callbackUrl: any = query.callbackUrl || "/";

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsloading(true);
    setError("");
    const form = event.target as HTMLFormElement;
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: form.email.value,
        password: form.password.value,
        callbackUrl,
      });
      if (!res?.error) {
        setIsloading(false);
        form.reset();
        push(callbackUrl);
      } else {
        setIsloading(false);
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      setIsloading(false);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={style.login}>
      <div className={style.login__label}>Login View</div>
      {error && <p className={style.login__error}>{error}</p>}
      <form onSubmit={handleLogin}>
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
            {isLoading ? "Loading..." : "Login"}
          </button>
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl, redirect: false })}
            className={style.login__form__google}
          >
            <i className="bxl  bx-google bx-md" />
            Google
          </button>
        </div>
      </form>
      <p className={style.login__link}>
        Don{"`"}t have an account ? Sign Up{" "}
        <Link href="/auth/register">Here</Link>{" "}
      </p>
    </div>
  );
};

export default LoginView;
