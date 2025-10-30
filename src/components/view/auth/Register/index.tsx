import style from "./Register.module.scss";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import Input from "@/components/layouts/UI/Input";
import Button from "@/components/layouts/UI/Button";
import { authService } from "@/Services/auth";
import AuthLayout from "@/components/layouts/AuthLayout";

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

    delete data.confirmPassword;

    const result = await authService.registerAccount(data);

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
    <AuthLayout
      title="Register Account"
      link="/auth/login"
      linkText="Already have an account? "
      textLink="Login"
      error={error}
    >
      <form onSubmit={handleRegister}>
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
      </form>
    </AuthLayout>
  );
};

export default RegisterView;
