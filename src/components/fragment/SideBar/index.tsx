import { useRouter } from "next/router";
import style from "./SideBar.module.scss";
import Link from "next/link";
import Button from "@/components/layouts/UI/Button";
import { signOut, useSession } from "next-auth/react";

type Propstype = {
  lists: Array<{
    title: string;
    path: string;
    icon: string;
  }>;
};

const SideBar = (props: Propstype) => {
  const { lists } = props;
  const { pathname } = useRouter();
  const session = useSession();
  return (
    <div className={style.sideBar}>
      <div className={style.sideBar__top}>
        <div>
          <h1 className={style.sideBar__top__title}>{session?.data?.user?.role === "admin" ? "Admin Dashboard" : "User Dashboard"}</h1>
        </div>
        <div className={style.sideBar__top__lists}>
          {lists.map((list) => (
            <Link
              href={list.path}
              key={list.title}
              className={`${style.sideBar__top__lists__item} ${pathname === list.path &&
                style.sideBar__top__lists__item__active
                }`}
            >
              <i className={`bx ${list.icon}`} />
              <h4 className={style.sideBar__top__lists__item__title}>
                {list.title}
              </h4>
            </Link>
          ))}
        </div>
      </div>
      <div className={style.sideBar__bottom}>
        <Link href="/">
          <Button
            type="button"
            variant="secondary"
            className={style.sideBar__bottom__button}
          >
            <i className="bx bx-log-out" />
            Home
          </Button>
        </Link>
        <Button
          type="button"
          variant="secondary"
          onClick={() => signOut()}
          className={style.sideBar__bottom__button}
        >
          <i className="bx bx-log-out" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default SideBar;
