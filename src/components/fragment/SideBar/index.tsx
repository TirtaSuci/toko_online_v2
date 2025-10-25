import { useRouter } from "next/router";
import style from "./SideBar.module.scss";
import Link from "next/link";

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
  return (
    <div className={style.sideBar}>
      <div className={style.sideBar__content}>
        <h1 className={style.sideBar__top__title}>Admin Panel</h1>
        <div className={style.sideBar__top__lists}>
          {lists.map((list) => (
            <Link
              href={list.path}
              key={list.title}
              className={`${style.sideBar__top__lists__item} ${
                pathname === list.path &&
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
    </div>
  );
};

export default SideBar;
