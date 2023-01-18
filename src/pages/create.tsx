import type { NextPage } from "next";
import { useState } from "react";
// components
import Layout from "components/Layout";
import RaiseBasic from "components/create/RaiseBasic";
import Step from "components/raises/Step";
import classNames from "classnames";

const Create: NextPage = () => {
  const [step, setStep] = useState(2);

  return (
    <Layout title="Create your Raise">
      <div className="flex w-full items-center justify-center py-8 px-6 text-white">
        {/* CARD CONTAINER */}
        <div className=" w-full max-w-[830px] rounded-3xl bg-bg_f_light px-7 pt-6 pb-5 md:px-12 md:pt-12 md:pb-9">
          <h1 className="text-xl font-bold md:text-3xl">Create a Raise</h1>
          <div className="relative">
            <meter
              value={step - 1}
              max={4}
              className={classNames(
                "meter-step absolute top-[32px] right-12 z-10 h-2 w-[calc(100%-96px)]"
              )}
            />
            <div className="flex flex-row items-center justify-between py-4">
              <Step current={step} number={1} title="Basics" />
              <Step current={step} number={2} title="Raise" />
              <Step current={step} number={3} title="Customize" />
              <Step current={step} number={4} title="Extras" />
              <Step current={step} number={5} title="Complete" />
            </div>
          </div>
          <div className="w-full">
            {step == 0 && <RaiseBasic />}
            {step == 1 && <RaiseBasic />}
            {step == 2 && <RaiseBasic />}
            {step == 3 && <RaiseBasic />}
            {step == 4 && <RaiseBasic />}
          </div>
          <div className="flex flex-row justify-between pt-6">
            <button
              className="rounded-lg bg-slate-600 px-4 py-2"
              onClick={() => setStep((s) => s - 1)}
            >
              Back
            </button>
            <button
              className="rounded-lg bg-primary px-4 py-2"
              onClick={() => setStep((s) => s + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Create;
