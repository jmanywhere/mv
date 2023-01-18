// Component that receives a list of options and renders a single or multiple choice component
// type of question is determined by a prop

import classNames from "classnames";
import { useEffect } from "react";
import { useImmer } from "use-immer";

const SingleMultipleChoice = (props: {
  type: "single" | "multiple";
  label: string;
  options: Array<{ value: string; title: string; description?: string }>;
  onChange?: (value: string | string[]) => void;
  className?: string;
}) => {
  const { type, options, label, onChange, className = "" } = props;

  const [selected, setSelected] = useImmer<{
    [key: typeof options[number]["value"]]: boolean;
  }>(() => {
    const obj: { [key: typeof options[number]["value"]]: boolean } = {};
    options.forEach((option) => {
      obj[option.value] = false;
    });
    return obj;
  });

  return (
    <fieldset className={classNames("flex flex-col", className)}>
      {label && <legend className="pb-2 text-lg font-bold">{label}</legend>}
      {options.map((option, index) => {
        return (
          <div key={index} className={classNames("flex items-start pb-3")}>
            {type == "single" ? (
              <input
                type="radio"
                name="choice"
                id={`choice-${index}=${option.value}`}
                value={option.value}
                checked={selected[option.value]}
                className="mt-[6.5px] cursor-pointer"
                onChange={() => {
                  onChange && onChange(option.value);
                  setSelected((draft) => {
                    const keys = Object.keys(draft);
                    keys.forEach((key) => {
                      draft[key] = key == option.value;
                    });
                  });
                }}
              />
            ) : (
              <input
                type="checkbox"
                name="choice"
                className="mt-[6.5px] cursor-pointer"
                checked={selected[option.value]}
                onChange={() => {
                  onChange &&
                    onChange(
                      Object.keys(selected).filter((key) => selected[key])
                    );
                  setSelected((draft) => {
                    draft[option.value] = !draft[option.value];
                  });
                }}
              />
            )}

            <label className="ml-2" htmlFor={`choice-${index}=${option.value}`}>
              <p
                onClick={() =>
                  setSelected((draft) => {
                    if (type == "multiple")
                      draft[option.value] = !draft[option.value];
                    else {
                      const keys = Object.keys(draft);
                      keys.forEach((key) => {
                        draft[key] = key == option.value;
                      });
                    }
                  })
                }
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
                <p className="text-sm text-t_dark">{option.description}</p>
              )}
            </label>
          </div>
        );
      })}
    </fieldset>
  );
};

export default SingleMultipleChoice;
