import Buttons from "../elements/button";
import ImgBanner from "../../assets/img/imgbanner.svg" 

const Banner = () => {
    return (
      <section className="container-main mt-20 mb-20 md:mt-[116px] md:mb-[147px] py-6">
        <div className="flex p-10 lg:p-0 gap-8 flex-col lg:flex-row items-center justify-between h-full lg:max-h-[347px] bg-grey rounded-[45px]">
          <div className="flex flex-col gap-[18px] md:gap-[26px] w-full max-w-[500px] lg:p-[60px]">
            <h3 className="text-[30px] font-medium">Let’s make things happen</h3>
            <p>
              Contact us today to learn more about how our digital marketing
              services can help your business grow and succeed online.
            </p>
            <Buttons className={"buttonAnimate w-fit"} text={`Get your free proposal`} />
          </div>
          <img className="lg:mr-[135px]" src={ImgBanner} alt="" />
        </div>
      </section>
    );
}
export default Banner;