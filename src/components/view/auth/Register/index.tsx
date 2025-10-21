import Link from "next/link";
import style from "./Register.module.scss";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import Input from "@/components/layouts/UI/Input";
import Button from "@/components/layouts/UI/Button";

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
      confirmPassword: form.confirmPassword.value,
    };

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

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
      setError("Email already exists.");
      setIsLoading(false);
    }
  };

  return (
    <div className={style.register}>
      <div className={style.register__label}>Register View</div>
      {error && <p className={style.register__error}>{error}</p>}
      <form onSubmit={handleRegister}>
        <div className={style.register__form}>
          <Input label="Fullname" name="fullname"></Input>
          <Input label="Email" name="email"></Input>
          <Input label="Password" name="password" type="password"></Input>
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
          ></Input>
          <Button type="submit" className={style.register__button}>
            {isLoading ? "Loading..." : "Register"}
          </Button>
        </div>
      </form>
      <p className={style.register__link}>
        Do you already have an account ? <Link href="/auth/login">Login</Link>{" "}
      </p>
    </div>
  );
};

export default RegisterView;
