// Component that receives a list of options and renders a single or multiple choice component
// type of question is determined by a prop

import classNames from "classnames";
import { useEffect } from "react";
import { useImmer } from "use-immer";

const SingleMultipleChoice = (props: {
  type: "single" | "multiple";
  label: string;
  options: Array<{ value: string; title: string; description?: string }>;
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  className?: string;
}) => {
  const {
    type,
    options,
    label,
    onChange,
    className = "",
    defaultValue,
  } = props;

  const [selected, setSelected] = useImmer<{
    [key: typeof options[number]["value"]]: boolean;
  }>(() => {
    const obj: { [key: typeof options[number]["value"]]: boolean } = {};
    const defaultExists = defaultValue && defaultValue.length > 0;
    const defaultIsArray = Array.isArray(defaultValue);
    options.forEach((option) => {
      obj[option.value] =
        defaultExists && defaultIsArray
          ? (defaultValue as string[]).includes(option.value)
          : option.value == defaultValue;
    });
    return obj;
  });

  return (
    <fieldset className={classNames("flex flex-col", className)}>
      {label && <legend className="pb-2 text-lg font-bold">{label}</legend>}
      {options.map((option, index) => {
        return (
          <button
            type="button"
            key={index}
            className={classNames(
              "flex items-start pb-3 text-left last:pb-0 hover:bg-primary/25"
            )}
            onClick={() => {
              if (onChange) {
                type == "single" && onChange(option.value);
                type == "multiple" &&
                  onChange(
                    Object.keys(selected).filter((key) => selected[key])
                  );
              }
              setSelected((draft) => {
                if (type == "multiple")
                  draft[option.value] = !draft[option.value];
                else {
                  const keys = Object.keys(draft);
                  keys.forEach((key) => {
                    draft[key] = key == option.value;
                  });
                }
              });
            }}
          >
            {type == "single" ? (
              <input
                readOnly
                type="radio"
                id={`choice-${index}=${option.value}`}
                checked={selected[option.value]}
                className="mt-[6.5px] cursor-pointer"
              />
            ) : (
              <input
                readOnly
                type="checkbox"
                className="mt-[6.5px] cursor-pointer"
                checked={selected[option.value]}
              />
            )}

            <label className="ml-2" htmlFor={`choice-${index}=${option.value}`}>
              <p
                className={classNames(
                  "cursor-pointer",
                  selected[option.value]
                    ? "font-bold text-primary"
                    : "font-normal text-white"
                )}
              >
                {option.title}
              </p>
              {option.description && (
                <p className="cursor-pointer text-sm text-t_dark">
                  {option.description}
                </p>
              )}
            </label>
          </button>
        );
      })}
    </fieldset>
  );
};

export default SingleMultipleChoice;
