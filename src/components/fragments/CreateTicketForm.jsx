import React, { useState, useContext } from "react";

// Impor komponen Shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // Pastikan dialog sudah diinstal

// Impor Ikon (Sukses, Loading, Error)
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

// Impor komponen DatePicker
import { DatePicker } from "@/components/ui/DatePicker";

// Impor Context dan Content
import LocaleContext from "@/contexts/LocaleContext";
import content from "@/utils/content";

const CreateTicketForm = () => {
  // 1. Ambil locale dari Context
  const { locale } = useContext(LocaleContext);

  // --- STATE MANAGEMENT ---
  const [isLoading, setIsLoading] = useState(false);

  // State untuk Modal SUKSES
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // State untuk Modal ERROR (Custom Alert)
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // [BE INTEGRATION] State untuk menampung data form
  const [formData, setFormData] = useState({
    machineName: "",
    date: null,
    issue: "",
  });

  // Handler perubahan input text
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // --- FUNGSI HELPER: Tampilkan Error Modal ---
  const showError = (message) => {
    setErrorMessage(message);
    setIsErrorModalOpen(true);
  };

  // Handler perubahan tanggal
  const handleDateChange = (selectedDate) => {
    setFormData((prev) => ({ ...prev, date: selectedDate }));
  };

  // --- FUNGSI SUBMIT TIKET ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // [BE INTEGRATION] 1. Validasi Data
    console.log("Data to send:", formData);

    if (!formData.machineName || !formData.issue || !formData.date) {
      // Ambil pesan error dari content.js sesuai bahasa
      // Pastikan key 'alertFillFields' ada di content.js Anda
      const errorText = content.alertFillFields
        ? content.alertFillFields[locale]
        : content.alertSendError[locale];

      showError(errorText); // Munculkan modal error custom
      setIsLoading(false);
      return;
    }

    try {
      // -----------------------------------------------------------
      // [BE INTEGRATION] 2. PANGGIL API DI SINI
      // -----------------------------------------------------------
      /*
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Failed to create ticket');
      const result = await response.json();
      */

      const payload = {
        machine_name: formData.machineName,
        date: formData.date,
        issue: formData.issue,
      };
      console.log("Sending Payload:", payload);

      // 3. API Call
      const response = await fetch(
        "https://api-ticketing.up.railway.app/api/tickets",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed with status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Success:", result);

      setIsSuccessModalOpen(true);
      setFormData({ machineName: "", date: "", issue: "" });

      // Jika sukses:
      setIsSuccessModalOpen(true); // Buka Modal Sukses
    } catch (error) {
      console.error("Error creating ticket:", error);
      showError("Gagal terhubung ke server. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full rounded-2xl shadow-lg border-none bg-white">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Grup Machine Name & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="machineName"
                  className="text-md font-medium text-gray-700"
                >
                  {content.machineName[locale]}
                </Label>
                <Input
                  id="machineName"
                  placeholder="X-AE-A-19"
                  className="h-12 text-[16px] bg-white border-gray-300 focus:ring-2 focus:ring-blue-500"
                  value={formData.machineName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="date"
                  className="text-md font-medium text-gray-700"
                >
                  {content.dateTicket[locale]}
                </Label>
                <DatePicker
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={handleDateChange}
                  disabled={isLoading}
                  className="w-full"
                />
              </div>
            </div>

            {/* Grup Issue */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="issue"
                className="text-md font-medium text-gray-700"
              >
                {content.issue[locale]}
              </Label>
              <Textarea
                id="issue"
                placeholder={content.detailIssue[locale]}
                className="min-h-[120px] text-[16px] bg-white border-gray-300 focus:ring-2 focus:ring-blue-500"
                value={formData.issue}
                onChange={handleInputChange}
                disabled={isLoading}
                maxLength={500}
              />
              <p className="text-xs text-right text-gray-400">
                {500 - formData.issue.length} {content.caracter[locale]}
              </p>
            </div>

            {/* Tombol Submit */}
            <div className="flex justify-start">
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-lg font-semibold px-8 py-6 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  // Teks tombol dinamis berdasarkan locale
                  content.buttonCreateTicket[locale]
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* === MODAL SUKSES (HIJAU) === */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader className="flex flex-col items-center text-center gap-2">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Ticket Created!
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 text-[16px]">
              Your maintenance ticket has been successfully submitted to the
              system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <Button
              type="button"
              className="bg-gray-900 text-white w-full sm:w-auto px-8 hover:bg-gray-800"
              onClick={() => setIsSuccessModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* === MODAL ERROR (MERAH - Custom Alert) === */}
      <Dialog open={isErrorModalOpen} onOpenChange={setIsErrorModalOpen}>
        <DialogContent className="sm:max-w-md bg-white border-l-4 border-red-500">
          <DialogHeader className="flex flex-col items-center text-center gap-2">
            <div className="h-14 w-14 bg-red-100 rounded-full flex items-center justify-center mb-2">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-red-600">
              {content.actionRequired[locale]}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-700 text-[16px] font-medium px-2">
              {errorMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <Button
              type="button"
              variant="destructive"
              className="w-full sm:w-auto px-8"
              onClick={() => setIsErrorModalOpen(false)}
            >
              {content.okay[locale]}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateTicketForm;
