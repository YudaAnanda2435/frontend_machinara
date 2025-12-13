const Label = ({ htmlFor, children }) => {
  return (
    <label htmlFor={htmlFor} className="block font-roboto! text-sm font-semibold mb-2">
      {children}
    </label>
  );
};

export default Label;
