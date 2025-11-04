import SideBar from "@/components/fragment/SideBar";
import Style from "./UserLayout.module.scss";
type Propstype = {
  children: React.ReactNode;
};

const listSideBar = [
  {
    title: "Dashboard",
    path: "/user",
    icon: "bx-dashboard",
  },
  {
    title: "Profile",
    path: "/user/profile",
    icon: "bx-user-id-card",
  },
  {
    title: "Pesanan",
    path: "/user/Order",
    icon: "bx-package",
  },
];

const UserLayout = (props: Propstype) => {
  const { children } = props;
  return (
    <div className={Style.userLayout}>
      <SideBar lists={listSideBar} />
      <div className={Style.userLayout__main}>{children}</div>
    </div>
  );
};
export default UserLayout;
