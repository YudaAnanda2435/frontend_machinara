import HeroImage from "../../assets/img/iconic.png";
import Buttons from "../elements/button/index";
import { Link } from "react-router-dom";

const Hero = () => {
  // const navigate = useNavigate();
  return (
    <section className="container-main overflow-hidden flex gap-4 md:gap-10 lg:gap-20 xl:gap-[150px] flex-col md:flex-row justify-between items-center pb-[78px] mb-[69px]">
      <div className="flex items-center md:items-start flex-col gap-5 md:gap-8">
        <h1 className="text-[32px] md:text-[40px]  lg:text-[50px] text-center md:text-start xl:text-[56px] text-primary w-full max-w-[500px] leading-[1.2]">
          Predictive Maintenance Copilot
        </h1>
        <p className="text-center md:text-start">
          Our digital marketing agency helps businesses grow and succeed online
          through a range of services including SEO, PPC, social media
          marketing, and content creation.
        </p>
        <Link to="/login">
          <Buttons className={"buttonAnimate"} text={`Go to Our System`} />
        </Link>
      </div>
      <img className="object-cover w-full" src={HeroImage} alt="" />
    </section>
  );
};

export default Hero;
