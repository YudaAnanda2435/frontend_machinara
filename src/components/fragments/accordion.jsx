import { useState } from "react";

// Data accordion
const processData = [
  {
    id: "01",
    title: "Consultation",
    description:
      "During the initial consultation, we will discuss your business goals and objectives, target audience, and current marketing efforts. This will allow us to understand your needs and tailor our services to best fit your requirements.",
  },
  {
    id: "02",
    title: "Research and Strategy Development",
    description:
      "Once we have a clear understanding of your needs, we will conduct in-depth research and analysis to develop a customized digital marketing strategy for your business.",
  },
  {
    id: "03",
    title: "Implementation",
    description:
      "Our team will execute the agreed-upon strategy, implementing various digital marketing tactics such as SEO, PPC, social media marketing, and content marketing.",
  },
  {
    id: "04",
    title: "Monitoring and Optimization",
    description:
      "We will continuously monitor the performance of your campaigns, making data-driven adjustments to optimize for better results and ensure maximum ROI.",
  },
  {
    id: "05",
    title: "Reporting and Communication",
    description:
      "You will receive regular reports detailing campaign performance, and we will maintain open communication to keep you informed of our progress and any recommendations.",
  },
  {
    id: "06",
    title: "Continual Improvement",
    description:
      "Digital marketing is always evolving, and so are we. We are committed to staying up-to-date with the latest trends and best practices to ensure your long-term success.",
  },
];

//  komponen untuk SATU item accordion
const AccordionItem = ({ item, isOpen, toggleItem }) => {
  const { id, title, description } = item;

  return (
    // kelas kondisional: --open atau --closed
    <div
      onClick={() => toggleItem(id)}
      className={`accordion-item ${
        isOpen ? "accordion-item--open" : "accordion-item--closed"
      }`}
    >
      {/* Header adalah tombol untuk toggle */}{" "}
      <div className="accordion-item__header">
        {" "}
        <div className="accordion-item__trigger">
          <h2 className="accordion-item__number">{id}</h2>{" "}
          <h3 className="accordion-item__title">{title}</h3>{" "}
        </div>{" "}
        <div className="accordion-item__icon-wrapper">
          {/* Container ikon baru */}
          <div className="accordion-icon">
            {/* Bar horizontal (selalu ada) */}
            <div className="accordion-icon__bar"></div>
            {/* Bar vertikal (yang akan berputar) */}
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

// Ini adalah komponen UTAMA Anda
const WorkingProcess = ({ className }) => {
  // State untuk melacak item mana yang terbuka. Default "01".
  const [openItem, setOpenItem] = useState("01");

  // Fungsi untuk mengubah item yang terbuka
  const toggleItem = (id) => {
    // Jika item yang sama diklik, tutup (set ke null)
    // Jika item berbeda diklik, buka item itu
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section className={`container-main ${className}`}>
      {/* Gunakan wrapper dari CSS */}{" "}
      <div className="accordion-wrapper">
        {/* Loop data dan render setiap item */}{" "}
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
