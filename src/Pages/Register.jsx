import FormRegister from "../components/fragments/formRegister";
import AuthLayouts from "../components/Layouts/authLayouts";
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
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
    <AuthLayouts title={`Register`} type={`register`}>
      <FormRegister />
    </AuthLayouts>
  );
};

export default RegisterPage;
