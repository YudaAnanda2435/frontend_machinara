import React, { useState, useRef, useEffect } from "react";
import {
  SendHorizonal,
  X,
  MessageSquare,
  Grip,
  Loader2,
  Trash2,
  AlertTriangle,
} from "lucide-react";

// --- IMPORT KOMPONEN SHADCN ---
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// --- KONFIGURASI ---
const STORAGE_KEY = "machinara_copilot_history";
const ONE_HOUR_MS = 60 * 60 * 1000;

// Komponen Logo
const CopilotLogo = ({ rotate }) => (
  <div
    className={`h-10 w-10 font-roboto rounded-full flex items-center justify-center
      transition-transform duration-500 ease-in-out
      ${rotate ? "rotate-360" : "rotate-0"}
    `}
  >
    <img src="/btn-ai.svg" alt="Copilot" />
  </div>
);

const initialMessage = {
  id: 1,
  sender: "ai",
  text: "Welcome! How can I assist you with your machine health analytics today?",
};

export const ChatCopilot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);
  const chatBodyRef = useRef(null);

  const [messages, setMessages] = useState(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const now = Date.now();
        if (now - parsed.timestamp < ONE_HOUR_MS) {
          return parsed.messages;
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }
    return [initialMessage];
  });

  const [inputText, setInputText] = useState("");
  const [rotate, setRotate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState("testing-user-001");

  // State untuk Modal Hapus
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // --- EFFECTS ---

  // Simpan ke Storage tiap ada pesan baru
  useEffect(() => {
    const dataToSave = {
      messages: messages,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [messages]);

  // --- SCROLL LOCKING LOGIC (PERBAIKAN UTAMA) ---
  useEffect(() => {
    if (isOpen) {
      // 1. Kunci Scroll Body
      document.body.style.overflow = "hidden";
      // 2. Tambahan untuk Mobile (iOS/Safari) agar tidak bounce
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      // Restore
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      // Cleanup saat unmount
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  // Auto scroll ke bawah
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  // --- HANDLERS ---

  // Buka Modal Hapus
  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  // Konfirmasi Hapus
  const confirmDelete = () => {
    setMessages([initialMessage]);
    localStorage.removeItem(STORAGE_KEY);
    setIsDeleteModalOpen(false);
  };

  // Kirim Pesan ke API
  const handleSend = async (e) => {
    e.preventDefault();
    const text = inputText.trim();
    if (text === "" || isLoading) return;

    const userMessage = { id: Date.now(), sender: "user", text: text };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://general-chatbot.up.railway.app/chat-general",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, session_id: sessionId }),
        }
      );

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();

      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: data.reply,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
      const errorMessage = {
        id: Date.now() + 2,
        sender: "ai",
        text: "Maaf, saya mengalami kendala koneksi. Silakan coba lagi.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Overlay Gelap (Mencegah klik ke belakang & visual fokus) */}
      {isOpen && (
        <div
          className="fixed font-roboto inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in-0"
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Tombol Trigger (Kanan Bawah) */}
      <div className="bg-[#F4F4F4] z-50 flex items-center shadow-xl rounded-full flex-row h-10 fixed bottom-6 right-8">
        <p className="hidden font-roboto relative md:block text-[12px] font-semibold p-4 text-black">
          CHAT WITH AI
        </p>
        <button
          onClick={() => {
            setIsOpen((prev) => !prev);
            setRotate((prev) => !prev);
          }}
          className="group z-50 h-16 w-auto p-4 rounded-full shadow-xl bg-[#F4F4F4] flex items-center gap-3 transition-transform duration-200 hover:scale-105"
        >
          <CopilotLogo rotate={rotate} />
        </button>
      </div>

      {/* Jendela Chat */}
      {isOpen && (
        <div
          ref={popoverRef}
          className="fixed bottom-[100px] right-4 sm:right-8 z-50 w-[90vw] sm:w-[400px] md:w-[450px] rounded-2xl shadow-2xl border border-gray-200 bg-white chat-popover-tail flex flex-col overflow-hidden max-h-[80vh]"
          // Stop propagation agar scroll di dalam chat tidak nembus ke body
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-[500px] max-h-[80vh]">
            {/* HEADER */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50 shrink-0">
              <div className="flex items-center gap-3">
                <CopilotLogo />
                <span className="font-roboto text-lg font-semibold text-gray-800">
                  Machinara Copilot
                </span>
              </div>

              {/* TOMBOL AKSI HEADER (DELETE & CLOSE) */}
              <div className="flex items-center gap-1">
                {/* 1. Tombol Hapus */}
                <button
                  onClick={handleDeleteClick}
                  className="p-2 rounded-full hover:bg-red-100 hover:text-red-600 text-gray-500 transition-colors"
                  title="Clear Chat History"
                >
                  <Trash2 className="h-5 w-5" />
                </button>

                {/* 2. Tombol Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* BODY (Scrollable Area) */}
            <div
              ref={chatBodyRef}
              className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-white overscroll-contain"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 items-start max-w-[85%] ${
                    message.sender === "user"
                      ? "ml-auto flex-row-reverse"
                      : "mr-auto"
                  }`}
                >
                  {message.sender === "ai" ? (
                    <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                      <Grip className="h-5 w-5 text-gray-500" />
                    </div>
                  ) : (
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p
                      className={`whitespace-pre-wrap ${
                        message.sender === "user" ? "text-white" : ""
                      }`}
                    >
                      {message.text}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 items-start mr-auto max-w-[85%] animate-pulse">
                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                    <Grip className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-none text-gray-500 text-sm">
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            {/* FOOTER (Input Area) */}
            <form
              onSubmit={handleSend}
              className="p-4 border-t bg-white shrink-0"
            >
              <div className="relative">
                <input
                  placeholder="Ask about machine health..."
                  className="pr-12 h-12 w-full px-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all
                    ${
                      isLoading || !inputText.trim()
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-blue-600 hover:bg-blue-50 cursor-pointer"
                    }`}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <SendHorizonal className="h-5 w-5" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DIALOG HAPUS --- */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md bg-white border-l-4 z-[60] border-red-500">
          <DialogHeader className="flex flex-col items-center text-center gap-2">
            <div className="h-14 w-14 bg-red-100 rounded-full flex items-center justify-center mb-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-red-600 text-center">
              Action Required
            </DialogTitle>
            <DialogDescription className="text-center text-gray-700">
              Are you sure you want to clear the entire chat history? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-center mt-4 gap-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors"
              onClick={confirmDelete}
            >
              Delete History
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatCopilot;
