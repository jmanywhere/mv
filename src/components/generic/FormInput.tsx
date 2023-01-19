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
}) => {
  const {
    placeholder = "",
    align = "left",
    label,
    helperText,
    multiline,
    className = "",
    containerClassName = "",
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
            {label}
          </label>
        ) : (
          <div>{label}</div>
        ))}
      <div
        className={classNames(
          "rounded-xl border-2 bg-bg_darkest px-3 py-1 text-right",
          meta.error && meta.touched
            ? "border-red-500"
            : focused
            ? "border-primary"
            : " border-slate-500"
        )}
        onClick={() => inputRef.current?.focus() || taRef.current?.focus()}
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
              "w-full bg-transparent text-white focus:outline-none",
              alignment[align],
              className
            )}
            {...field}
            placeholder={placeholder}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              setTouched(true);
            }}
          />
        )}
      </div>
      {(helperText || meta.error) && (
        <span
          className={classNames(
            "ml-2 mt-2 whitespace-pre text-sm",
            meta.error ? "text-red-500" : "text-t_dark"
          )}
        >
          {helperText}
          {meta.error && "\nERROR: " + meta.error}
        </span>
      )}
    </div>
  );
};

export default FormInput;
