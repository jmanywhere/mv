import classNames from "classnames";
import type { ReactNode } from "react";

const Tooltip = (props: {
  children: ReactNode;
  text: string;
  position?: "top" | "bottom";
}) => {
  const { children, text, position = "top" } = props;

  return (
    <>
      <div className="group relative">
        {children}
        <div
          className={classNames(
            "whitespace-nowrap rounded-3xl bg-slate-700 px-4 py-2 text-sm",
            (position == "top" && "aft-top-tooltip tooltip-top") ||
              (position == "bottom" && "aft-bottom-tooltip tooltip-bottom"),
            "tooltip-text",
            "text-center opacity-0 transition-opacity ease-in group-hover:opacity-100"
          )}
        >
          {text}
        </div>
      </div>
    </>
  );
};

export default Tooltip;
