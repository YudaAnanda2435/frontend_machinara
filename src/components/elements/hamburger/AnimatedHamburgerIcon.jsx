/**
 * Komponen ini membuat ikon hamburger yang bisa ber-animasi
 * menjadi ikon "X" (close) berdasarkan prop 'isOpen'.
 * * @param {object} props
 * @param {boolean} props.isOpen - Status apakah menu terbuka atau tidak.
 */
const AnimatedHamburgerIcon = ({ isOpen }) => {
  // Kelas dasar untuk ketiga garis
  const barBaseStyles =
    "h-0.5 w-6 bg-current transition-all duration-300 ease-in-out";

  return (
    // Kontainer untuk menjaga posisi relatif
    <div className="relative h-6 w-6 z-9999">
      {/* Garis 1 (Atas) */}
      <span
        className={`
          ${barBaseStyles} absolute left-0
          ${isOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-1.5]"}
        `}
      />
      {/* Garis 2 (Tengah) */}
      <span
        className={`
          ${barBaseStyles} absolute left-0 top-2/5 -translate-y-1/2
          ${isOpen ? "opacity-0" : "opacity-100"} 
        `}
      />
      {/* Garis 3 (Bawah) */}
      <span
        className={`
          ${barBaseStyles} absolute left-0
          ${isOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-1.5"}
        `}
      />
    </div>
  );
};

export default AnimatedHamburgerIcon;
