import { useState, useRef, useEffect } from "react";
import Form from "../elements/input";
import Buttons from "../elements/button/index";
import { register } from "../Services/auth.services";

const FormRegister = () => {
  const [registerFailed, setRegisterFailed] = useState("");

  const emailRef = useRef(null);
  useEffect(() => {
    emailRef.current.focus();
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    setRegisterFailed("");

    if (e.target.password.value !== e.target.confirmPassword.value) {
      setRegisterFailed("Password dan Konfirmasi Password tidak cocok!");
      return;
    }

    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    register(data, (status, response) => {
      if (status) {
        alert("Registrasi berhasil! Anda akan diarahkan ke halaman login.");
        window.location.href = "/login";
      } else {
        setRegisterFailed(
          response.message || "Registrasi gagal. Silakan coba lagi."
        );
      }
    });
  };

  return (
    <form onSubmit={handleRegister}>
      <Form
        label={`Email`}
        type={`email`}
        placeholder={`example@mail.com`}
        name={`email`}
        ref={emailRef}
      />

      <Form
        label={`Full Name`}
        type={`text`}
        placeholder={`John Doe`}
        name={`name`}
      />

      <Form
        label={`Password`}
        type={`password`}
        placeholder={`******`}
        name={`password`}
      />
      <Form
        label={`Confirm Password`}
        type={`password`}
        placeholder={`******`}
        name={`confirmPassword`}
      />

      <div className="mt-6">
        <Buttons
          type="submit"
          text="Register"
          background="bg-white!"
          className={`buttonAnimate w-full justify-center border-0! text-primary! `}
        />
      </div>
      {registerFailed && (
        <p className="text-red-500 text-center mt-4">{registerFailed}</p>
      )}
    </form>
  );
};

export default FormRegister;
