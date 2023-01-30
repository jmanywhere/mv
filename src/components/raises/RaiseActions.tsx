import { forwardRef, useImperativeHandle } from "react";
import { useAtom } from "jotai";
import { stepAtom } from "data/raiseAtoms";
import classNames from "classnames";

type RaiseActionsProps = {
  disableNext: boolean;
  loading?: boolean;
};

export type RaiseActionsHandle = {
  next: () => void;
};

const RaiseActions = forwardRef<RaiseActionsHandle, RaiseActionsProps>(
  function RaiseActions(props, ref) {
    const { disableNext, loading } = props;
    const [step, setStep] = useAtom(stepAtom);
    const scrollTop = (fwd: boolean) => {
      window.scrollTo({ top: 60, behavior: "smooth" });
      setStep((s) => (fwd ? s + 1 : s - 1));
    };

    useImperativeHandle(ref, () => ({
      next: () => scrollTop(true),
    }));

    return (
      <div className="flex flex-row justify-between pt-6">
        {step == 1 ? (
          <div />
        ) : (
          <button
            className={classNames(
              "rounded-lg bg-slate-300 px-4 py-2 text-black hover:bg-white"
            )}
            onClick={() => scrollTop(false)}
          >
            Back
          </button>
        )}
        <button
          type="submit"
          className={classNames(
            "rounded-lg bg-primary px-4 py-2 disabled:bg-slate-600",
            loading ? "disabled:text-primary" : "disabled:text-t_dark"
          )}
          disabled={disableNext || loading}
        >
          {loading ? "..." : "Next"}
        </button>
      </div>
    );
  }
);

export default RaiseActions;
