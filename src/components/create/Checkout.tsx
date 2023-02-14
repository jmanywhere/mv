import { useRef } from "react";
import RaiseActions, {
  type RaiseActionsHandle,
} from "components/raises/RaiseActions";
import { raiseCreateAtom } from "data/raiseAtoms";
import { useImmerAtom } from "jotai-immer";
import { prettyBN } from "utils/bn";
import { chains } from "data/chainData";
import format from "date-fns/format";
import { useImmer } from "use-immer";
import Collapse from "components/generic/Collapse";
import classNames from "classnames";
// Icons
import { AiOutlineArrowDown } from "react-icons/ai";
import { HiWrenchScrewdriver } from "react-icons/hi2";
import { useForm, type SubmitHandler } from "react-hook-form";
import Checkbox from "components/generic/Checkbox";
import { useWeb3React } from "@web3-react/core";

import { hashMessage, recoverAddress } from "ethers/lib/utils";

type CheckoutForm = {
  pricing: number;
  security: {
    audit: boolean;
  };
  public: boolean;
  terms: string | null;
};

const messageToSign =
  "I accept the terms and conditions of MoonVector and take full responsibility over the raise and am fully liable for any repercussions that may arise from it.";

const prices = [
  {
    amount: 2000,
    successFee: 1,
    transferFee: 0,
  },
  {
    amount: 1000,
    successFee: 2,
    transferFee: 0,
  },
  {
    amount: 500,
    successFee: 4,
    transferFee: 0,
  },
  {
    amount: 200,
    successFee: 5,
    transferFee: 1,
  },
  {
    amount: 100,
    successFee: 7,
    transferFee: 2,
  },
  {
    amount: 0,
    successFee: 15,
    transferFee: 10,
  },
];

const charityPricing = {
  amount: 0,
  successFee: 0,
  transferFee: 4,
  transferFeeExtra: 5,
};

const Checkout = () => {
  const { library, account } = useWeb3React();
  const actionsRef = useRef<RaiseActionsHandle>(null);
  const [raise, setRaise] = useImmerAtom(raiseCreateAtom);
  const [collapsed, setCollapsed] = useImmer({
    details: true,
    customization: true,
    marketing: false,
    security: true,
    extras: true,
  });

  const chain = chains[raise.chainId];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CheckoutForm>({
    mode: "onChange",
    defaultValues: {
      pricing: 0,
      security: {
        audit: false,
      },
      public: false,
      terms: null,
    },
  });

  const submit: SubmitHandler<CheckoutForm> = (data) => {
    console.log("submit data", data);
    // actionsRef.current?.next();
  };

  register("terms", {
    validate: {
      correctlySigned: async (value) => {
        if (!library || !value) return "Please sign the message to continue";
        const signer = await recoverAddress(hashMessage(messageToSign), value);
        return signer === account || "Invalid signer";
      },
    },
  });

  const selectedPrice =
    raise.type === "charity" ? charityPricing : prices[watch("pricing") - 1];

  return (
    <form onSubmit={handleSubmit(submit)}>
      <h5 className="pb-4 text-center text-2xl font-semibold">
        {raise.name} Raise
      </h5>

      {raise.type !== "charity" && (
        <>
          <h6 className="mb-4 text-xl font-bold">Select your raise tier</h6>
          <div
            className={classNames(
              "mt-2 mb-4 h-[38px] max-w-[320px] rounded-xl border-2 bg-bg_darkest px-4 py-1 text-right",
              errors.pricing ? "border-red-500" : "border-slate-500"
            )}
          >
            <select
              className={classNames(" bg-transparent focus:outline-none")}
              {...register("pricing", {
                required: true,
              })}
            >
              <option value={0} disabled>
                Select the Create Tier
              </option>
              {prices.map((price, index) => (
                <option key={index} value={index + 1}>
                  <>
                    {price.amount} {chain?.defaultStable?.toUpperCase()} +{" "}
                    {price.successFee}% Success Fee
                  </>
                </option>
              ))}
            </select>
          </div>
        </>
      )}
      {(selectedPrice?.transferFee || 0) > 0 && (
        <p className="pt-2 text-sm text-slate-400">
          {selectedPrice?.transferFee}% transfer fee is taken on each pledge,
          this amount counts as part of the success fee.
        </p>
      )}

      <button
        type="button"
        className="mb-6 flex w-full flex-row justify-between rounded-t-2xl border-b-2 border-primary/75 p-4 hover:bg-primary/25"
        onClick={() =>
          setCollapsed((draft) => {
            draft.details = !draft.details;
          })
        }
      >
        <h6 className="text-xl font-bold">Raise Details</h6>
        <AiOutlineArrowDown
          className={classNames(
            "text-xl transition-transform",
            collapsed.details ? "rotate-180" : "rotate-0"
          )}
        />
      </button>
      <Collapse open={collapsed.details}>
        <div className="flex w-full flex-col items-center pb-8">
          <table className="w-full table-auto overflow-hidden rounded-t-xl md:w-[70%]">
            <thead>
              <tr className="bg-bg_darkest">
                <th className="py-4">Item</th>
                <th className="py-4">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t-2 border-b-2 border-slate-400/50 hover:bg-bg_darkest hover:text-primary">
                <td className="py-2 pl-5">Raise Chain</td>
                <td className="py-2 pr-5 text-right">
                  {raise.chainId} - {chain?.name}
                </td>
              </tr>
              <tr className="border-t-2 border-b-2 border-slate-400/50 hover:bg-bg_darkest hover:text-primary">
                <td className="py-2 pl-5">Raise Token</td>
                <td className="py-2 pr-5 text-right">
                  {chain?.allowedTokens
                    .find((x) => x.address === raise.tokenToReceive)
                    ?.symbol.toUpperCase()}
                </td>
              </tr>
              <tr className="border-t-2 border-slate-400/50 hover:bg-bg_darkest hover:text-primary">
                <td className="whitespace-pre-line py-2 pl-5">
                  Hardcap
                  {raise.hardcap?.gt(0) && (
                    <>
                      {(selectedPrice?.successFee || 0) > 0 && (
                        <span className="text-sm text-t_dark">
                          {"\n"}&nbsp;&nbsp;&nbsp;&nbsp;Success Fee
                        </span>
                      )}
                      {(selectedPrice?.transferFee || 0) > 0 && (
                        <span className="text-sm text-t_dark">
                          {"\n"}&nbsp;&nbsp;&nbsp;&nbsp;Transfer Fee
                        </span>
                      )}
                      <span className="text-sm text-green_accent">
                        {"\n"}&nbsp;&nbsp;&nbsp;&nbsp;Project
                      </span>
                    </>
                  )}
                </td>
                <td className="whitespace-pre-line py-2 pr-5 text-right">
                  {raise.hardcap?.gt(0)
                    ? prettyBN(raise.hardcap)
                    : "No hardcap"}
                  {raise.hardcap?.gt(0) && (
                    <>
                      {(selectedPrice?.successFee || 0) > 0 && (
                        <span className="text-sm text-t_dark">
                          {"\n"}&nbsp;&nbsp;&nbsp;&nbsp;
                          {prettyBN(
                            raise.hardcap
                              .mul(selectedPrice?.successFee || "0")
                              .div(100)
                              .sub(
                                raise.hardcap
                                  .mul(selectedPrice?.transferFee || "0")
                                  .div(100)
                              )
                          )}
                        </span>
                      )}
                      {(selectedPrice?.transferFee || 0) > 0 && (
                        <span className="text-sm text-t_dark">
                          {"\n"}&nbsp;&nbsp;&nbsp;&nbsp;
                          {prettyBN(
                            raise.hardcap
                              .mul(selectedPrice?.transferFee || "0")
                              .div(100)
                          )}
                        </span>
                      )}
                      <span className="text-sm text-green_accent">
                        {"\n"}&nbsp;&nbsp;&nbsp;&nbsp;
                        {prettyBN(
                          raise.hardcap.sub(
                            raise.hardcap
                              .mul(
                                selectedPrice?.successFee ||
                                  selectedPrice?.transferFee ||
                                  "0"
                              )
                              .div(100)
                          )
                        )}
                      </span>
                    </>
                  )}
                </td>
              </tr>
              <tr className="border-t-2 border-slate-400/50 hover:bg-bg_darkest hover:text-primary">
                <td className="whitespace-pre-line py-2 pl-5">
                  Softcap
                  {raise.softcap?.gt(0) && (
                    <>
                      {(selectedPrice?.successFee || 0) > 0 && (
                        <span className="text-sm text-t_dark">
                          {"\n"}&nbsp;&nbsp;&nbsp;&nbsp;Success Fee
                        </span>
                      )}
                      {(selectedPrice?.transferFee || 0) > 0 && (
                        <span className="text-sm text-t_dark">
                          {"\n"}&nbsp;&nbsp;&nbsp;&nbsp;Transfer Fee
                        </span>
                      )}
                      <span className="text-sm text-green_accent">
                        {"\n"}&nbsp;&nbsp;&nbsp;&nbsp;Project
                      </span>
                    </>
                  )}
                </td>
                <td className="whitespace-pre-line py-2 pr-5 text-right">
                  {raise.softcap?.gt(0)
                    ? prettyBN(raise.softcap)
                    : "No softcap"}
                  {raise.softcap?.gt(0) && (
                    <>
                      {(selectedPrice?.successFee || 0) > 0 && (
                        <span className="text-sm text-t_dark">
                          {"\n"}&nbsp;&nbsp;&nbsp;&nbsp;
                          {prettyBN(
                            raise.softcap
                              .mul(selectedPrice?.successFee || "0")
                              .div(100)
                              .sub(
                                raise.softcap
                                  .mul(selectedPrice?.transferFee || "0")
                                  .div(100)
                              )
                          )}
                        </span>
                      )}
                      {(selectedPrice?.transferFee || 0) > 0 && (
                        <span className="text-sm text-t_dark">
                          {"\n"}&nbsp;&nbsp;&nbsp;&nbsp;
                          {prettyBN(
                            raise.softcap
                              .mul(selectedPrice?.transferFee || "0")
                              .div(100)
                          )}
                        </span>
                      )}
                      <span className="text-sm text-green_accent">
                        {"\n"}&nbsp;&nbsp;&nbsp;&nbsp;
                        {prettyBN(
                          raise.softcap.sub(
                            raise.softcap
                              .mul(
                                selectedPrice?.successFee ||
                                  selectedPrice?.transferFee ||
                                  "0"
                              )
                              .div(100)
                          )
                        )}
                      </span>
                    </>
                  )}
                </td>
              </tr>
              <tr className="border-t-2 border-b-2 border-slate-400/50 hover:bg-bg_darkest hover:text-primary">
                <td className="py-2 pl-5">Min. Contribution</td>
                <td className="py-2 pr-5 text-right">
                  {raise.minContribution
                    ? prettyBN(raise.minContribution)
                    : "-"}
                </td>
              </tr>
              <tr className="border-t-2 border-b-2 border-slate-400/50 hover:bg-bg_darkest hover:text-primary">
                <td className="py-2 pl-5">Max. Contribution</td>
                <td className="py-2 pr-5 text-right">
                  {raise.maxContribution
                    ? prettyBN(raise.maxContribution)
                    : "-"}
                </td>
              </tr>
              {/* <tr className="border-t-2 border-b-2 border-slate-400/50 hover:bg-bg_darkest hover:text-primary">
                <td className="py-2 pl-5">Step Contribution</td>
                <td className="py-2 pr-5 text-right">
                  {raise.minContributionStep
                    ? prettyBN(raise.minContributionStep)
                    : "-"}
                </td>
              </tr> */}
              <tr className="border-t-2 border-b-2 border-slate-400/50 hover:bg-bg_darkest hover:text-primary">
                <td className="py-2 pl-5">Start Date</td>
                <td className="py-2 pr-5 text-right">
                  {raise.raiseStart
                    ? format(
                        new Date(raise.raiseStart * 1000),
                        "dd - MMM - yyyy HH:mm zzz"
                      )
                    : "-"}
                </td>
              </tr>
              <tr className="border-t-2 border-b-2 border-slate-400/50 hover:bg-bg_darkest hover:text-primary">
                <td className="py-2 pl-5">Raise Duration</td>
                <td className="py-2 pr-5 text-right">
                  {raise.raiseDuration
                    ? raise.raiseDuration / (24 * 3600) + " days"
                    : "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Collapse>
      <button
        type="button"
        className={classNames(
          "flex w-full flex-row justify-between rounded-t-2xl border-b-2 border-primary/75 p-4 transition-[margin] delay-200 hover:bg-primary/25",
          collapsed.customization ? "mb-0" : "mb-6"
        )}
        onClick={() =>
          setCollapsed((draft) => {
            draft.customization = !draft.customization;
          })
        }
      >
        <h6 className="text-xl font-bold">Customization</h6>
        <AiOutlineArrowDown
          className={classNames(
            "text-xl transition-transform",
            collapsed.customization ? "rotate-180" : "rotate-0"
          )}
        />
      </button>
      <Collapse open={collapsed.customization}>
        <div
          className="flex w-full flex-col items-center pb-8 pt-6"
          style={{ backgroundColor: raise.backgroundColor }}
        >
          <table className="w-full table-auto overflow-hidden rounded-t-xl bg-b_dark md:w-[70%]">
            <thead>
              <tr className="bg-bg_darkest">
                <th className="py-4">Item</th>
                <th className="py-4">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className={"border-t-2 border-b-2 border-slate-400/50"}>
                <td className="py-2 pl-5">Background Color</td>
                <td className="py-2 pr-5 text-right">
                  {raise.backgroundColor}
                </td>
              </tr>
              <tr
                className="border-t-2 border-b-2 border-slate-400/50 hover:bg-bg_darkest hover:text-primary"
                style={{ backgroundColor: raise.primaryColor }}
              >
                <td className="py-2 pl-5">Primary Color</td>
                <td className="py-2 pr-5 text-right">{raise.primaryColor}</td>
              </tr>
              <tr
                className="border-t-2 border-b-2 border-slate-400/50 hover:bg-bg_darkest hover:text-primary"
                style={{ backgroundColor: raise.secondaryColor }}
              >
                <td className="py-2 pl-5">Secondary Color</td>
                <td className="py-2 pr-5 text-right">{raise.secondaryColor}</td>
              </tr>
              <tr className="border-t-2 border-b-2 border-slate-400/50 hover:bg-bg_darkest hover:text-primary">
                <td className="py-2 pl-5">Logo</td>
                <td className="flex items-end justify-end py-2 pr-5 text-right">
                  <img
                    src={raise.logo}
                    className="h-24 w-24"
                    alt="Raise Logo"
                  />
                </td>
              </tr>
              <tr className="border-b-0 border-slate-400/50 hover:bg-bg_darkest hover:text-primary">
                <td className="py-2 pl-5 text-center" colSpan={2}>
                  Banner
                </td>
              </tr>
              <tr className=" border-b-2 border-slate-400/50 hover:bg-bg_darkest hover:text-primary">
                <td colSpan={2}>
                  <img
                    src={raise.banner}
                    className="w-full"
                    alt="Raise Banner"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Collapse>
      <button
        type="button"
        className="mb-6 flex w-full flex-row justify-between rounded-t-2xl border-b-2 border-primary/75 p-4 "
        onClick={() =>
          setCollapsed((draft) => {
            draft.marketing = !draft.marketing;
          })
        }
        disabled
      >
        <h6 className="text-left text-xl font-bold text-t_dark">
          Marketing & Ads{" "}
          <span className="whitespace-pre-line text-sm sm:whitespace-normal">
            {"\n"}(Coming soon)
          </span>
        </h6>
        {false && (
          <AiOutlineArrowDown
            className={classNames(
              "text-xl transition-transform",
              collapsed.marketing ? "rotate-180" : "rotate-0"
            )}
          />
        )}
      </button>
      <Collapse open={collapsed.marketing}>
        <h6 className="text-center font-bold">Coming soon</h6>
      </Collapse>
      <button
        type="button"
        className="mb-6 flex w-full flex-row justify-between rounded-t-2xl border-b-2 border-primary/75 p-4 hover:bg-primary/25"
        onClick={() =>
          setCollapsed((draft) => {
            draft.security = !draft.security;
          })
        }
      >
        <h6 className="text-xl font-bold">Dev & Security</h6>
        <AiOutlineArrowDown
          className={classNames(
            "text-xl transition-transform",
            collapsed.security ? "rotate-180" : "rotate-0"
          )}
        />
      </button>
      <Collapse open={collapsed.security}>
        <div className="flex items-center justify-center pb-6">
          <fieldset className="min-w-[80%]">
            <legend className="pb-2">Need any help with development?</legend>
            <div className="flex flex-row items-start justify-between gap-x-2 md:items-center">
              <div className="pt-1 md:pt-0">
                <HiWrenchScrewdriver className="text-3xl" />
              </div>
              <div>
                <label
                  htmlFor="auditCheckbox"
                  className="whitespace-pre-line md:whitespace-normal"
                >
                  Audit 1 contract{"\n"}(
                  <span
                    className={
                      watch("security.audit")
                        ? "text-green_accent"
                        : "text-white"
                    }
                  >
                    +500 {chain?.defaultStable?.toUpperCase()}
                  </span>
                  )
                  <br />
                  <span className="text-sm text-t_dark">
                    I would like to hire an auditor to review one of my smart
                    contracts
                  </span>
                </label>
              </div>
              <div className="pt-1 md:pt-0">
                <Checkbox
                  {...register("security.audit", { required: false })}
                />
              </div>
            </div>
          </fieldset>
        </div>
      </Collapse>
      <button
        type="button"
        className="mb-6 flex w-full flex-row justify-between rounded-t-2xl border-b-2 border-primary/75 p-4 hover:bg-primary/25"
        onClick={() =>
          setCollapsed((draft) => {
            draft.extras = !draft.extras;
          })
        }
      >
        <h6 className="text-xl font-bold">Extras</h6>
        <AiOutlineArrowDown
          className={classNames(
            "text-xl transition-transform",
            collapsed.extras ? "rotate-180" : "rotate-0"
          )}
        />
      </button>
      <h6 className="mb-6 border-b-2 border-primary/75 p-4 text-xl font-bold">
        Checkout
      </h6>
      <div className="mx-auto max-w-[80%] pb-6">
        <div className="flex flex-row items-center justify-between gap-x-3 pb-2">
          <label htmlFor="terms" className="text-sm">
            Would you like to show the raise in the aggregator to allow other
            investors to join?
          </label>
          <div>
            <Checkbox {...register("public")} />
          </div>
        </div>
        <div className="flex flex-row items-center justify-between gap-x-3">
          <label htmlFor="terms" className="text-sm">
            I accept the{" "}
            <span className="text-primary underline">Terms and Conditions</span>{" "}
            and take full responsibility over the raise and it&apos;s contents
            recognizing that it will be hosted on the MoonVector website.
          </label>
          <div>
            <Checkbox
              checked={!!watch("terms")}
              onChange={(e) => {
                if (!library || !e.target.checked) {
                  setValue("terms", null, {
                    shouldValidate: true,
                    shouldTouch: true,
                  });
                  return;
                }
                const signer = library.getSigner();
                signer
                  .signMessage(messageToSign)
                  .then((signature: string) => {
                    setValue("terms", signature, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  })
                  .catch((err: any) => {
                    console.error(err);
                    setValue("terms", null, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  });
              }}
            />
          </div>
        </div>
        <div className="text-red-400">{errors.terms?.message}</div>
      </div>
      <RaiseActions
        disableNext={!isValid}
        loading={isSubmitting}
        ref={actionsRef}
      />
    </form>
  );
};

export default Checkout;
