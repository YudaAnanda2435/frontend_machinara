import FormLogin from "../components/fragments/formLogin";
import AuthLayouts from "../components/Layouts/authLayouts";


const LoginPage = () => {
  return (
    <AuthLayouts title="Login" type="login">
      <FormLogin />
    </AuthLayouts>
  );
};

export default LoginPage;
