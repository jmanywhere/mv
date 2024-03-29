import type { NextPage } from "next";
// components
import Layout from "components/Layout";
import RaiseBasic from "components/create/RaiseBasic";
import Step from "components/raises/Step";
import classNames from "classnames";
import { useAtom } from "jotai";
import { stepAtom } from "data/raiseAtoms";
import RaiseSpecific from "components/create/RaiseSpecific";
import RaiseCustomization from "components/create/RaiseCustomization";
import RaiseActions from "components/raises/RaiseActions";
import { useEagerConnect } from "hooks/useAuth";
import Checkout from "components/create/Checkout";

const Create: NextPage = () => {
  const [step, setStep] = useAtom(stepAtom);
  useEagerConnect();
  const stepTitle = [
    "-",
    "Create a Raise",
    "Add your essence",
    "Numbers incoming",
    "Check everything",
    "Success",
  ];
  return (
    <Layout title="Create your Raise">
      <div className="flex w-full items-center justify-center py-8 px-6 text-white">
        {/* CARD CONTAINER */}
        <div className=" w-full max-w-[830px] rounded-3xl bg-bg_darkest px-7 pt-6 pb-5 md:px-12 md:pt-12 md:pb-9">
          <h1 className="pb-6 text-xl font-bold md:text-3xl">
            {stepTitle[step]}
          </h1>
          <div className="relative">
            <meter
              value={step - 1}
              max={4}
              className={classNames(
                "meter-step absolute top-[32px] right-8 z-10 h-2 w-[calc(100%-64px)] sm:right-12 sm:w-[calc(100%-96px)]"
              )}
            />
            <div className="flex flex-row items-center justify-between py-4">
              <Step
                setCurrent={setStep}
                current={step}
                number={1}
                title="Basics"
              />
              <Step
                setCurrent={setStep}
                current={step}
                number={2}
                title="Customize"
              />
              <Step
                setCurrent={setStep}
                current={step}
                number={3}
                title="Raise"
              />
              <Step
                setCurrent={setStep}
                current={step}
                number={4}
                title="Checkout"
              />
              <Step
                setCurrent={setStep}
                current={step}
                number={5}
                title="Complete"
              />
            </div>
          </div>
          <div className="w-full pt-6">
            {step == 1 && <RaiseBasic />}
            {step == 2 && <RaiseCustomization />}
            {step == 3 && <RaiseSpecific />}
            {step == 4 && <Checkout />}
            {step == 5 && <RaiseActions disableNext={false} />}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Create;
