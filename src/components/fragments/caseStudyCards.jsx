import Buttons from "../elements/button";
import LearnMore from "/learnMore3.svg";

const CaseStudyCards = ({ className}) => {
  return (
    <section className={`container-main mb-[100px] sm:mb-[140px] ${className}`}>
      <div className="flex w-full flex-col md:flex-row justify-between gap-4 bg-primary p-10 px-[30px] md:py-[70px] md:px-[60px] rounded-[45px] items-stretch">
        <div className="w-full md:max-w-[286px] gap-5 flex flex-col">
          <p className="text-white">
            For a major automotive parts manufacturer, Machinara's real-time
            vibration analysis detected a critical spindle fault weeks in
            advance, preventing an estimated 48 hours of unexpected downtime and
            saving over $120,000 in emergency repair costs.
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
            For a large-scale bottling facility, our AI-based temperature
            monitoring identified early signs of overheating in conveyor motors,
            enabling planned interventions that significantly improved Overall
            Equipment Effectiveness (OEE) by 18%.
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
            For a regional steel processing plant, Machinara’s anomaly detection
            algorithm spotted irregular hydraulic pressure patterns, enabling
            preventive maintenance that extended the main press's operational
            lifespan by 3 years and cut energy consumption by 12%.
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
