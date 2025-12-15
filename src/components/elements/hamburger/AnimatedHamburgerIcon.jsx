/**
 * * @param {object} props
 * @param {boolean} props.isOpen - 
 */
const AnimatedHamburgerIcon = ({ isOpen }) => {
  const barBaseStyles =
    "h-0.5 w-6 bg-current transition-all duration-300 ease-in-out";

  return (
    <div className="relative h-6 w-6 z-9999">
      <span
        className={`
          ${barBaseStyles} absolute left-0
          ${isOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-1.5]"}
        `}
      />
      <span
        className={`
          ${barBaseStyles} absolute left-0 top-2/5 -translate-y-1/2
          ${isOpen ? "opacity-0" : "opacity-100"} 
        `}
      />
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
