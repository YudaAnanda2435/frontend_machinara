const TitleContent = ({ title, title2, className, id }) => {
  return (
    <section id={ id} className={`container-main`}>
      <div className="flex flex-col items-start md:flex-row w-full gap-4 md:gap-10 md:items-center">
        <h3
          className={`text-[22px] md:text-[40px] font-medium! text-white bg-primary card-machine__title `}
        >
          {title}
        </h3>
        <p className={`w-full max-w-[580px] ${className}`}>{title2}</p>
      </div>
    </section>
  );
};
export default TitleContent;
