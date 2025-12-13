import React, { useState, useRef, useEffect } from "react";
import Engineer from "@/assets/img/engineer.png";
import Lara from "@/assets/img/lara-sit.png";
import Technology from "@/assets/img/larabot.gif";
import {
  SendHorizonal,
  User,
  Bot,
  Sparkles,
  Trash2,
  Zap,
  Cpu,
  Activity,
  AlertTriangle,
  WifiOff,
} from "lucide-react";

// --- MOCK UI COMPONENTS ---
const Card = ({ className, children }) => (
  <div
    className={`bg-white rounded-xl border border-gray-200 shadow-sm ${
      className || ""
    }`}
  >
    {children}
  </div>
);

const CardContent = ({ className, children }) => (
  <div className={`p-6 ${className || ""}`}>{children}</div>
);

// --- MAIN COMPONENT ---
const CophilotMachinara = () => {
  const [inputText, setInputText] = useState("");
  // const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const textareaRef = useRef(null); // Ref untuk akses DOM textarea
  // State khusus untuk error koneksi
  const [connectionError, setConnectionError] = useState(null);

  const messagesEndRef = useRef(null);

  // 1. STATE INITIALIZATION (AMBIL DARI LOCAL STORAGE)
  const [messages, setMessages] = useState(() => {
    const savedChats = localStorage.getItem("machinara_chat_history");
    return savedChats ? JSON.parse(savedChats) : [];
  });

  // Simpan Session ID agar konteks AI terjaga (atau di-reset saat new chat)
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem("machinara_session_id") || `user_${Date.now()}`;
  });

  // 2. AUTO-SAVE KE LOCAL STORAGE SETIAP ADA PESAN BARU
  useEffect(() => {
    localStorage.setItem("machinara_chat_history", JSON.stringify(messages));
    localStorage.setItem("machinara_session_id", sessionId);
  }, [messages, sessionId]);

  // Data statis dengan Icon
  const contentData = {
    title: "Hello! I'm your AI maintenance assistant...",
    features: [
      {
        id: 1,
        icon: Activity,
        text: "Bagaimana kondisi kesehatan mesin X-AE-A-19 hari ini?",
      },
      {
        id: 2,
        icon: Zap,
        text: "Bagaimana resiko mesin saya saat ini",
      },
      {
        id: 3,
        icon: Cpu,
        text: "Buatkan tiket maintenance untuk sensor yang rusak",
      },
      {
        id: 4,
        icon: Sparkles,
        text: "Apa penyebab anomali pada Ventilator 001?",
      },
    ],
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, connectionError]);

  // --- FUNGSI BARU: RESET / NEW CHAT ---
  const handleClearChat = () => {
    if (
      window.confirm(
        "Mulai percakapan baru? Riwayat chat saat ini akan dihapus."
      )
    ) {
      setMessages([]); // Kosongkan UI
      const newSession = `user_${Date.now()}`; // Buat ID sesi baru
      setSessionId(newSession);
      localStorage.removeItem("machinara_chat_history"); // Hapus storage
      localStorage.setItem("machinara_session_id", newSession);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // --- LOGIKA AUTO-RESIZE TEXTAREA ---
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // 1. Reset tinggi ke 'auto' dulu supaya saat hapus text, tingginya bisa mengecil
      textarea.style.height = "auto";

      // 2. Set tinggi sesuai scrollHeight (tinggi konten)
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [inputText]); // Jalankan setiap kali inputText berubah

  const handleSend = async (textToSend) => {
    const messageText = textToSend || inputText;
    if (!messageText.trim()) return;

    // Reset error sebelumnya
    setConnectionError(null);

    // 1. Tambah Pesan User
    const newUserMessage = {
      id: Date.now(),
      role: "user",
      content: messageText,
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // ---------------------------------------------------------
      // FETCH API
      // ---------------------------------------------------------
      // Kita gunakan AbortController untuk timeout jika server lambat merespon
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 8 detik timeout

      const response = await fetch(
        "https://machinelearning-production-344f.up.railway.app/chat-bot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            message: messageText,
            session_id: sessionId, // Menggunakan Session ID yang persisten
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponseText = data.reply || "Maaf, respon server kosong.";

      // 2. Tambah Pesan Bot (SUKSES)
      const newAiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: aiResponseText,
      };
      setMessages((prev) => [...prev, newAiMessage]);
    } catch (error) {
      console.error("Full Error Details:", error);

      let errorMsg = "Gagal terhubung ke server.";
      let isCorsOrNetworkError = false;

      if (error.name === "AbortError") {
        errorMsg = "Koneksi Timeout (Server terlalu lama merespon).";
        isCorsOrNetworkError = true;
      } else if (error.message.includes("Failed to fetch")) {
        errorMsg = "Koneksi Ditolak (Masalah CORS / Server Down).";
        isCorsOrNetworkError = true;
      } else {
        errorMsg = `Error: ${error.message}`;
      }

      setConnectionError(errorMsg);

      // --- FALLBACK / SIMULASI MODE ---
      // Jika terjadi error koneksi, kita berikan respon simulasi agar demo tetap jalan
      if (isCorsOrNetworkError) {
        setTimeout(() => {
          const fallbackResponse = `[⚠️ MODE OFFLINE/SIMULASI]\n\nSaya tidak dapat terhubung ke server asli karena kendala teknis (CORS/Network).\n\nNamun, jika server terhubung, saya akan menjawab pertanyaan: "${messageText}" dengan analisis data mesin terkait suhu, getaran, dan prediksi maintenance.`;

          const newAiMessage = {
            id: Date.now() + 1,
            role: "assistant",
            content: fallbackResponse,
          };
          setMessages((prev) => [...prev, newAiMessage]);
        }, 1000);
      } else {
        // Error lain (bukan koneksi)
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            role: "assistant",
            content: "⚠️ Terjadi kesalahan internal pada aplikasi.",
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <Card className="bg-color-grey w-full my-2 border-none shadow-none">
      <CardContent className="py-6 relative h-[82vh] sm:h-[81vh] flex flex-col px-4 md:px-24 my-5 bg-[#F9FAFB] rounded-3xl shadow-[0_5px_0_#191A23]">
        {/* === TOMBOL NEW CHAT / RESET (Pojok Kanan Atas) === */}
        {messages.length > 0 && (
          <div className="absolute top-4 right-4 md:right-8 z-10">
            <button
              onClick={handleClearChat}
              className="p-2 bg-white/80 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-all shadow-sm border border-gray-100 tooltip-trigger"
              title="Reset Chat & Mulai Baru"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}
        {/* === AREA CHAT === */}
        <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
          {messages.length === 0 ? (
            <div className="flex flex-col gap-6 sm:gap-8 h-full justify-center">
              <div className="flex flex-row mx-auto items-center text-center gap-2 sm:gap-4">
                <div className="rounded-full">
                  <img src={Technology} alt="" className="w-14 h-14" />
                </div>
                <h4 className="font-roboto text-2xl sm:text-3xl font-semibold text-gray-800">
                  How can I help you?
                </h4>
              </div>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {contentData.features.map((feature) => (
                  <li
                    key={feature.id}
                    onClick={() => handleSend(feature.text)}
                    className="bg-white p-2 sm:p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-row items-center gap-3 group"
                  >
                    <div className="bg-blue-50 w-fit p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
                      {feature.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex flex-col gap-6 py-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  // PERUBAHAN DI SINI
                  className={`flex gap-2 sm:gap-4 flex-col sm:flex-row ${
                    msg.role === "user"
                      ? "items-end sm:items-start sm:flex-row-reverse" // User: Mobile Kanan, Desktop Reverse
                      : "items-start sm:flex-row" // Bot: Mobile Kiri, Desktop Normal
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`rounded-full flex items-center justify-center shrink-0 w-10 h-10`}
                  >
                    {msg.role === "user" ? (
                      <img src={Engineer} alt="" className="w-10 h-10" />
                    ) : (
                      <img src={Lara} alt="" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`p-4 max-w-auto sm:max-w-[80%] rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                    }`}
                  >
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-4">
                  <div className="rounded-full  w-10 h-10 flex items-center justify-center">
                    <img src={Technology} alt="" className="w-10 h-10" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* === AREA ALERT ERROR (Jika Backend Error/CORS) === */}
        {connectionError && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3 animate-in slide-in-from-bottom-2">
            <WifiOff className="text-amber-500 w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-bold">Masalah Koneksi Server</p>
              <p>{connectionError}</p>
              <p className="text-xs mt-1 text-amber-600 italic">
                *Chatbot beralih ke Mode Simulasi agar Anda tetap bisa mencoba
                antarmuka ini.
              </p>
            </div>
          </div>
        )}

        {/* === INPUT === */}
        {/* === INPUT FORM === */}
        <form onSubmit={onSubmitForm} className="mt-auto border-none!">
          <div className="relative border-none! flex items-end bg-white rounded-2xl shadow-sm  transition-all">
            {/* GANTI INPUT DENGAN TEXTAREA */}
            <textarea
              ref={textareaRef}
              placeholder="Ask about machine health..."
              className="no-scrollbar w-full max-h-32 min-h-14 focus:outline-none focus:ring-0 py-4 pl-6 pr-14 bg-transparent border-none!  text-gray-700 resize-none overflow-y-auto leading-relaxed"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown} // Pasang handler di sini
              disabled={isLoading}
              rows={1} // Tinggi awal
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              // Sesuaikan posisi button agar tetap di kanan bawah/tengah
              className="absolute right-2 bottom-2 p-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <SendHorizonal className="h-5 w-5" />
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            AI can make mistakes. Consider checking important information.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default CophilotMachinara;
