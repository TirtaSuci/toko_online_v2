import RegisterView from "@/components/view/auth/Register";

const RegisterPage = ({
  setToaster,
}: {
  setToaster?: (
    toaster: { variant: "success" | "error"; message?: string } | null
  ) => void;
}) => {
  return (
    <>
      <RegisterView setToaster={setToaster}></RegisterView>;
    </>
  );
};
export default RegisterPage;
