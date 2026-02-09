import { signOut, useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import style from "./Navbar.module.scss";
import Button from "@/components/layouts/UI/Button";

const Navbar = () => {
  const { data: user } = useSession();
  const session = useSession();
  const router = useRouter();
  const role = user?.user?.role;

  return (
    <div className={style.Navbar}>
      <div className={style.Navbar__container}>
        {role === "admin" && (
          <Button variant="secondary" onClick={() => router.push("/admin")}>
            Admin Dashboard
          </Button>
        )}
        {role === "user" && (
          <Button variant="secondary" onClick={() => router.push("/user")}>
            User Dashboard
          </Button>
        )}
        <Button variant="secondary" onClick={() => (session ? signOut() : signIn())}>{session.data ? "Logout" : `Login`}</Button>
      </div>
    </div>
  );
};

export default Navbar;