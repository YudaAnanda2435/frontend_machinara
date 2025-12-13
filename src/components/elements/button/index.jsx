const Buttons = ({ onClick, text, className, aos, aosDelay, icon, background ="bg-primary" }) => {
  return (
    <div data-aos={aos} data-aos-delay={aosDelay} className={className}>
      <button
        onClick={onClick}
        className={` cursor-pointer flex flex-row items-center gap-2 border border-primary text-[14px] lg:text-[18px]  font-normal py-3 lg:py-[18px] px-4 lg:px-8 rounded-[13px] group ${background} ${className}`}
      >
        {text}
        {icon && (
          <span className="transition-transform group-hover:translate-x-1">
            {icon}
          </span>
        )}
      </button>
    </div>
  );
};

export default Buttons;
