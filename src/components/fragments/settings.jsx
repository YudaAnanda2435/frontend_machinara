import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  HelpCircle,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const API_AUTH_URL = "https://backend-dev-service.up.railway.app/auth";

const SettingRow = ({ label, children, subLabelIcon }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 py-6 border-b border-gray-100 last:border-0">
      <div className="md:col-span-3 flex items-center gap-2">
        <label className="text-[16px] font-bold text-gray-800">{label}</label>
        {subLabelIcon && (
          <span className="text-gray-400 cursor-help">{subLabelIcon}</span>
        )}
      </div>
      <div className="md:col-span-9">{children}</div>
    </div>
  );
};

const DashboardSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef(null);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    biography: "",
    password: "",
  });

  const showModal = (type, title, message) => {
    setModalConfig({ isOpen: true, type, title, message });
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
    if (modalConfig.type === "success") {
      window.location.reload();
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return null;
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    try {
      const storedUserData = localStorage.getItem("user_data");
      const token = localStorage.getItem("token");

      if (!storedUserData || !token) {
        window.location.href = "/login";
        return;
      }

      const localUserObj = JSON.parse(storedUserData);
      console.log("Loaded Profile Data:", localUserObj);

      setFormData({
        name: localUserObj.name || "",
        phone: localUserObj.phone || "",
        biography: localUserObj.biography || "",
        password: "",
      });
    } catch (error) {
      console.error("Error reading local storage:", error);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    // --- VALIDASI PASSWORD ---
    // Jika password diisi, cek panjangnya minimal 4 karakter
    if (formData.password && formData.password.length < 4) {
      showModal(
        "error",
        "Validation Failed",
        "Password must be at least 4 characters long."
      );
      return; 
    }

    setIsLoading(true);

    try {
      const updatePayload = {
        name: formData.name,
        biography: formData.biography,
      };

      if (formData.password && formData.password.trim() !== "") {
        updatePayload.password = formData.password;
      }

      const response = await fetch(`${API_AUTH_URL}/profile`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData.message || `Gagal update (Status: ${response.status})`
        );
      }

      const result = await response.json();
      const updatedUserObj = result.user || result.data || result;

      const oldStorage = JSON.parse(localStorage.getItem("user_data") || "{}");
      const newStorageData = { ...oldStorage, ...updatedUserObj };
      localStorage.setItem("user_data", JSON.stringify(newStorageData));

      setFormData((prev) => ({
        ...prev,
        name: updatedUserObj.name,
        phone: updatedUserObj.phone,
        biography: updatedUserObj.biography,
        password: "",
      }));

      showModal("success", "Profile Updated", "Profil berhasil diperbarui.");
    } catch (error) {
      console.error("Error saving profile:", error);
      showModal("error", "Update Failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="w-full px-7 mx-auto pb-10 sm:pb-20">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
          <p className="text-gray-500 mt-1">Update your personal information</p>
        </div>

        <div className="flex flex-col">
          <SettingRow label="Full Name">
            <div className="flex h-12 w-full rounded-md border border-gray-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-primary/20">
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="flex-1 px-4 text-[14px] sm:text-[16px] text-gray-700 outline-none bg-transparent"
                placeholder="Your Name"
              />
            </div>
          </SettingRow>

          <SettingRow label="Phone Number">
            <div className="flex h-12 w-full rounded-md border border-gray-200 bg-gray-50 overflow-hidden">
              <input
                name="phone"
                value={formData.phone}
                readOnly
                className="flex-1 px-4 text-[14px] sm:text-[16px] text-gray-500 outline-none bg-transparent cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Contact Admin to change your login Phone Number.
            </p>
          </SettingRow>

          <SettingRow
            label="Biography"
            subLabelIcon={<HelpCircle className="h-4 w-4" />}
          >
            <div className="relative">
              <Textarea
                name="biography"
                value={formData.biography}
                onChange={handleInputChange}
                className="min-h-40 bg-white resize-none text-gray-600 text-[14px] sm:text-[16px] leading-relaxed p-4 rounded-xl focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-none"
                maxLength={325}
                placeholder="Tell us about yourself..."
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {325 - (formData.biography?.length || 0)} chars left
                </span>
              </div>
            </div>
          </SettingRow>

          <SettingRow label="Change Password">
            <div className="relative flex h-12 w-full rounded-md border border-gray-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-primary/20">
              <input
                ref={passwordInputRef}
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Leave empty to keep current password"
                className="flex-1 px-4 text-[14px] sm:text-[16px] text-gray-700 outline-none bg-transparent pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 h-full px-4 text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </SettingRow>
        </div>

        <div className="flex justify-end gap-4 mt-4 sm:mt-10 pt-6 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="h-11 px-8 rounded-full border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-semibold"
          >
            Cancel
            <XIcon className="ml-2 w-4 h-4" />
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="h-11 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-md shadow-indigo-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Save Changes
                <CheckIcon className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      <Dialog open={modalConfig.isOpen} onOpenChange={closeModal}>
        <DialogContent
          className={`sm:max-w-md bg-white border-l-4 ${
            modalConfig.type === "success"
              ? "border-green-500"
              : "border-red-500"
          }`}
        >
          <DialogHeader>
            <DialogTitle
              className={`text-xl font-bold text-center flex flex-col items-center gap-2 ${
                modalConfig.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <div
                className={`h-14 w-14 rounded-full flex items-center justify-center mb-2 ${
                  modalConfig.type === "success" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {modalConfig.type === "success" ? (
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                ) : (
                  <AlertCircle className="h-8 w-8 text-red-600" />
                )}
              </div>
              {modalConfig.title}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-700 text-[16px]">
              {modalConfig.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <Button
              variant={
                modalConfig.type === "success" ? "default" : "destructive"
              }
              className={
                modalConfig.type === "success"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : ""
              }
              onClick={closeModal}
            >
              Okay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const XIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export default DashboardSettings;
