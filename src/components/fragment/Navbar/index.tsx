import { signOut, useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import style from "./Navbar.module.scss";
import Button from "@/components/layouts/UI/Button";

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const role = session?.user?.role || "guest";
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const dashboardPath = role === "admin" ? "/admin" : role === "member" ? "/user" : null;
  const userName = session?.user?.name || "Guest";
  const userImage = (session?.user as { image?: string } | undefined)?.image;
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className={style.Navbar}>
      <div className={style.Navbar__container}>
        <div className={style.Navbar__left}>
          <Button variant="secondary" onClick={() => router.push("/")}>
            <i className="bx bx-home" />
          </Button>
        </div>
        <div className={style.Navbar__right}>
          <Button variant="secondary" onClick={() => router.push("/cart")}>
            <i className="bx bx-shopping-bag" />
          </Button>

          <div className={style.Navbar__menu} ref={menuRef}>
            <button
              type="button"
              className={style.Navbar__menu__trigger}
              onClick={() => setOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={open}
            >
              <span className={style.Navbar__menu__avatar}>
                {userImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={userImage} alt={userName} />
                ) : (
                  <i className="bx bx-user" />
                )}
              </span>
              <span className={style.Navbar__menu__name}>{userName}</span>
              <i className={`bx bx-chevron-down ${open ? style.Navbar__menu__caretOpen : ""}`} />
            </button>

            {open && (
              <div className={style.Navbar__menu__dropdown} role="menu">
                {dashboardPath && (
                  <button
                    type="button"
                    className={style.Navbar__menu__dropdown__item}
                    onClick={() => {
                      setOpen(false);
                      router.push(dashboardPath);
                    }}
                  >
                    <i className="bx bx-grid-alt" />
                    {role === "admin" ? "Admin Dashboard" : "User Dashboard"}
                  </button>
                )}
                <button
                  type="button"
                  className={style.Navbar__menu__dropdown__item}
                  onClick={() => {
                    setOpen(false);
                    if (session) signOut(); else signIn();
                  }}
                >
                  <i className={`bx ${session ? "bx-log-out" : "bx-log-in"}`} />
                  {session ? "Logout" : "Login"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
