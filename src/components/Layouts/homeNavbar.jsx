import { useState } from "react";
// 1. Pastikan import Link dari react-router-dom
import { Link, useNavigate } from "react-router-dom";

// --- Import Elements ---
import Buttons from "../elements/button";
import AnimatedHamburgerIcon from "../elements/hamburger/AnimatedHamburgerIcon";

// --- Import Assets & Data ---
import Logo from "/logo.svg";
import { navLinks } from "../../data/navigation";

const HomeNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // --- FUNGSI 1: Khusus untuk Scroll di halaman yang sama (Anchor Links) ---
  const handleScrollToSection = (e, href) => {
    e.preventDefault(); // Cegah reload/pindah halaman
    closeMobileMenu();

    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      // Opsional: Jika elemen tidak ada (misal kita di halaman lain),
      // pindah ke home dulu
      if (window.location.pathname !== "/") {
        navigate("/");
        // Logic scroll setelah navigasi agak kompleks,
        // tapi untuk sekarang cukup navigate ke home
      }
    }
  };

  return (
    <>
      <nav className="container-main mb-[50px] z-10 sticky top-0  flex flex-row justify-between items-center py-4 bg-white/80 backdrop-blur-sm">
        {/* --- Logo --- */}
        <Link
          to="/"
          aria-label="Beranda"
          onClick={() => {
            closeMobileMenu();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <img src={Logo} alt="Logo Perusahaan" />
        </Link>

        {/* --- Menu Desktop --- */}
        <ul className="hidden md:flex flex-row w-full justify-end items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.title}>
              {/* Cek apakah link adalah anchor (#) atau halaman internal (/) */}
              {link.href.startsWith("#") ? (
                <a
                  href={link.href}
                  className="text-gray-700 hover:text-black transition-colors cursor-pointer"
                  onClick={(e) => handleScrollToSection(e, link.href)}
                >
                  {link.title}
                </a>
              ) : (
                <Link
                  to={link.href}
                  className="text-gray-700 hover:text-black transition-colors cursor-pointer"
                >
                  {link.title}
                </Link>
              )}
            </li>
          ))}

          {/* --- TOMBOL LOGIN (DIPERBAIKI) --- */}
          <li>
            {/* Gunakan <Link> biasa tanpa preventDefault.
                Ini akan otomatis redirect ke /login 
            */}
            <Link to="/login">
              <Buttons
                className="text-black buttonAnimate2"
                background="bg-transparent"
                text="Request a quote" // Atau "Login"
              />
            </Link>
          </li>
        </ul>

        {/* --- Tombol Hamburger --- */}
        <div className="md:hidden z-50">
          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            className="p-2 rounded-md text-gray-700 hover:text-black focus:outline-none"
          >
            <AnimatedHamburgerIcon isOpen={isMobileMenuOpen} />
          </button>
        </div>
      </nav>

      {/* --- Menu Mobile --- */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-full bg-white shadow-xl z-40
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
          md:hidden
        `}
      >
        <div className="p-6 pt-20">
          <ul className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <li key={link.title}>
                {link.href.startsWith("#") ? (
                  <a
                    href={link.href}
                    className="text-lg text-gray-700 hover:text-black"
                    onClick={(e) => handleScrollToSection(e, link.href)}
                  >
                    {link.title}
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    className="text-lg text-gray-700 hover:text-black"
                    onClick={closeMobileMenu}
                  >
                    {link.title}
                  </Link>
                )}
              </li>
            ))}

            {/* Tombol Login Mobile */}
            <li className="mt-4">
              <Link
                to="/login"
                onClick={closeMobileMenu} // Hanya perlu menutup menu
              >
                <Buttons
                  className="text-black w-full text-left"
                  background="bg-transparent"
                  text="Request a quote"
                />
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* --- Overlay --- */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
};

export default HomeNavbar;
