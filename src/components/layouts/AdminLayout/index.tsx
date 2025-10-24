import SideBar from "@/components/fragment/SideBar";
import Style from "./AdminLayout.module.scss";

type Propstype = {
  children: React.ReactNode;
};

const AdminLayout = (props: Propstype) => {
  const { children } = props;
  return (
    <div className={Style.adminLayout}>
      <SideBar />
      {children}
    </div>
  );
};
export default AdminLayout;
