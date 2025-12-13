// 1. Impor komponen Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

// 2. Impor modul Swiper yang akan kita gunakan
import { Navigation, Pagination } from "swiper/modules";

// 3. Impor CSS WAJIB untuk Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// --- PERUBAHAN 1: Impor useState ---
import { useState } from "react";

// Impor data dan aset Anda
import { testimonialData } from "../../data/testimonial";

const Testimonial = ({ className, id }) => {
  // --- PERUBAHAN 2: Buat state untuk melacak klik terakhir ---
  const [lastClicked, setLastClicked] = useState("next");

  return (
    <section
      id={`${id}`}
      className={`container-main mb-[100px] md:mb-[140px] ${className} `}
    >
      <div className="bg-[#191A23] pt-[84px] flex flex-col gap-[45px] md:gap-[124px] pb-[68px] rounded-[45px] overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination]}
          // --- INI ADALAH SETTING DEFAULT (MOBILE / < 768px) ---
          slidesPerView={1.3} // Tampilkan 1 slide
          centeredSlides={true} // Tidak perlu di-center jika hanya 1
          initialSlide={1} // Mulai dari slide pertama (atau 0)
          loop={true}
          spaceBetween={10}
          pagination={{
            el: ".testimonial-pagination",
            clickable: true,
          }}
          navigation={{
            prevEl: ".testimonial-prev-arrow",
            nextEl: ".testimonial-next-arrow",
          }}
          className="w-full"
          // --- INI ADALAH SETTING UNTUK LAYAR LEBIH BESAR ---
          breakpoints={{
            // '768' adalah breakpoint 'md' di Tailwind
            768: {
              slidesPerView: 2, // Kembali ke 2 slide
              centeredSlides: true, // Aktifkan centering lagi
              initialSlide: 3, // Kembalikan initial slide desktop Anda
            },
          }}
        >
          {testimonialData.map((item) => (
            <SwiperSlide key={item.id}>
              {({ isActive }) => (
                <div
                  // Logika 'isActive' ini akan tetap berfungsi di kedua layout
                  className={`flex flex-col items-start transition-all duration-300 ${
                    isActive ? "opacity-100 scale-100" : "opacity-50 scale-90"
                  }`}
                >
                  <div className="testimonial-bubble mb-4">
                    <p className="w-full min-h-[177px] text-white">
                      {item.quote}
                    </p>
                  </div>
                  <div className="flex flex-col md:pl-20 mt-5">
                    <p className="text-[#8C90FF] font-semibold">{item.name}</p>
                    <p className="text-white">{item.title}</p>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 6. Navigasi Kustom (Di luar Swiper) */}
        <div className="flex flex-row w-full px-6 max-w-[564px] items-center justify-between mx-auto">
          {/* ... (Kode navigasi Anda tidak berubah) ... */}

          {/* Tombol Kiri */}
          <button
            className="testimonial-prev-arrow group cursor-pointer"
            aria-label="Previous testimonial"
            onClick={() => setLastClicked("prev")}
          >
            <FaArrowLeft
              className={`h-7 w-7 transition-colors duration-300 group-hover:text-white ${
                lastClicked === "prev" ? "text-white" : "text-gray-500"
              }`}
            />
          </button>

          {/* Pagination */}
          <div className="testimonial-pagination mx-auto justify-center items-center flex gap-2">
            {/* Bullets akan di-render Swiper di sini */}
          </div>

          {/* Tombol Kanan */}
          <button
            className="testimonial-next-arrow group cursor-pointer"
            aria-label="Next testimonial"
            onClick={() => setLastClicked("next")}
          >
            <FaArrowRight
              className={`h-7 w-7 transition-colors duration-300 group-hover:text-white ${
                lastClicked === "next" ? "text-white" : "text-gray-500"
              }`}
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
