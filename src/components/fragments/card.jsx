const Card = ({ title1, title2, colorLinkText = "text-white", linkText, linkIconSrc, linkMachineSrc, background, titleBg, widthTitle }) => {
  return (
    <div className={`card-machine ${background}`}>
      <div className="card-machine__content">
        <div className="card-machine__title-wrapper">
          <h3 className={`card-machine__title ${titleBg}`}>{title1}</h3>
          <h3 className={`card-machine__title ${widthTitle} ${titleBg}`}>
            {title2}
          </h3>
        </div>
        <div className="card-machine__link group">
          <img className="card-machine__link-icon" src={linkIconSrc} alt="" />
          <p className={`${colorLinkText}`}>{linkText}</p>
        </div>
      </div>
      <img className="card-machine__illustration" src={linkMachineSrc} alt="" />
    </div>
  );
};
export default Card;
