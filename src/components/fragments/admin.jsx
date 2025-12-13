import React, { useState, useEffect } from "react";
import {
  Trash2,
  Edit2,
  Plus,
  Save,
  X,
  LogOut,
  Users,
  Loader2,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

// --- IMPORT KOMPONEN DIALOG (SHADCN) ---
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// --- KONFIGURASI API ---
const BASE_URL = "https://backend-dev-service.up.railway.app/auth";

const Admin = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // State Form
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    phone: "",
    password: "",
    biography: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // --- STATE UNTUK MODAL (ALERT & CONFIRM) ---
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success", 
  });

  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    idToDelete: null,
  });

  // --- HELPER ALERT ---
  const showAlert = (title, message, type = "success") => {
    setAlertState({ isOpen: true, title, message, type });
  };

  const closeAlert = () => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  };

  // --- HELPER AUTH ---
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

  // --- 1. GET USERS ---
  const fetchUsers = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: "GET",
        headers: headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
        throw new Error("Gagal mengambil data user");
      }

      const result = await response.json();
      setEmployees(result.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- 2. HANDLE INPUT ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- 3. SUBMIT (CREATE & UPDATE) ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      showAlert("Validasi Gagal", "Nama dan Nomor HP wajib diisi!", "error");
      return;
    }

    if (!isEditing && !formData.password) {
      showAlert(
        "Validasi Gagal",
        "Password wajib diisi untuk pengguna baru!",
        "error"
      );
      return;
    }

    const headers = getAuthHeaders();
    if (!headers) return;

    setIsLoading(true);
    try {
      if (isEditing) {
        const updatePayload = {
          name: formData.name,
          biography: formData.biography || "Pegawai",
          ...(formData.password && { password: formData.password }),
        };

        const response = await fetch(`${BASE_URL}/users/${formData.id}`, {
          method: "PUT",
          headers: headers,
          body: JSON.stringify(updatePayload),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Gagal mengupdate data");
        }

        showAlert("Berhasil", "Data pegawai berhasil diperbarui!", "success");
      } else {
        // --- POST (Create - Step 1) ---
        const createPayload = {
          name: formData.name,
          phone: formData.phone,
          password: formData.password,
        };

        const createResponse = await fetch(`${BASE_URL}/create-account`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(createPayload),
        });

        const createResult = await createResponse.json();

        if (!createResponse.ok) {
          throw new Error(createResult.message || "Gagal membuat akun");
        }

        // --- POST (Create - Step 2: Auto Update Bio) ---
        if (formData.biography) {
          const usersResponse = await fetch(`${BASE_URL}/users`, {
            headers: headers,
          });
          const usersResult = await usersResponse.json();
          const newUser = usersResult.data.find(
            (u) => u.phone === formData.phone
          );

          if (newUser) {
            const bioPayload = {
              name: formData.name,
              biography: formData.biography,
            };
            await fetch(`${BASE_URL}/users/${newUser.id}`, {
              method: "PUT",
              headers: headers,
              body: JSON.stringify(bioPayload),
            });
          }
        }

        showAlert("Berhasil", "Pegawai baru berhasil ditambahkan!", "success");
      }

      fetchUsers();
      resetForm();
    } catch (err) {
      console.error("Error submitting form:", err);
      showAlert("Gagal", err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 4. DELETE LOGIC ---
  const initiateDelete = (id) => {
    setDeleteConfirm({ isOpen: true, idToDelete: id });
  };

  // Tahap 2: Eksekusi Delete (Saat tombol 'Ya' ditekan)
  const proceedDelete = async () => {
    const id = deleteConfirm.idToDelete;
    setDeleteConfirm({ isOpen: false, idToDelete: null }); 

    const headers = getAuthHeaders();
    if (!headers) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: headers,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Gagal menghapus user");
      }

      showAlert("Berhasil", "Pegawai berhasil dihapus.", "success");
      fetchUsers();
    } catch (err) {
      console.error("Error deleting:", err);
      showAlert("Gagal", err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 5. EDIT PREPARATION ---
  const handleEdit = (employee) => {
    setFormData({
      id: employee.id,
      name: employee.name,
      phone: employee.phone,
      password: "",
      biography: employee.biography || "",
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({ id: null, name: "", phone: "", password: "", biography: "" });
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_data");
    window.location.href = "/login";
  };

  return (
    <div className="h-screen w-full bg-gray-50 p-6 font-sans flex flex-col overflow-hidden">
      <div className="max-w-[1440px] w-full mx-auto h-full flex flex-col">
        <div className="flex justify-between items-center mb-8 shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-gray-500">Kelola Daftar Pegawai Terdaftar</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition"
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 overflow-y-auto pr-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                {isEditing ? (
                  <Edit2 size={20} className="text-blue-600" />
                ) : (
                  <Plus size={20} className="text-green-600" />
                )}
                {isEditing ? "Edit Pegawai" : "Tambah Pegawai"}
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nama Lengkap"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor HP (ID Login)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="081234567890"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 ${
                      isEditing ? "bg-gray-100 text-gray-500" : ""
                    }`}
                    readOnly={isEditing}
                    disabled={isLoading} 
                  />
                  {isEditing && (
                    <p className="text-xs text-gray-400 mt-1">
                      *ID Login tidak dapat diubah
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Biografi / Jabatan
                  </label>
                  <textarea
                    name="biography"
                    value={formData.biography}
                    onChange={handleInputChange}
                    placeholder="Contoh: Staff Gudang / Administrator"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 resize-none h-24"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password {isEditing && "(Isi jika ingin mengubah)"}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="*******"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 flex justify-center items-center gap-2 py-2 px-4 rounded-lg text-white font-medium transition ${
                      isEditing
                        ? "bg-black hover:bg-gray-800"
                        : "bg-primary hover:bg-primary/90"
                    } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Proses...
                      </>
                    ) : (
                      <>
                        <Save size={18} /> {isEditing ? "Update" : "Simpan"}
                      </>
                    )}
                  </button>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={isLoading}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-600"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* --- KOLOM KANAN: LIST PEGAWAI --- */}
          <div className="md:col-span-2 h-full flex flex-col min-h-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0 bg-white z-10">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Users size={20} />
                  Daftar Pegawai ({employees.length})
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto">
                {isLoading && employees.length === 0 ? (
                  <div className="p-10 flex justify-center items-center text-gray-400">
                    <Loader2 className="animate-spin mr-2" /> Memuat data...
                  </div>
                ) : employees.length === 0 ? (
                  <div className="p-10 text-center text-gray-400">
                    Belum ada data pegawai. Silakan tambah data baru.
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th className="p-4 font-semibold">Nama</th>
                        <th className="p-4 font-semibold">No. HP</th>
                        <th className="p-4 font-semibold">Biografi</th>
                        <th className="p-4 font-semibold">Role</th>
                        <th className="p-4 font-semibold text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {employees.map((emp) => (
                        <tr
                          key={emp.id}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="p-4 font-medium text-gray-900">
                            {emp.name}
                          </td>
                          <td className="p-4 text-gray-600 font-mono">
                            {emp.phone}
                          </td>
                          <td className="p-4 text-gray-500 max-w-[150px] truncate">
                            {emp.biography || "-"}
                          </td>
                          <td className="p-4 text-gray-500">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                emp.role === "admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {emp.role || "user"}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleEdit(emp)}
                              className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-md transition"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            {emp.role !== "admin" && (
                              <button
                                onClick={() => initiateDelete(emp.id)} 
                                className="inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-md transition"
                                title="Hapus"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL ALERT (Success / Error) --- */}
      <Dialog open={alertState.isOpen} onOpenChange={closeAlert}>
        <DialogContent
          className={`sm:max-w-md bg-white border-l-4 ${
            alertState.type === "error" ? "border-red-500" : "border-green-500"
          }`}
        >
          <DialogHeader className="flex flex-col items-center text-center gap-2">
            <div
              className={`h-14 w-14 rounded-full flex items-center justify-center mb-2 ${
                alertState.type === "error" ? "bg-red-100" : "bg-green-100"
              }`}
            >
              {alertState.type === "error" ? (
                <AlertCircle className="h-8 w-8 text-red-600" />
              ) : (
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              )}
            </div>
            <DialogTitle
              className={`text-xl font-bold text-center ${
                alertState.type === "error" ? "text-red-600" : "text-green-600"
              }`}
            >
              {alertState.title}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-700 text-[16px] font-medium px-2">
              {alertState.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <button
              type="button"
              className={`w-full sm:w-auto px-8 py-2 text-white rounded-lg font-bold transition-colors ${
                alertState.type === "error"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              onClick={closeAlert}
            >
              Okay
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- MODAL KONFIRMASI DELETE --- */}
      <Dialog
        open={deleteConfirm.isOpen}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirm({ ...deleteConfirm, isOpen: false });
        }}
      >
        <DialogContent className="sm:max-w-md bg-white border-l-4 border-yellow-500">
          <DialogHeader className="flex flex-col items-center text-center gap-2">
            <div className="h-14 w-14 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-yellow-700 text-center">
              Konfirmasi Hapus
            </DialogTitle>
            <DialogDescription className="text-center text-gray-700 text-[16px] font-medium px-2">
              Apakah Anda yakin ingin menghapus data pegawai ini secara
              permanen?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4 gap-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
              onClick={() =>
                setDeleteConfirm({ isOpen: false, idToDelete: null })
              }
            >
              Batal
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
              onClick={proceedDelete}
            >
              Ya, Hapus
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
