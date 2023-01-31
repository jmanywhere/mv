import classNames from "classnames";
import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { useField } from "formik";

const FormInput = (props: {
  name: string;
  align?: "right" | "left" | "center";
  label?: string | ReactNode;
  helperText?: string;
  multiline?: boolean;
  className?: string;
  containerClassName?: string;
  placeholder?: string;
  required?: boolean;
  type?: HTMLInputElement["type"];
  disableBottomMargin?: boolean;
  accept?: string;
}) => {
  const {
    required,
    placeholder = "",
    align = "left",
    label,
    helperText,
    multiline,
    className = "",
    containerClassName = "",
    type = "text",
    disableBottomMargin = false,
    accept,
  } = props;

  const [field, meta, helpers] = useField(props.name);
  const { setTouched } = helpers;

  const [focused, setFocused] = useState(false);
  const alignment = {
    right: "text-right",
    left: "text-left",
    center: "text-center",
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className={classNames("group flex flex-col", containerClassName)}>
      {label &&
        (typeof label == "string" ? (
          <label
            htmlFor={field.name}
            className="pl-2 pb-2 text-lg font-semibold"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        ) : (
          <div>{label}</div>
        ))}
      <div
        className={classNames(
          "rounded-xl border-2 bg-bg_darkest px-3 py-1 text-right ",
          meta.error && meta.touched
            ? "border-red-500"
            : focused
            ? "border-primary"
            : " border-slate-500",
          type == "color" ? "flex cursor-pointer flex-row items-center" : ""
        )}
        onClick={() => {
          inputRef.current?.focus() || taRef.current?.focus();
          if (type == "color" || type == "datetime-local")
            inputRef.current?.showPicker();
        }}
      >
        {multiline ? (
          <textarea
            ref={taRef}
            className={classNames(
              "w-full bg-transparent text-white focus:outline-none",
              alignment[align],
              className
            )}
            style={{
              height: (taRef.current?.scrollHeight || 0) + "px",
            }}
            {...field}
            placeholder={placeholder}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              setTouched(true);
            }}
          />
        ) : (
          <input
            ref={inputRef}
            className={classNames(
              "min-h-[26px] bg-transparent text-white focus:outline-none",
              type == "color" ? "w-10" : "w-full",
              alignment[align],
              className
            )}
            type={type}
            {...field}
            accept={accept}
            placeholder={placeholder}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              setTouched(true);
            }}
          />
        )}
        {type == "color" && <span className="pl-2">{field.value}</span>}
      </div>

      <span
        className={classNames(
          "ml-2 whitespace-pre text-sm",
          meta.touched && meta.error ? "text-red-500" : "text-t_dark",
          disableBottomMargin && !(meta.touched && meta.error) ? "mt-0" : "mt-2"
        )}
      >
        {helperText || (meta.touched && meta.error ? "" : " ")}
        {meta.touched &&
          meta.error &&
          (helperText ? "\n" : "") + "ERROR: " + meta.error}
      </span>
    </div>
  );
};

export default FormInput;
