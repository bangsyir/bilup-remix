import { forwardRef } from "react";

interface InputProps {
  id: string;
  name: string;
  type: string;
  defaultValue?: string;
  autoComplete?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

const Input = (
  {
    id,
    name,
    type,
    defaultValue,
    autoComplete,
    placeholder,
    disabled,
    error,
  }: InputProps,
  ref: any
) => {
  return (
    <input
      ref={ref}
      type={type}
      id={id}
      name={name}
      autoComplete={autoComplete}
      placeholder={placeholder}
      defaultValue={defaultValue}
      className={`relative block w-full appearance-none rounded-md border ${
        disabled && "bg-gray-200 text-gray-500"
      } ${
        error
          ? "border-red-500 focus:border-red-500"
          : "border-gray-300 focus:ring-indigo-500 focus:z-10 focus:border-indigo-500"
      } px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none  sm:text-sm`}
      disabled={disabled}
    />
  );
};

export default forwardRef(Input);
