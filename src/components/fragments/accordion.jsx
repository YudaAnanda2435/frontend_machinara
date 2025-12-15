import { useState } from "react";

// Data accordion
const processData = [
  {
    id: "01",
    title: "System Assessment",
    description:
      "We begin by analyzing your critical machinery and operational goals to identify the right sensor configurations and data points needed for accurate monitoring.",
  },
  {
    id: "02",
    title: "How does the Machinara web platform work",
    description:
      "Machinara is a cloud-based application where you input your machine operational data. Our predictive AI analyzes this data to identify patterns, helping you visualize equipment health and predict potential maintenance needs through an intuitive dashboard.",
  },
  {
    id: "03",
    title: "AI Model Calibration",
    description:
      "During this phase, our AI establishes a 'baseline' of normal machine behavior. It learns your equipment's unique vibration and thermal patterns to distinguish healthy operations from anomalies.",
  },
  {
    id: "04",
    title: "Real-time Monitoring",
    description:
      "Machinara goes live, monitoring your assets 24/7. Our algorithms continuously scan for deviations in vibration, temperature, and acoustics to detect early signs of failure.",
  },
  {
    id: "05",
    title: "Alerts & Actionable Reporting",
    description:
      "When a high critical anomaly is detected, the system will immediately enter the anomaly list for prevention before it is completely damaged, this is useful to ensure that no problems are missed.",
  },
  {
    id: "06",
    title: "Adaptive Learning",
    description:
      "The system gets smarter over time. By incorporating feedback from your maintenance team after repairs, Machinara refines its predictive models to reduce false alarms and increase accuracy",
  },
];

const AccordionItem = ({ item, isOpen, toggleItem }) => {
  const { id, title, description } = item;

  return (
    <div
      onClick={() => toggleItem(id)}
      className={`accordion-item ${
        isOpen ? "accordion-item--open" : "accordion-item--closed"
      }`}
    >
      <div className="accordion-item__header">
        {" "}
        <div className="accordion-item__trigger">
          <h2 className="accordion-item__number">{id}</h2>{" "}
          <h3 className="accordion-item__title">{title}</h3>{" "}
        </div>{" "}
        <div className="accordion-item__icon-wrapper">
          <div className="accordion-icon">
            <div className="accordion-icon__bar"></div>
            <div className="accordion-icon__bar"></div>
          </div>
        </div>
      </div>
      <div className="accordion-item__panel">
        {" "}
        <div className="accordion-item__panel-content">
          <p>{description}</p>{" "}
        </div>{" "}
      </div>
    </div>
  );
};

const WorkingProcess = ({ className }) => {
  const [openItem, setOpenItem] = useState("01");
  const toggleItem = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section className={`container-main ${className}`}>
      <div className="accordion-wrapper">
        {processData.map((item) => (
          <AccordionItem
            key={item.id}
            item={item}
            isOpen={openItem === item.id}
            toggleItem={toggleItem}
          />
        ))}{" "}
      </div>{" "}
    </section>
  );
};

export default WorkingProcess;
