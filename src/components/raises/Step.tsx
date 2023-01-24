// Component that has the Step number of a form
// This component contains step number and title
//  Styles change based on component props

import classNames from "classnames";
import { BsCheck } from "react-icons/bs";

const Step = (props: {
  current: number;
  number: number;
  title: string;
  setCurrent: (num: number) => void;
}) => {
  const { current, number, title } = props;
  return (
    <div className="z-20 flex w-24 flex-col items-center justify-center">
      <div
        onClick={() => {
          if (current > number) props.setCurrent(number);
        }}
        className={classNames(
          "flex h-10 w-10 items-center justify-center rounded-full border-4  text-white",
          current > number
            ? "cursor-pointer bg-primary"
            : "cursor-default bg-slate-700",
          current >= number ? "border-primary" : "border-slate-700",
          "transition-colors delay-500 duration-300"
        )}
      >
        {current > number ? <BsCheck className="path-animation" /> : number}
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
