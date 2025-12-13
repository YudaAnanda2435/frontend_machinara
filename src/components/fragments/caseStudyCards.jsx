import Buttons from "../elements/button";
import LearnMore from "/learnMore3.svg";

const CaseStudyCards = ({ className}) => {
  return (
    <section className={`container-main mb-[100px] sm:mb-[140px] ${className}`}>
      <div className="flex w-full flex-col md:flex-row justify-between gap-4 bg-primary p-10 px-[30px] md:py-[70px] md:px-[60px] rounded-[45px] items-stretch">
        <div className="w-full md:max-w-[286px] gap-5 flex flex-col">
          <p className="text-white">
            For a local restaurant, we implemented a targeted PPC campaign that
            resulted in a 50% increase in website traffic and a 25% increase in
            sales.
          </p>
          <Buttons
            className="p-0! bg-transparent text-white border-0"
            text="Learn more"
            icon={<img src={LearnMore} />}
          />
        </div>

        <div className="w-full h-px md:h-auto md:w-px bg-white self-stretch"></div>

        <div className="w-full md:max-w-[286px] gap-5 flex flex-col">
          <p className="text-white">
            For a local restaurant, we implemented a targeted PPC campaign that
            resulted in a 50% increase in website traffic and a 25% increase in
            sales.
          </p>
          <Buttons
            className="p-0! bg-transparent text-white border-0"
            text="Learn more"
            icon={<img src={LearnMore} />}
          />
        </div>

        <div className="w-full h-px md:h-auto md:w-px bg-white self-stretch"></div>

        <div className="w-full md:max-w-[286px] gap-5 flex flex-col">
          <p className="text-white">
            For a local restaurant, we implemented a targeted PPC campaign that
            resulted in a 50% increase in website traffic and a 25% increase in
            sales.
          </p>
          <Buttons
            className="p-0! bg-transparent text-white border-0"
            text="Learn more"
            icon={<img src={LearnMore} />}
          />
        </div>
      </div>
    </section>
  );
};
export default CaseStudyCards;
