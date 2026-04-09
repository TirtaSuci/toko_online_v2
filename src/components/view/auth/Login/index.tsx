import style from "./Login.module.scss";
import { FormEvent, useContext, useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import Input from "@/components/layouts/UI/Input";
import Button from "@/components/layouts/UI/Button";
import AuthLayout from "@/components/layouts/AuthLayout";
import { ToasterContext } from "@/context/ToasterContexts";
import { isAllowedEmailProvider } from "@/utils/emailValidator";

const LoginView = ({ }) => {
  const { setToaster } = useContext(ToasterContext);
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
    const emailValue = form.email.value;
    if (!isAllowedEmailProvider(emailValue)) {
      setIsloading(false);
      setToaster?.({
        variant: "error",
        message:
          "Email provider tidak diizinkan. Gunakan Gmail, Yahoo, Outlook, iCloud, atau Proton.",
      });
      return;
    }
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: emailValue,
        password: form.password.value,
        callbackUrl,
      });
      if (!res?.error) {
        setIsloading(false);
        form.reset();
        setToaster?.({
          variant: "success",
          message: "Login successful",
        });
        push(callbackUrl);
      } else {
        setIsloading(false);
        // Tampilkan pesan asli dari authorize() jika ada (mis. domain ditolak)
        const message = res.error.includes("Email provider")
          ? res.error
          : "Invalid email or password";
        setToaster?.({
          variant: "error",
          message,
        });
      }
    } catch (err) {
      console.error(err);
      setIsloading(false);
      setToaster?.({
        variant: "error",
        message: "Something went wrong. Please try again.",
      });
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
        <Input label="Email" name="email" type="email" />
        <Input label="Password" name="password" type="password" />
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
        <i className="bx bxl-google" />
        Google
      </Button>
    </AuthLayout>
  );
};

export default LoginView;
