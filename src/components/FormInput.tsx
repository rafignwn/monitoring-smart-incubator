import { PreviewCloseOne, PreviewOpen } from "@icon-park/react";
import { HTMLInputTypeAttribute, useState } from "react";

interface FormInputProps {
  id: string;
  type?: HTMLInputTypeAttribute;
  label?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  focus?: boolean;
  defaultValue?: string | number | readonly string[];
}

export default function FormInput({
  id,
  type = "text",
  label,
  placeholder = "",
  className = "",
  required = false,
  defaultValue = "",
  disabled = false,
  focus = false,
}: FormInputProps) {
  const [show, setShow] = useState<boolean>(false);

  return (
    <div className={`w-full flex flex-col mt-8 ${className}`}>
      {label ? (
        <label htmlFor={id} className="mb-2 text-gray-800 font-semibold">
          {label}
        </label>
      ) : (
        ""
      )}
      <div className="relative w-full">
        <input
          className="w-full border border-amber-400 focus:border-2 focus:outline-none focus:border-amber-600 text-amber-700 font-medium px-4 py-3 placeholder:text-amber-500 rounded-xl"
          placeholder={placeholder}
          name={id}
          type={type === "password" && show ? "text" : type}
          id={id}
          required={required}
          defaultValue={defaultValue}
          minLength={type == "password" ? 8 : 0}
          disabled={disabled}
          autoFocus={focus}
        />

        {type === "password" ? (
          <span
            onClick={() => setShow((prev) => !prev)}
            className={`absolute right-4 top-1/2 -translate-y-1/2 ${
              show ? "text-red-600" : "text-gray-400 "
            } cursor-pointer`}
          >
            {show ? <PreviewOpen size={20} /> : <PreviewCloseOne size={20} />}
          </span>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
