import AuthBg from "../../assets/img/excavator.jpg";
import Logo from "/logo.svg";

const AuthLayouts = ({ children, title, type }) => {
  return (
    <div
      style={{ backgroundImage: `url(${AuthBg})` }}
      className="flex font-roboto relative justify-center min-h-screen items-center bg-no-repeat bg-cover gap-4 "
    >
      <div className="absolute inset-0  bg-black/40"></div>
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-lg z-50 bg-white/80 gap-4 flex flex-col backdrop-blur-md lg:max-w-xl rounded-lg p-6 boxShadow ">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-3xl font-bold mb-2 ">{title}</h1>
          <img
            className=" w-[120px] z-20 top-4 left-4 bg-white rounded-[80px] p-2"
            src={Logo}
            alt=""
          />
        </div>
        <p className="font-medium mb-8">
          Welcome to Machinara, please enter your detail
        </p>
        {children}
        <Navigation type={type} />
      </div>
    </div>
  );
};

const Navigation = () => {
  return <div className="flex justify-center gap-3 mt-4"></div>;
};

export default AuthLayouts;
