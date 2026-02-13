import { signOut, useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import style from "./Navbar.module.scss";
import Button from "@/components/layouts/UI/Button";

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const role = session?.user?.role || "guest";

  console.log("User role:", session);
  return (
    <div className={style.Navbar}>
      <div className={style.Navbar__container}>
        {role === "admin" && (
          <Button variant="secondary" onClick={() => router.push("/admin")}>
            Hi, {session?.user?.name} (Admin Dashboard)
          </Button>
        )}
        {role === "user" && (
          <Button variant="secondary" onClick={() => router.push("/user")}>
            Hi, {session?.user?.name} (User Dashboard)
          </Button>
        )}
        <Button variant="secondary" onClick={() => (session ? signOut() : signIn())}>{session ? "Logout" : "Login"}</Button>
      </div>
    </div>
  );
};

export default Navbar;