// Formik form that takes in softcap, hardcap, whitlist, token address to receive funds, minimum and maximum contribution amounts and time period for the raise

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
// Form Stuff
import { useForm } from "react-hook-form";
// Components
// import FormInput from "components/generic/FormInput";
import FormInput from "components/generic/FormInputV2";
import RaiseActions, {
  type RaiseActionsHandle,
} from "components/raises/RaiseActions";
// Data
import { chains } from "data/chainData";
import Collapse from "components/generic/Collapse";
import SingleMultipleChoice from "components/generic/SingleMultipleChoice";
// utils
import { isMultiple } from "utils/nm";
import isPast from "date-fns/isPast";
import { useImmerAtom } from "jotai-immer";
import { raiseCreateAtom } from "data/raiseAtoms";
import { formatEther, parseUnits } from "@ethersproject/units";
import formatISO9075 from "date-fns/formatISO9075";
import { useWeb3React } from "@web3-react/core";
import { useImmer } from "use-immer";

type SpecificRaiseType = {
  softcap: string;
  hardcap: string;
  whitelist?: "token" | "list";
  whitelistToken: string;
  whitelistAmount: string;
  whitelistList: string;
  tokenSymbol: string;
  minContribution: string;
  maxContribution: string;
  minStep: string;
  timePeriod: string;
  chainId: number;
  startDateTime: string;
};
type SpecificRaiseErrorType = {
  softcap?: string;
  hardcap?: string;
  whitelist?: string;
  whitelistToken?: string;
  whitelistAmount?: string;
  whitelistList?: string;
  tokenSymbol?: string;
  minContribution?: string;
  maxContribution?: string;
  minStep?: string;
  timePeriod?: string;
  chainId?: string;
  startDateTime?: string;
};

const RaiseSpecific = () => {
  const { chainId, account } = useWeb3React();

  const [showWhitelist, setShowWhitelist] = useState(false);
  const [raiseData, setRaiseData] = useImmerAtom(raiseCreateAtom);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SpecificRaiseType>({
    mode: "onChange",
    defaultValues: {
      softcap: raiseData.softcap ? formatEther(raiseData.softcap) : "",
      hardcap: raiseData.hardcap ? formatEther(raiseData.hardcap) : "",
      whitelistToken: "", // token address
      whitelistAmount: "", // amount of token to whitelist
      whitelistList: "", // comma separated list of addresses
      tokenSymbol: raiseData.tokenToReceive
        ? chains[raiseData.chainId]?.allowedTokens?.find(
            (x) => x.address === raiseData.tokenToReceive
          )?.symbol || ""
        : "",
      minContribution: raiseData.minContribution
        ? formatEther(raiseData.minContribution)
        : "",
      maxContribution: raiseData.maxContribution
        ? formatEther(raiseData.maxContribution)
        : "",
      minStep: raiseData.minContributionStep
        ? formatEther(raiseData.minContributionStep)
        : "",
      timePeriod: raiseData.raiseDuration
        ? Math.floor(raiseData.raiseDuration / 86400).toString()
        : "1",
      chainId: chainId && chains[chainId] ? chainId : 0,
      startDateTime:
        (raiseData.raiseStart &&
          formatISO9075(new Date(raiseData.raiseStart * 1000))) ||
        "", // Date object
    },
  });

  const raiseTokens = (
    (raiseData.chainId &&
      (chains[raiseData.chainId] ? chains[raiseData.chainId] : null)) ||
    chains[watch("chainId")]
  )?.allowedTokens;

  const submit = useCallback(
    (data: SpecificRaiseType) => {
      const token = raiseTokens?.find((t) => t.symbol === data.tokenSymbol);
      if (!token) return;
      setRaiseData((draft) => {
        draft.softcap = data.softcap
          ? parseUnits("" + data.softcap, token.decimals)
          : undefined;
        draft.hardcap = parseUnits("" + data.hardcap, token.decimals);
        draft.tokenToReceive = token.address;
        draft.minContribution = data.minContribution
          ? parseUnits("" + data.minContribution, token.decimals)
          : undefined;
        draft.maxContribution = data.maxContribution
          ? parseUnits("" + data.maxContribution, token.decimals)
          : undefined;
        draft.minContributionStep = data.minStep
          ? parseUnits("" + data.minStep, token.decimals)
          : undefined;
        draft.raiseStart = Math.floor(
          new Date(data.startDateTime).getTime() / 1000
        ); // Need to convert to seconds
        draft.raiseDuration = parseInt(data.timePeriod) * 86400;
        // TODO - whitelist
        // draft.whitelist = false;
        // draft.whitelistToken = specific.whitelistToken;
        // draft.whitelistAmount = specific.whitelistAmount;
        // draft.whitelistList = specific.whitelistList;
      });
      actionsRef.current?.next();
    },
    [setRaiseData, raiseTokens]
  );

  const tokenSrc = watch("tokenSymbol")
    ? "https://f004.backblazeb2.com/file/w3-assets/mv/tokens/" +
      watch("tokenSymbol") +
      ".png"
    : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

  const chainSrc =
    chains[watch("chainId")]?.icon || "/images/alt/blank chain.png";
  const chainKeys = Object.keys(chains).map((x) => parseInt(x));

  useEffect(() => {
    if (account || chainId) trigger("chainId");
  }, [trigger, chainId, account]);

  const actionsRef = useRef<RaiseActionsHandle>(null);

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className="flex flex-col items-start gap-x-2 pb-3 md:flex-row md:items-end">
        <div>
          <label className="pl-2 text-lg font-semibold" htmlFor="tokenAddress">
            Chain
          </label>
          <br />
          <div
            className={classNames(
              "flex max-w-[210px] flex-row items-center justify-between",
              "mt-2 rounded-xl border-2 bg-bg_darkest px-4 py-1 text-right",
              "h-[38px]",
              errors.chainId ? "border-red-500" : "border-slate-500"
            )}
          >
            <Image
              src={chainSrc}
              height={22}
              width={22}
              alt={(watch("chainId") || "") + "_chain_logo"}
            />
            <select
              className={classNames("ml-2 bg-transparent focus:outline-none")}
              {...register("chainId", {
                required: true,
                onChange: () => {
                  setValue("tokenSymbol", "");
                },
                validate: {
                  connected: () => !!chainId || "Please connect wallet",
                  sameChain: (v) => {
                    console.log("validate", v, chainId);
                    return (
                      parseInt(v + "") === chainId ||
                      "Switch to the selected chain"
                    );
                  },
                },
              })}
            >
              <option value={0} disabled className="min-w-[80px]">
                Select Chain
              </option>
              {chainKeys?.map((cId) => {
                if (!chains[cId]) return null;

                return (
                  <option key={`${chains[cId]?.name}-chain-${cId}`} value={cId}>
                    {chains[cId]?.name} ({cId})
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="ml-3 pt-1 text-sm text-red-500 md:pb-2">
          {errors.chainId?.message}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-3">
        <div>
          <label className="pl-2 text-lg font-semibold" htmlFor="tokenAddress">
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
              alt={(watch("tokenSymbol") || "") + "_token_logo"}
              className="min-w-[22px]"
            />
            <select
              className={classNames("ml-4 bg-transparent focus:outline-none")}
              {...register("tokenSymbol", {
                required: true,
                validate: {
                  onChain: (v) => {
                    const token = raiseTokens?.find((t) => t.symbol === v);
                    if (!token) return "Token not found";
                    return true;
                  },
                },
              })}
            >
              <option value="" disabled className="min-w-[80px]">
                N/A&nbsp;&nbsp;&nbsp;&nbsp;
              </option>
              {raiseTokens?.map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol.toUpperCase()}
                </option>
              ))}
            </select>
            <div className="ml-3 pt-1 text-sm text-red-500 md:pb-2">
              {errors.tokenSymbol?.message}
            </div>
          </div>
        </div>
        <FormInput
          type="number"
          label="Hardcap"
          name="hardcap"
          control={control}
          rules={{
            required: true,
          }}
        />
        <FormInput
          name="softcap"
          type="number"
          label="Softcap"
          control={control}
          rules={{
            required: false,
            validate: {
              lessThanHardcap: (v) => {
                const sc = parseFloat(v);
                if (isNaN(sc) || sc === 0) return true;
                return (
                  sc >= parseFloat(watch("hardcap")) / 2 ||
                  "Min. half of Hardcap"
                );
              },
            },
          }}
        />
        <FormInput
          name="minContribution"
          type="number"
          label="Min. Pledge"
          control={control}
          rules={{
            validate: {
              lessThanMax: (v) => {
                const mc = parseFloat(v);
                if (isNaN(mc) || mc === 0) return true;
                return (
                  mc <= parseFloat(watch("maxContribution")) ||
                  "Min. less than Max."
                );
              },
              isStep: (v) => {
                const mc = parseFloat(v);
                const step = parseFloat(watch("minStep"));
                if (isNaN(mc) || mc === 0 || isNaN(step) || step == 0)
                  return true;
                return mc % step === 0 || "Min. is a multiple of Min. Step";
              },
            },
          }}
        />
        <FormInput
          name="maxContribution"
          type="number"
          label="Max. Pledge"
          control={control}
          rules={{
            validate: {
              moreThanMin: (v) => {
                const mc = parseFloat(v);
                if (isNaN(mc) || mc === 0) return true;
                return (
                  mc >= parseFloat(watch("minContribution")) ||
                  "Max. greater than Min."
                );
              },
              isStep: (v) => {
                const mc = parseFloat(v);
                const step = parseFloat(watch("minStep"));
                if (isNaN(mc) || mc === 0 || isNaN(step) || step == 0)
                  return true;
                return mc % step === 0 || "Max. is a multiple of Min. Step";
              },
            },
          }}
        />
        <FormInput
          name="minStep"
          type="number"
          label="Min. Step"
          control={control}
        />
        <FormInput
          name="startDateTime"
          type="datetime-local"
          label="Start Date & Time"
          className="cursor-pointer"
          control={control}
          helperText={new Date(watch("startDateTime")).toUTCString()}
          rules={{
            required: true,
            validate: {
              future: (v) => {
                const d = new Date(v);
                return d.getTime() > Date.now() || "Start date in the future";
              },
            },
          }}
        />
        <FormInput
          name="timePeriod"
          type="number"
          label="Duration (days)"
          className="text-right"
          control={control}
          helperText={new Date(
            new Date(watch("startDateTime")).getTime() +
              parseInt(watch("timePeriod")) * 24 * 3600 * 1000
          ).toUTCString()}
          rules={{
            required: true,
            validate: {
              min: (v) => {
                const d = parseInt(v);
                return d >= 1 || "Min. 1 day";
              },
            },
          }}
        />
      </div>
      {/* 
      TODO:
      NOTE ON THE WHITELIST IMPLEMENTATION, THIS IS STILL MISSING UPGRADE TO THE NEW FORM FIELDS AND UPGRADE TO USING REACT-FORM-HOOKS INSTEAD OF FORMIK
      <div className="mt-4 flex flex-row items-center gap-x-4">
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
                {specific.whitelist === "token" && <div>"token"</div>}
                {specific.whitelist === "list" && <div>"list"</div>}
              </div>
            </Collapse> */}
      <RaiseActions
        disableNext={!isValid}
        loading={isSubmitting}
        ref={actionsRef}
      />
    </form>
  );
};

export default RaiseSpecific;
