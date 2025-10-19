import { signOut, useSession, signIn } from "next-auth/react";
import style from "./Navbar.module.scss";

const Navbar = () => {
  const { data } = useSession();
  return (
    <div className={style.Navbar}>
      <button
        className={style.Navbar__button}
        onClick={() => (data ? signOut() : signIn())}
      >
        {data ? "Logout" : `Login`}
      </button>
    </div>
  );
};

export default Navbar;
