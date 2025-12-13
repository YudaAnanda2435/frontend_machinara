import Card from "../components/fragments/card";
import Hero from "../components/fragments/hero";
import Navbar from "../components/Layouts/homeNavbar";
import TitleContent from "../components/fragments/titleContent";
import LogoLoop from "../components/fragments/tools";
import Footer from "../components/Layouts/footer";

import LearnMoreIcon from "/learnMore.svg";
import LearnMoreIcon2 from "/learnMore2.svg";
import Monitoring from "../assets/img/imgMonitoring.svg";
import Manual from "../assets/img/imgManual.svg";
import Assistant from "../assets/img/imgAssistant.svg";
import Ticket from "../assets/img/imgTicket.svg";
import Suggestion from "../assets/img/imgSuggestion.svg";
import Forcasting from "../assets/img/imgForcasting.svg";
import Banner from "../components/fragments/banner";
import CaseStudyCards from "../components/fragments/CaseStudyCards";
import WorkingProcess from "../components/fragments/accordion";
import CardTeam from "../components/fragments/cardTeam";
import Testimonial from "../components/fragments/testimonial";
import Contact from "../components/fragments/contact";
import Discord from "/discord.svg";
import Booking from "/booking.svg";
import Github from "/github.svg";
import Notion from "/notion.svg";
import Tesla from "/tesla.svg";
import Amazon from "/amazon.svg";

const imageLogos = [
  {
    src: Discord,
    alt: "Company 1",
    href: "https://company1.com",
  },
  {
    src: Booking,
    alt: "Company 2",
    href: "https://company2.com",
  },
  {
    src: Github,
    alt: "Company 3",
    href: "https://company3.com",
  },
  {
    src: Notion,
    alt: "Company 4",
    href: "https://company3.com",
  },
  {
    src: Tesla,
    alt: "Company 5",
    href: "https://company3.com",
  },
  {
    src: Amazon,
    alt: "Company 5",
    href: "https://company3.com",
  },
];

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero id="#" />
      <div
        className="mb-20 md:mb-[154px]"
        style={{
          height: "auto",
          position: "relative",
          overflow: "hidden",
          width: "100%",
          maxWidth: "1440px",
          marginInline: "auto",
        }}
      >
        <LogoLoop
          logos={imageLogos}
          speed={80}
          direction="left"
          logoHeight="auto"
          gap={67}
          pauseOnHover
          scaleOnHover
          fadeOut
          fadeOutColor="#ffffff"
          ariaLabel="Technology partners"
        />
      </div>
      <TitleContent
        title={`Services`}
        title2={`At our digital marketing agency, we offer a range of services to help businesses grow and succeed online. These services include:`}
      />
      <section
        id="services"
        className="container-main flex flex-col gap-10 pt-10"
      >
        <div className="flex flex-col lg:flex-row gap-10">
          <Card
            titleBg={`bg-primary text-white`}
            background={`bg-grey`}
            colorLinkText="text-black"
            title1="Machine Health"
            title2="Monitoring"
            linkText="Learn more"
            linkIconSrc={LearnMoreIcon}
            linkMachineSrc={Monitoring}
          />
          <Card
            // widthTitle={`w-full`}
            titleBg={`bg-white text-primary`}
            background={`bg-primary`}
            title1="Manual"
            title2="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Testing"
            linkText="Learn more"
            linkIconSrc={LearnMoreIcon2}
            linkMachineSrc={Manual}
          />
        </div>
        <div className="flex flex-col-reverse lg:flex-row gap-10">
          <Card
            titleBg={`bg-white text-primary`}
            background={`bg-primary`}
            title1="Chatbot"
            title2="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Assistant"
            linkText="Learn more"
            linkIconSrc={LearnMoreIcon2}
            linkMachineSrc={Assistant}
          />
          <Card
            titleBg={`bg-primary text-white`}
            background={`bg-grey`}
            colorLinkText="text-black"
            title1="Create"
            title2="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ticket"
            linkText="Learn More"
            linkIconSrc={LearnMoreIcon}
            linkMachineSrc={Ticket}
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-10">
          <Card
            titleBg={`bg-primary text-white`}
            background={`bg-grey`}
            colorLinkText="text-black"
            title1="Recommendation"
            title2="Suggestion"
            linkText="Learn more"
            linkIconSrc={LearnMoreIcon}
            linkMachineSrc={Suggestion}
          />
          <Card
            titleBg={`bg-white text-primary`}
            background={`bg-primary`}
            title1="Risk"
            title2="Forcasting"
            linkText="Learn more"
            linkIconSrc={LearnMoreIcon2}
            linkMachineSrc={Forcasting}
          />
        </div>
      </section>
      <Banner />

      <TitleContent
        id="usecase"
        title={`Case Studies`}
        title2={`Explore Real-Life Examples of Our Proven Digital Marketing Success through Our Case Studies`}
      />
      <CaseStudyCards className={`pt-10`} />
      <TitleContent
        id="works"
        className={`max-w-[292px]!`}
        title={`Our Working Process `}
        title2={`Step-by-Step Guide to Achieving Your Business Goals`}
      />
      <WorkingProcess className={`pt-12 md:pt-20`} />
      <TitleContent
        className={`max-w-[473px]!`}
        title={`Team`}
        title2={`Meet the skilled and experienced team behind our successful digital marketing strategies`}
      />
      <CardTeam />
      <TitleContent
        className={`max-w-[473px]!`}
        title={`Testimonials`}
        title2={`Hear from Our Satisfied Clients: Read Our Testimonials to Learn More about Our Digital Marketing Services`}
      />
      <Testimonial id="testimoni" className={`pt-14 md:pt-20`} />
      <TitleContent
        className={`max-w-[323px]!`}
        title={`Contact Us`}
        title2={`Connect with Us: Let's Discuss Your Digital Marketing Needs`}
      />
      <Contact id="contact" className={`pt-20`} />
      <Footer />
    </>
  );
};

export default Home;
