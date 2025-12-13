import { useEffect } from "react";
import Lenis from "lenis";

// Tidak perlu useRef untuk wrapper lagi
const SmoothScroll = ({ children }) => {
  useEffect(() => {
    // Inisialisasi Lenis TANPA opsi wrapper/content
    // Lenis otomatis akan nempel ke window
    const lenis = new Lenis({
      duration: 1.2, // Atur durasi sesuai selera (biasanya 1.2 enak)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing default Lenis yang smooth
      smooth: true,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Kembalikan children tanpa div wrapper khusus, atau pakai fragment
  return <>{children}</>;
};

export default SmoothScroll;