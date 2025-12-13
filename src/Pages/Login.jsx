// import { useState, useEffect } from "react";
import FormLogin from "../components/fragments/formLogin";
import AuthLayouts from "../components/Layouts/authLayouts";
// import { useNavigate } from "react-router-dom";

const LoginPage = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       navigate("/notes");
//     } else {
//       setIsLoading(false);
//     }
//   }, [navigate]);

//   if (isLoading) {
//     return null;
//   }

  return (
    <AuthLayouts title="Login" type="login">
      <FormLogin />
    </AuthLayouts>
  );
};

export default LoginPage;
