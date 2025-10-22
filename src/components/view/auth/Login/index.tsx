import style from "./Login.module.scss";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import Input from "@/components/layouts/UI/Input";
import Button from "@/components/layouts/UI/Button";
import AuthLayout from "@/components/layouts/AuthLayout";

const LoginView = () => {
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState("");
  const { push, query } = useRouter();

  const callbackUrl =
    typeof query.callbackUrl === "string" ? query.callbackUrl : "/";

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
    <AuthLayout
      title="Login"
      link="/auth/register"
      linkText="Don't have an account? Sign Up "
      textLink="Here"
      error={error}
    >
      <form onSubmit={handleLogin}>
        <Input label="Email" name="email" />
        <Input label="Password" name="password" />
        <Button
          type="submit"
          variant="primary"
          className={style.login__form__button}
        >
          {isLoading ? "Loading..." : "Login"}
        </Button>
      </form>
      <hr className={style.login__form__divider} />
      <Button
        type="button"
        onClick={() => signIn("google", { callbackUrl, redirect: false })}
        variant="primary"
        className={style.login__form__google}
      >
        <i className="bxl  bx-google bx-md" />
        Google
      </Button>
    </AuthLayout>
  );
};

export default LoginView;
