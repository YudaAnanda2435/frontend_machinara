import { useState } from "react";
import Button from "../../components/elements/button/index";
import Helpme from "@/assets/img/helpme.png";
import { Card, CardContent } from "../ui/card";

// Data untuk semua item, agar tidak hard-coding
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

// Ini adalah komponen untuk SATU item accordion
const AccordionItem = ({ item, isOpen, toggleItem }) => {
  const { id, title, description } = item;

  return (
    // Terapkan kelas kondisional: --open atau --closed
    <div
      onClick={() => toggleItem(id)}
      className={`accordion-item-support ${
        isOpen
          ? "accordion-item-support--open"
          : "accordion-item-support--closed"
      }`}
    >
      {/* Header */}
      <div className="accordion-item-support__header">
        <div className="accordion-item-support__trigger">
          {/* Hapus Nomor, langsung Judul */}
          <h3 className="accordion-item-support__title">{title}</h3>
        </div>

        {/* Icon Wrapper Khusus Support */}
        <div className="accordion-item-support__icon-wrapper">
          <div className="accordion-icon">
            <div className="accordion-icon__bar"></div>
            <div className="accordion-icon__bar"></div>
          </div>
        </div>
      </div>

      {/* Panel Konten */}
      <div className="accordion-item-support__panel">
        <div className="accordion-item-support__panel-content">
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

// Ini adalah komponen UTAMA Anda
const AccordionSupport = ({ className }) => {
  // State untuk melacak item mana yang terbuka. Default "01".
  const [openItem, setOpenItem] = useState("01");

  // Fungsi untuk mengubah item yang terbuka
  const toggleItem = (id) => {
    // Jika item yang sama diklik, tutup (set ke null)
    // Jika item berbeda diklik, buka item itu
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section className={`font-roboto gap-5 flex flex-col mb-16 ${className}`}>
      {/* Gunakan wrapper dari CSS */}{" "}
      <div className="accordion-wrapper-support">
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
      <Card className="flex flex-col gap-16 px-20 justify-center">
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
