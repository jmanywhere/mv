// Component that has the Step number of a form
// This component contains step number and title
//  Styles change based on component props

import classNames from "classnames";

const Step = (props: { current: number; number: number; title: string }) => {
  const { current, number, title } = props;
  return (
    <div className="z-20 flex w-24 flex-col items-center justify-center">
      <div
        className={classNames(
          "flex h-10 w-10 items-center justify-center rounded-full border-4  text-white",
          current > number ? "bg-primary" : "bg-slate-700",
          current >= number ? "border-primary" : "border-slate-700",
          "transition-colors delay-500 duration-300"
        )}
      >
        {number}
      </div>
      <h4
        className={classNames(
          "pt-2 text-center text-xs sm:text-sm",
          current < number
            ? "text-t_dark"
            : current > number
            ? "text-green_accent"
            : "text-white",
          current == number ? "font-bold" : "font-light"
        )}
      >
        {title}
      </h4>
    </div>
  );
};

export default Step;
