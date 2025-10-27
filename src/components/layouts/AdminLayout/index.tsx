import SideBar from "@/components/fragment/SideBar";
import Style from "./AdminLayout.module.scss";
type Propstype = {
  children: React.ReactNode;
};

const listSideBar = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: "bx-dashboard",
  },
  {
    title: "Profile",
    path: "/admin/profile",
    icon: "bx-user-id-card",
  },
  {
    title: "Produk",
    path: "/admin/produk",
    icon: "bx-package",
  },
  {
    title: "Users Management",
    path: "/admin/userManagement",
    icon: "bx-user",
  },
];

const AdminLayout = (props: Propstype) => {
  const { children } = props;
  return (
    <div className={Style.adminLayout}>
      <SideBar lists={listSideBar} />
      <div className={Style.adminLayout__main}>{children}</div>
    </div>
  );
};
export default AdminLayout;
