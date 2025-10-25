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
    title: "Users",
    path: "/admin/profile",
    icon: "bx-user",
  },
  {
    title: "Produk",
    path: "/admin/produk",
    icon: "bx-package",
  },
];

const AdminLayout = (props: Propstype) => {
  const { children } = props;
  return (
    <div className={Style.adminLayout}>
      <SideBar lists={listSideBar} />
      {children}
    </div>
  );
};
export default AdminLayout;
