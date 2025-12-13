// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Buttons from "../button/index";

const NavigationItem = ({ icon, text, isActive }) => {
  const activeBg = isActive
    ? "bg-primary text-white"
    : "bg-transparent text-[#737791] hover:bg-primary hover:text-white";

  return (
    <div
      className={`flex flex-row items-center gap-4 p-3 rounded-2xl w-full cursor-pointer transition-colors duration-200 ${activeBg}`}
    >
      <img src={icon} alt="" className={`w-5 h-5 `} />
      <Buttons
        className={`bg-transparent! border-0! p-0!`}
        // hoverBg="!bg-transparent"
        justify="justify-start"
        text={text}
        padding="!p-0"
        // className={contentClasses}
      />
    </div>
  );
};

export default NavigationItem;
