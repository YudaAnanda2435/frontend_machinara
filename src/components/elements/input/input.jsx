import { forwardRef } from "react";

const Input = forwardRef((props, ref) => {
  const { type, placeholder, id, name } = props;
  return (
    <input
      type={type}
      name={name}
      className="text-sm border border-black outline-none rounded font-roboto w-full py-2 px-3 placeholder:opacity-50"
      placeholder={placeholder}
      id={id}
      ref={ref}
    />
  );
});

Input.displayName = "Input";
export default Input;
