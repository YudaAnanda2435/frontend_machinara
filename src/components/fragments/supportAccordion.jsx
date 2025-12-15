import { useState } from "react";
import Button from "../../components/elements/button/index";
import Helpme from "@/assets/img/helpme.png";
import { Card, CardContent } from "../ui/card";

// Data untuk semua item, agar tidak hard-coding
const processData = [
  {
    id: "01",
    title: "Operational Assessment",
    description:
      "We begin by discussing your critical assets, maintenance pain points, and operational goals. This helps us identify which machines require monitoring and determine the appropriate sensor configurations.",
  },
  {
    id: "02",
    title: "Integration Strategy",
    description:
      "Once requirements are clear, we design a data integration plan. We analyze your existing PLC/SCADA infrastructure or recommend compatible IoT sensors to ensure seamless connectivity with Machinara.",
  },
  {
    id: "03",
    title: "Deployment & Calibration",
    description:
      "Our team connects your machinery to the Machinara cloud. During this phase, our AI establishes a 'baseline' of normal behavior for each machine to ensure accurate anomaly detection later.",
  },
  {
    id: "04",
    title: "Real-time Monitoring",
    description:
      "The system goes live. Machinara continuously monitors vibration, temperature, and acoustic data 24/7, using predictive algorithms to spot the slightest deviations in performance.",
  },
  {
    id: "05",
    title: "Alerts & Insights",
    description:
      "Instead of generic reports, you receive actionable maintenance tickets. We provide detailed health forecasts and alerts, keeping your team informed of potential failures before they happen.",
  },
  {
    id: "06",
    title: "Adaptive Learning",
    description:
      "Your machine health models improve over time. By incorporating feedback from your technicians after repairs, Machinara’s AI refines its accuracy to reduce false alarms and optimize maintenance schedules.",
  },
];

// komponen accordion
const AccordionItem = ({ item, isOpen, toggleItem }) => {
  const { id, title, description } = item;

  return (
    <div
      onClick={() => toggleItem(id)}
      className={`accordion-item-support ${
        isOpen
          ? "accordion-item-support--open"
          : "accordion-item-support--closed"
      }`}
    >
      <div className="accordion-item-support__header">
        <div className="accordion-item-support__trigger">
          <h3 className="accordion-item-support__title">{title}</h3>
        </div>
        <div className="accordion-item-support__icon-wrapper">
          <div className="accordion-icon">
            <div className="accordion-icon__bar"></div>
            <div className="accordion-icon__bar"></div>
          </div>
        </div>
      </div>
      <div className="accordion-item-support__panel">
        <div className="accordion-item-support__panel-content">
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

const AccordionSupport = ({ className }) => {
  const [openItem, setOpenItem] = useState("01");

  const toggleItem = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section className={`font-roboto gap-5 flex flex-col mb-16 ${className}`}>
      <div className="accordion-wrapper-support">
        {processData.map((item) => (
          <AccordionItem
            key={item.id}
            item={item}
            isOpen={openItem === item.id}
            toggleItem={toggleItem}
          />
        ))}{" "}
      </div>{" "}
      <Card className="flex flex-col gap-16 text-center sm:text-start md:px-10 lg:px-20 justify-center">
        <CardContent className="flex flex-col gap-16 justify-center items-center">
          <div className="flex flex-col gap-6 justify-center items-center">
            <img className="w-fit" src={Helpme} alt="" />
            <h3>Do you have more questions?</h3>
            <p>
              End-to-end payments and financial management in a single solution.
              Meet the right platform to help realize.
            </p>
          </div>
          <Button
            className={`w-full rounded-[2px]! items-center! py-3! justify-center flex! text-white`}
            text={"Shoot a Direct Mail"}
          ></Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default AccordionSupport;
