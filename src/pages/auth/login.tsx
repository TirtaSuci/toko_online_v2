import LoginView from "@/components/view/auth/Login";

const LoginPage = ({
  setToaster,
}: {
  setToaster?: (
    toaster: { variant: "success" | "error"; message?: string } | null
  ) => void;
}) => {
  return (
    <>
      <LoginView setToaster={setToaster} />
    </>
  );
};
export default LoginPage;
