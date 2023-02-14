import { forwardRef } from "react";
import { FaCheck } from "react-icons/fa";

const Checkbox = forwardRef<
  HTMLInputElement,
  {
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    name?: string;
    checked?: boolean;
  }
>(function Checkbox(props, ref) {
  return (
    <div className="relative flex h-6 w-6 cursor-pointer items-center justify-center">
      <input
        name={props.name}
        type="checkbox"
        className="peer absolute z-[1] h-full w-full cursor-pointer opacity-0"
        onChange={props.onChange}
        onBlur={props.onBlur}
        ref={ref}
        checked={props.checked}
      />
      <FaCheck className="invisible text-green_accent peer-checked:visible" />
      <div className="absolute h-full w-full cursor-pointer rounded-md border-2 border-slate-500 text-primary  peer-checked:border-green_accent peer-focus:border-primary" />
    </div>
  );
});

export default Checkbox;
