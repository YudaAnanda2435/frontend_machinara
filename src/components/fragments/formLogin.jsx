import React, { useState, useEffect, useRef } from "react";
import Form from "../elements/input";
import Buttons from "../elements/button/index";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const LOGIN_URL = "https://backend-dev-service.up.railway.app/auth/login";
const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Gagal decode token:", e);
    return null;
  }
};

const FormLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  const phoneRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (phoneRef.current) {
      phoneRef.current.focus();
    }
  }, []);

  const handleCloseError = (isOpen) => {
    setIsErrorModalOpen(isOpen);
    if (!isOpen && formRef.current) {
      formRef.current.reset();
      if (phoneRef.current) phoneRef.current.focus();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const phoneInput = e.target.phoneNumber.value.trim();
    const payload = {
      phone: phoneInput,
      password: e.target.password.value,
    };

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login gagal.");
      }

      const token = data.token;
      if (!token) throw new Error("Token tidak diterima dari server.");

      localStorage.setItem("token", token);

      const userDataLengkap = data.user || data.data;

      const finalUserToSave = userDataLengkap || parseJwt(token);

      console.log("Menyimpan Data User Lengkap:", finalUserToSave);

      localStorage.setItem("user_data", JSON.stringify(finalUserToSave));
      const decodedToken = parseJwt(token); 
      const role =
        finalUserToSave?.role?.toLowerCase() || decodedToken?.role || "user";
      const phone = finalUserToSave?.phone || phoneInput;
      const info = `Role: ${role} | Bio: ${
        finalUserToSave?.biography || "Kosong"
      }`;
      setDebugInfo(info);
      setIsSuccessModalOpen(true);
      setTimeout(() => {
        if (role.includes("admin") || phone === "081234567890") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/dashboard";
        }
      }, 2000);
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage(error.message);
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div>
        <form ref={formRef} onSubmit={handleLogin}>
          <Form
            label="Nomor HP"
            type="tel"
            placeholder="Enter your number"
            name="phoneNumber"
            ref={phoneRef}
          />
          <Form
            label="Password"
            type="password"
            placeholder="******"
            name="password"
          />
          <Buttons
            type="submit"
            text={isLoading ? "Loading..." : "Login"}
            background="!bg-white"
            className={`buttonAnimate text-primary! w-full border-0! justify-center`}
            disabled={isLoading}
          />
        </form>
      </div>

      <Dialog open={isErrorModalOpen} onOpenChange={handleCloseError}>
        <DialogContent className="sm:max-w-md bg-white border-l-4 border-red-500">
          <DialogHeader className="flex flex-col items-center text-center gap-2">
            <div className="h-14 w-14 bg-red-100 rounded-full flex items-center justify-center mb-2">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-red-600 text-center">
              Login Failed
            </DialogTitle>
            <DialogDescription className="text-center text-gray-700">
              {errorMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <button
              type="button"
              className="w-full sm:w-auto px-8 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold"
              onClick={() => handleCloseError(false)}
            >
              Okay
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL SUKSES + DEBUG INFO */}
      <Dialog open={isSuccessModalOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md bg-white border-l-4 border-green-500">
          <DialogHeader className="flex flex-col items-center text-center gap-2">
            <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-green-600 text-center">
              Login Successful
            </DialogTitle>
            <DialogDescription className="text-center text-gray-700">
              <span className="block font-mono text-xs bg-gray-100 p-2 rounded mt-2 border break-all">
                {debugInfo}
              </span>
              <span className="block mt-2 font-bold text-blue-600">
                Redirecting...
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <Loader2 className="h-6 w-6 animate-spin text-green-600" />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FormLogin;
