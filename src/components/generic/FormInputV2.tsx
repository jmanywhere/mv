import classNames from "classnames";
import React, { useCallback, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useController, type UseControllerProps } from "react-hook-form";
const FormInput = (
  props: {
    align?: "right" | "left" | "center";
    label?: string | ReactNode;
    helperText?: string;
    multiline?: boolean;
    className?: string;
    containerClassName?: string;
    placeholder?: string;
    type?: HTMLInputElement["type"];
    disableBottomMargin?: boolean;
    accept?: string;
    disableSelectAllOnFocus?: boolean;
    labelCss?: string;
  } & UseControllerProps<any>
) => {
  const {
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
    name,
    rules,
    defaultValue,
    control,
    disableSelectAllOnFocus,
    labelCss,
  } = props;

  const {
    field,
    fieldState: { invalid, isTouched, error },
  } = useController({ name, rules, defaultValue, control });

  const [focused, setFocused] = useState(false);
  const alignment = {
    right: "text-right",
    left: "text-left",
    center: "text-center",
  };

  const inputRef = useRef<HTMLInputElement | null>(null);
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const setRef = (elm: HTMLInputElement | HTMLTextAreaElement | null) => {
    if (!elm) return;
    if (multiline) taRef.current = elm as HTMLTextAreaElement;
    else inputRef.current = elm as HTMLInputElement;
    field.ref(elm);
  };

  return (
    <div className={classNames("group flex flex-col", containerClassName)}>
      {label &&
        (typeof label == "string" ? (
          <label
            htmlFor={field.name}
            className={classNames(
              "pl-2 pb-2",
              labelCss || "text-lg font-semibold"
            )}
          >
            {label} {rules?.required && <span className="text-red-500">*</span>}
          </label>
        ) : (
          label
        ))}
      <div
        className={classNames(
          "rounded-xl border-2 bg-bg_darkest px-3 py-1 text-right ",
          invalid && isTouched
            ? "border-red-500"
            : focused
            ? "border-primary"
            : " border-slate-500",
          type == "color" ? "flex cursor-pointer flex-row items-center" : ""
        )}
        onClick={() => {
          taRef.current?.focus();
          inputRef.current?.focus();
          if (type == "color" || type == "datetime-local")
            inputRef.current?.showPicker();
        }}
      >
        {multiline ? (
          <textarea
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
            onFocus={(e) => {
              setFocused(true);
              if (disableSelectAllOnFocus) return;
              e.target.select();
            }}
          />
        ) : (
          <input
            className={classNames(
              "min-h-[26px] bg-transparent text-white focus:outline-none",
              type == "color" ? "w-10" : "w-full",
              alignment[align],
              className
            )}
            type={type}
            accept={accept}
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            ref={setRef}
            placeholder={placeholder}
            onFocus={(e) => {
              setFocused(true);
              if (disableSelectAllOnFocus) return;
              e.target.select();
            }}
            onBlur={(e) => {
              setFocused(false);
              field.onBlur();
            }}
          />
        )}
        {type == "color" && <span className="pl-2">{field.value}</span>}
      </div>

      <span
        className={classNames(
          "ml-2 whitespace-pre text-sm",
          isTouched && invalid ? "text-red-500" : "text-t_dark",
          disableBottomMargin && !(isTouched && invalid) ? "mt-0" : "mt-2"
        )}
      >
        {helperText || (isTouched && invalid ? "" : " ")}
        {isTouched &&
          invalid &&
          (helperText ? "\n" : "") + "ERROR: " + error?.message}
      </span>
    </div>
  );
};

export default FormInput;
