import Rasyid from "../../assets/img/rasyid.svg";
import KpsRasyid from "/kpsRasyid.svg";
import KpsYuda from "/kpsYuda.svg";
import KpsErwin from "/kpsErwin.svg";
import KpsReinhand from "/kpsReinhand.svg";
import KpsJesika from "/kpsJesika.svg";
import Yuda from "../../assets/img/yuda.svg";
import Erwin from "../../assets/img/erwin.svg";
import Reinhand from "../../assets/img/reinhand.svg";
import Jesika from "../../assets/img/jesika.svg";
import Linkedin from "/linkedin.svg";

const CardTeam = () => {
  return (
    <section className="container-main gap-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-10 md:mt-10 mb-24 md:mb-[186px]">
      {/* CARD 1: Rasyid */}
      {/* 1. Tambahkan 'group' di div pembungkus utama card */}
      <div className="profile-card group">
        <div className="profile-card__header ">
          <img
            className="profile-card__avatar grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500 ease-in-out"
            src={Rasyid}
            alt=""
          />
          <div className="profile-card__info">
            <figure className="profile-card__socials">
              {/* 2. Tambahkan class grayscale dan transisi pada gambar KPS */}
              <img src={KpsRasyid} alt="" className="" />
              <img src={Linkedin} alt="" />
            </figure>
            <div className="profile-card__meta">
              <h4 className="profile-card__name">Rasyid Naufal</h4>
              <p className="profile-card__title">Backend Developer</p>
            </div>
          </div>
        </div>
        <div className="profile-card__divider"></div>
        <p className="profile-card__description">
          3+ tahun pengalaman sebagai Project Lead. Certified Data Scientist dan
          ML Engineer. Bertanggung jawab penuh pada arsitektur backend yang
          highly scalable dan keamanan API.
        </p>
      </div>

      {/* CARD 2: Erwin */}
      <div className="profile-card group">
        <div className="profile-card__header ">
          <img
            className="profile-card__avatar grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500 ease-in-out"
            src={Erwin}
            alt=""
          />
          <div className="profile-card__info">
            <figure className="profile-card__socials">
              {/* Tambahkan class di sini */}
              <img src={KpsErwin} alt="" className="" />
              <img src={Linkedin} alt="" />
            </figure>
            <div className="profile-card__meta">
              <h4 className="profile-card__name">Muhamad Erwin H.</h4>
              <p className="profile-card__title">Machine Learning</p>
            </div>
          </div>
        </div>
        <div className="profile-card__divider"></div>
        <p className="profile-card__description">
          Spesialis integrasi AI dan Penalaran (Inference) data. Ahli menalarkan
          output model dengan prinsip-prinsip Fisika untuk akurasi. Menggunakan
          MLOps untuk deployment berlatensi rendah dan real-time.
        </p>
      </div>

      {/* CARD 3: Reinhand */}
      <div className="profile-card group">
        <div className="profile-card__header ">
          <img
            className="profile-card__avatar grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500 ease-in-out"
            src={Reinhand}
            alt=""
          />
          <div className="profile-card__info">
            <figure className="profile-card__socials">
              <img src={KpsReinhand} alt="" className="" />
              <img src={Linkedin} alt="" />
            </figure>
            <div className="profile-card__meta">
              <h4 className="profile-card__name">Reinhard Prasetya</h4>
              <p className="profile-card__title">Backend Developer</p>
            </div>
          </div>
        </div>
        <div className="profile-card__divider"></div>
        <p className="profile-card__description">
          Spesialis implementasi Autentikasi & Otorisasi (OAuth 2.0, JWT). Fokus
          pada pembangunan middleware keamanan yang tangguh. Ahli dalam
          pengujian menyeluruh (unit & integration testing) backend.
        </p>
      </div>

      {/* CARD 4: Yuda */}
      <div className="profile-card group">
        <div className="profile-card__header ">
          <img
            className="profile-card__avatar grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500 ease-in-out"
            src={Yuda}
            alt=""
          />
          <div className="profile-card__info">
            <figure className="profile-card__socials">
              <img src={KpsYuda} alt="" className="" />
              <img src={Linkedin} alt="" />
            </figure>
            <div className="profile-card__meta">
              <h4 className="profile-card__name">Yuda Ananda</h4>
              <p className="profile-card__title">Frontend Developer</p>
            </div>
          </div>
        </div>
        <div className="profile-card__divider"></div>
        <p className="profile-card__description">
          Spesialis frontend mahir menerjemahkan desain kompleks menjadi UI/UX
          yang interaktif dan responsif. Memastikan User Experience (UX) optimal
          dan performa loading halaman yang cepat.
        </p>
      </div>

      {/* CARD 5: Jesika */}
      <div className="profile-card group">
        <div className="profile-card__header ">
          <img
            className="profile-card__avatar grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500 ease-in-out"
            src={Jesika}
            alt=""
          />
          <div className="profile-card__info">
            <figure className="profile-card__socials">
              <img src={KpsJesika} alt="" className="" />
              <img src={Linkedin} alt="" />
            </figure>
            <div className="profile-card__meta">
              <h4 className="profile-card__name">Jesika Yudiani P.</h4>
              <p className="profile-card__title">Machine Learning</p>
            </div>
          </div>
        </div>
        <div className="profile-card__divider"></div>
        <p className="profile-card__description">
          Fokus utama pada pembangunan dan pelatihan model prediktif inovatif.
          Mahir dalam data preprocessing, feature engineering, dan evaluasi
          model.
        </p>
      </div>

      {/* CARD 6: Rasyid (Lagi) */}
      {/* <div className="profile-card group">
        <div className="profile-card__header ">
          <img
            className="profile-card__avatar grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500 ease-in-out"
            src={Rasyid}
            alt=""
          />
          <div className="profile-card__info">
            <figure className="profile-card__socials">
              <img src={KpsRasyid} alt="" className="" />
              <img src={Linkedin} alt="" />
            </figure>
            <div className="profile-card__meta">
              <h4 className="profile-card__name">Rasyid Naufal</h4>
              <p className="profile-card__title">Backend Developer</p>
            </div>
          </div>
        </div>
        <div className="profile-card__divider"></div>
        <p className="profile-card__description">
          7+ years of experience in project management and team leadership.
          Strong organizational and communication skills
        </p>
      </div> */}
    </section>
  );
};

export default CardTeam;
