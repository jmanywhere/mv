// Formik form that takes in softcap, hardcap, whitlist, token address to receive funds, minimum and maximum contribution amounts and time period for the raise

import Image from "next/image";
import { useState } from "react";
import classNames from "classnames";
import { Form, Formik } from "formik";
// Components
import FormInput from "components/generic/FormInput";
import RaiseActions from "components/raises/RaiseActions";
// Data
import { chains } from "data/chainData";
import Collapse from "components/generic/Collapse";
import SingleMultipleChoice from "components/generic/SingleMultipleChoice";
// utils
import { isMultiple } from "utils/nm";
import isPast from "date-fns/isPast";
import { useImmerAtom } from "jotai-immer";
import { raiseCreateAtom } from "data/raiseAtoms";
import { parseUnits } from "@ethersproject/units";

const RaiseSpecific = () => {
  const raiseTokens = chains[56]?.allowedTokens;
  const [showWhitelist, setShowWhitelist] = useState(false);
  const [raiseData, setRaiseData] = useImmerAtom(raiseCreateAtom);

  return (
    <Formik
      initialValues={{
        softcap: "",
        hardcap: "",
        whitelist: "", // type: "token" | "list"
        whitelistToken: "", // token address
        whitelistAmount: "", // amount of token to whitelist
        whitelistList: "", // comma separated list of addresses
        tokenSymbol: raiseTokens?.[0]?.symbol || "",
        minContribution: "",
        maxContribution: "",
        minStep: "",
        timePeriod: "1",
        startDateTime: "", // Date object
      }}
      validate={(values) => {
        const errors: any = {};
        const softCap = parseFloat(values.softcap);
        const hardCap = parseFloat(values.hardcap);
        const hasSoft = !isNaN(softCap);
        const hasHard = !isNaN(hardCap);

        if (hasSoft) {
          if (softCap > hardCap) errors.softcap = "Less than hardcap";
          if (softCap < hardCap / 2) errors.softcap = "Min 50% of hardcap";
        }
        if (!hasHard) {
          errors.hardcap = "Required";
        }
        if (!values.tokenSymbol) {
          errors.tokenSymbol = "Required";
        }
        const minPledge = parseFloat(values.minContribution);
        const maxPledge = parseFloat(values.maxContribution);
        const minStep = parseFloat(values.minStep);
        const hasMin = !isNaN(minPledge);
        const hasMax = !isNaN(maxPledge);
        const hasStep = !isNaN(minStep);
        if (hasMin && hasMax && minPledge >= maxPledge) {
          errors.minContribution = "Min. Pledge must be less than Max. Pledge";
        }
        if (hasStep && hasMin) {
          if (minStep > minPledge) errors.minStep = "Larger than Min. Pledge";
          if (!isMultiple(minPledge, minStep))
            errors.minContribution = "Not multiple of Min. Step";
        }
        if (hasStep && hasMax) {
          if (minStep >= maxPledge) errors.minStep = "> Max. Pledge";
          if (!isMultiple(maxPledge, minStep))
            errors.maxContribution = "Not a multiple of Min. Step";
        }

        if (
          !values.timePeriod ||
          isNaN(parseInt(values.timePeriod)) ||
          parseInt(values.timePeriod) < 1
        ) {
          errors.timePeriod = "Time period must be at least 1 day";
        }

        if (!values.startDateTime) {
          errors.startDateTime = "Required";
        } else {
          if (isPast(new Date(values.startDateTime)))
            errors.startDateTime = "Future only";
        }
        return errors;
      }}
      onSubmit={(values) => {
        const token = raiseTokens?.find((t) => t.symbol === values.tokenSymbol);
        if (!token) return;
        setRaiseData((draft) => {
          draft.softcap = values.softcap
            ? parseUnits("" + values.softcap, token.decimals)
            : undefined;
          draft.hardcap = parseUnits("" + values.hardcap, token.decimals);
          draft.tokenToReceive = token.address;
          draft.minContribution = values.minContribution
            ? parseUnits("" + values.minContribution, token.decimals)
            : undefined;
          draft.maxContribution = values.maxContribution
            ? parseUnits("" + values.maxContribution, token.decimals)
            : undefined;
          draft.minContributionStep = values.minStep
            ? parseUnits("" + values.minStep, token.decimals)
            : undefined;
          draft.raiseStart = new Date(values.startDateTime).getTime() / 1000; // Need to convert to seconds
          draft.raiseDuration = parseInt(values.timePeriod) * 86400;
          // TODO - whitelist
          // draft.whitelist = false;
          // draft.whitelistToken = values.whitelistToken;
          // draft.whitelistAmount = values.whitelistAmount;
          // draft.whitelistList = values.whitelistList;
        });
      }}
    >
      {({
        handleSubmit,
        values,
        setFieldValue,
        setFieldTouched,
        submitForm,
        touched,
        errors,
      }) => {
        const tokenSrc =
          "https://f004.backblazeb2.com/file/w3-assets/mv/tokens/" +
          values.tokenSymbol +
          ".png";

        const anyErrors =
          (Object.values(touched).filter((x) => x).length - 1 < 1 &&
            Object.values(values).filter((v) => !!v).length <= 2) ||
          Object.keys(errors).length > 0;

        console.log(anyErrors, errors);

        return (
          <Form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-3">
              <div>
                <label
                  className="pl-2 text-lg font-semibold"
                  htmlFor="tokenAddress"
                >
                  Raise Token
                </label>
                <br />
                <div
                  className={classNames(
                    "flex max-w-[140px] flex-row items-center justify-between",
                    "mt-2 rounded-xl border-2 bg-bg_darkest px-4 py-1 text-right",
                    "h-[38px] border-slate-500"
                  )}
                >
                  <Image
                    src={tokenSrc}
                    height={22}
                    width={22}
                    alt={values.tokenSymbol.toUpperCase() + "_token_logo"}
                  />
                  <select
                    name="tokenSymbol"
                    className={classNames(
                      "ml-4 bg-transparent focus:outline-none"
                    )}
                    onChange={(e) => {
                      setFieldValue("tokenSymbol", e.target.value, false);
                      setFieldTouched("tokenSymbol", true);
                    }}
                  >
                    {raiseTokens?.map((token) => (
                      <option key={token.symbol} value={token.symbol}>
                        {token.symbol.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <FormInput
                name="hardcap"
                type="number"
                label="Hardcap"
                required
              />
              <FormInput name="softcap" type="number" label="Softcap" />
              <FormInput
                name="minContribution"
                type="number"
                label="Min. Pledge"
              />
              <FormInput
                name="maxContribution"
                type="number"
                label="Max. Pledge"
              />
              <FormInput name="minStep" type="number" label="Min. Step" />
              <FormInput
                name="startDateTime"
                type="datetime-local"
                label="Start Date & Time"
                className="cursor-pointer"
                required
                helperText={new Date(values.startDateTime).toUTCString()}
              />
              <FormInput
                name="timePeriod"
                type="number"
                label="Duration (days)"
                className="text-right"
                required
                helperText={new Date(
                  new Date(values.startDateTime).getTime() +
                    parseInt(values.timePeriod) * 24 * 3600 * 1000
                ).toUTCString()}
              />
            </div>
            {/* <div className="mt-4 flex flex-row items-center gap-x-4">
              <legend className="text-xl font-semibold">Whitelist</legend>
              <button
                onClick={() => setShowWhitelist((p) => !p)}
                id="toggle-container"
                className={classNames(
                  "relative h-6 w-14 items-center rounded-full border-2 border-slate-600 bg-bg_darkest p-1"
                )}
              >
                <div
                  id="toggle-button"
                  className={classNames(
                    "absolute h-5 w-5 rounded-full bg-primary",
                    "transition-all duration-500",
                    "top-[0px] left-[0px]",
                    showWhitelist ? "translate-x-8" : "translate-x-0"
                  )}
                />
              </button>
            </div>
            <Collapse open={showWhitelist}>
              <div>
                <div className="pt-4">
                  <SingleMultipleChoice
                    label="Select whitelist type"
                    type="single"
                    className="ml-2"
                    onChange={(v) => {
                      setFieldValue("whitelist", v, false);
                      setFieldTouched("whitelist", true, false);
                    }}
                    options={[
                      {
                        value: "token",
                        title: "Token Held",
                        description:
                          "Addresses need to hold a specific amount of tokens, to partipate",
                      },
                      {
                        value: "list",
                        title: "List of Addresses",
                        description:
                          "Keep a list of addresses to allow them to participate",
                      },
                    ]}
                  />
                </div>
                {values.whitelist === "token" && <div>"token"</div>}
                {values.whitelist === "list" && <div>"list"</div>}
              </div>
            </Collapse> */}
            <RaiseActions disableNext={anyErrors} action={submitForm} />
          </Form>
        );
      }}
    </Formik>
  );
};

export default RaiseSpecific;
