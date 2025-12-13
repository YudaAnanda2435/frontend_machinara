import { forwardRef } from "react";
import Input from "./input";
import Label from "./label";

const Form = forwardRef(({ label, name, type, placeholder, id }, ref) => {
  return (
    <div className="mb-6 font-roboto!">
      <Label htmlFor={name}>{label}</Label>
      <Input
        name={name}
        type={type}
        placeholder={placeholder}
        id={id}
        ref={ref}
      />
    </div>
  );
});
Form.displayName = "Form";

export default Form;
