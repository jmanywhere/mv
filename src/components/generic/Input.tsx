import classNames from "classnames";
import { useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

const Input = (props: {
  align?: "right" | "left" | "center";
  label?: string | ReactNode;
  helperText?: string;
  multiline?: boolean;
  className?: string;
  containerClassName?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  value?: string;
  error?: string;
}) => {
  const {
    align = "left",
    label,
    helperText,
    multiline,
    className = "",
    containerClassName = "",
    placeholder,
    value,
    onChange,
    error,
  } = props;
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
            htmlFor="form-input"
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
          error
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
            name="form-input"
            className={classNames(
              "w-full bg-transparent text-white focus:outline-none",
              alignment[align],
              className
            )}
            style={{
              height: (taRef.current?.scrollHeight || 0) + "px",
            }}
            onChange={(e) => onChange && onChange(e.target?.value || "")}
            value={value}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        ) : (
          <input
            ref={inputRef}
            name="form-input"
            className={classNames(
              "w-full bg-transparent text-white focus:outline-none",
              alignment[align],
              className
            )}
            placeholder={placeholder}
            onChange={(e) => onChange && onChange(e.target?.value || "")}
            value={value}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        )}
      </div>
      {(helperText || error) && (
        <span
          className={classNames(
            "ml-2 mt-2 text-sm",
            error ? "text-red-500" : "text-t_dark"
          )}
        >
          {helperText}
          {error && " ERROR:" + error}
        </span>
      )}
    </div>
  );
};

export default Input;
