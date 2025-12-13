import Facebook from "../../assets/img/facebook.svg";
import Twiter from "../../assets/img/twiter.svg";
import Linkedin from "../../assets/img/linkedin.svg";

const Footer = () => {
  return (
    <section className="container-main">
      <div className="bg-[#191A23] rounded-t-[45px] w-full p-5 md:px-[60px] md:py-[50px] flex flex-col gap-[45px]">
        <div className="flex flex-col md:flex-row w-full items-start gap-3 md:gap-0 md:items-center justify-between text-white!">
          <h3 className="text-[#D9D9D9] text-[30px]">Machinara</h3>
          <ul className="flex flex-col md:flex-row gap-2 md:gap-10 underline-offset-2 underline">
            <li>About us</li>
            <li>Services</li>
            <li>Use Cases</li>
            <li>Pricing</li>
            <li>Blog</li>
          </ul>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between w-full">
          <div className="flex flex-col mb-8 lg:mb-0 text-white gap-[27px]">
            <h3 className="text-black bg-white rounded-[7px] text-[20px] font-medium px-[7px] w-fit">
              Contact us:
            </h3>
            <p className="text-white">Enail: machinarainfo@gmail.com</p>
            <p className="text-white">Phone: 0896-5991-8449</p>
            <div>
              <p className="text-white"> Address: 1234 Main St</p>
              <p className="text-white">Moonstone City, Stardust State 12345</p>
            </div>
          </div>
          <div className="px-6 py-8 md:px-10 md:py-[58px] bg-[#292A32] justify-between rounded-[14px] gap-5 flex flex-col sm:flex-row">
            <input
              className="text-white px-[18px] py-3 md:px-[25px] lg:px-[35px] lg:py-[22px] rounded-[14px] border border-white"
              type="text"
              placeholder="Email"
            />
            <button className="text-black cursor-pointer bg-[#ECECEC] px-[18px] py-3 md:px-[25px] lg:px-[35px] lg:py-[22px] rounded-[14px]">
              Subscribe to get PRO
            </button>
          </div>
        </div>
        <div className="w-full h-px bg-white"></div>
        <div className="flex flex-col gap-6 md:flex-row justify-between items-start md:items-center">
          <div className="flex flex-col md:flex-row gap-[30px]">
            <p className="text-white">
              © 2025 Machianara. All Rights Reserved.
            </p>
            <p className="text-white underline-offset-2 underline">
              Privacy Policy
            </p>
          </div>
          <figure className="flex  flex-row gap-[30px]">
            <img className="cursor-pointer up-scale" src={Linkedin} alt="icon linkedin" />
            <img className="cursor-pointer up-scale" src={Facebook} alt="icon facebook" />
            <img className="cursor-pointer up-scale" src={Twiter} alt="icon twiter" />
          </figure>
        </div>
      </div>
    </section>
  );
};

export default Footer;
