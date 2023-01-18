import { useSetAtom } from "jotai";
import { stepAtom } from "data/raiseAtoms";

const RaiseActions = (props: { disableNext: boolean }) => {
  const { disableNext } = props;
  const setStep = useSetAtom(stepAtom);
  const scrollTop = (fwd: boolean) => {
    window.scrollTo({ top: 60, behavior: "smooth" });
    setStep((s) => (fwd ? s + 1 : s - 1));
  };
  return (
    <div className="flex flex-row justify-between pt-6">
      <button
        className="rounded-lg bg-slate-300 px-4 py-2 text-black hover:bg-white"
        onClick={() => scrollTop(false)}
      >
        Back
      </button>
      <button
        className="rounded-lg bg-primary px-4 py-2 disabled:bg-slate-600 disabled:text-t_dark"
        onClick={() => scrollTop(true)}
        disabled={disableNext}
      >
        Next
      </button>
    </div>
  );
};

export default RaiseActions;
