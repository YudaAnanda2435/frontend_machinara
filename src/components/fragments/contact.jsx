import { useState } from "react";
import ImageContact from "../../assets/img/imageContact.png";

// Component untuk Radio Button Group
const FormTypeSelector = ({ formType, setFormType }) => {
  return (
    <div className="flex gap-6 ">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="formType"
          value="sayHi"
          checked={formType === "sayHi"}
          onChange={(e) => setFormType(e.target.value)}
          className="w-4 h-4 accent-slate-800"
        />
        <span className="text-gray-700 font-medium">Say Hi</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="formType"
          value="getQuote"
          checked={formType === "getQuote"}
          onChange={(e) => setFormType(e.target.value)}
          className="w-4 h-4 accent-slate-800"
        />
        <span className="text-gray-700 font-medium">Get a Quote</span>
      </label>
    </div>
  );
};

// Component untuk Input Field
const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
}) => {
  return (
    <div>
      <label className="block text-gray-700 text-sm mb-2">
        {label}
        {required && "*"}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-800 transition-colors"
      />
    </div>
  );
};

// Component untuk Textarea Field
const TextareaField = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  rows = 5,
  required = false,
}) => {
  return (
    <div>
      <label className="block text-gray-700 text-sm mb-2">
        {label}
        {required && "*"}
      </label>
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full px-4 py-3 h-[190px] border border-gray-300 rounded-lg focus:outline-none focus:border-slate-800 transition-colors resize-none"
      ></textarea>
    </div>
  );
};

// Component untuk Submit Button
const SubmitButton = ({ onClick, text = "Send Message" }) => {
  return (
    <button
      onClick={onClick}
      className="w-full buttonAnimate bg-[#1A3045] text-white py-4 rounded-lg font-medium hover:bg-slate-700 transition-colors"
    >
      {text}
    </button>
  );
};

// Component untuk Sunburst Rays
const SunburstRays = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-96 h-96">
        {[...Array(32)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-0.5 h-32 bg-gray-300 origin-bottom"
            style={{
              transform: `translate(-50%, -100%) rotate(${i * 11.25}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Component untuk Gear Logo

// Component untuk Logo Section (gabungan SunburstRays dan GearLogo)

// Component untuk Contact Form Section
const ContactFormSection = ({
  formType,
  setFormType,
  formData,
  handleChange,
  handleSubmit,
}) => {
  return (
    <div className="w-full gap-10 flex flex-col">
      <FormTypeSelector formType={formType} setFormType={setFormType} />

      <div className="flex flex-col gap-10">
        <InputField
          label="Name"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />

        <InputField
          label="Email"
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <TextareaField
          label="Message"
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          required
        />

        <SubmitButton onClick={handleSubmit} />
      </div>
    </div>
  );
};

// Main Contact Component
const Contact = ({id}) => {
  const [formType, setFormType] = useState("sayHi");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id={`${id}` } className="container-main pb-[137px] pt-10 md:pt-[140px]">
      <div className=" mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-12 items-center">
          <ContactFormSection
            formType={formType}
            setFormType={setFormType}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
          <img src={ImageContact} alt="" className="hidden lg:flex" />
          {/* <LogoSection /> */}
        </div>
      </div>
    </section>
  );
};

export default Contact;
