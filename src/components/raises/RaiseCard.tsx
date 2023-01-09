import { useState, useMemo, useCallback, useEffect } from "react";
import { useImmer } from "use-immer";
// Next
import Image from "next/image";
import { useRouter } from "next/router";
// Data stuff
import { useSetAtom } from "jotai";
import { connectModal } from "data/atoms";
// Web3 stuff
import { useWeb3React } from "@web3-react/core";
// hooks
import { useAuth } from "hooks/useAuth";
// utils
import classNames from "classnames";
// Icons
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { BiCopyAlt } from "react-icons/bi";
import { isAddress, parseEther } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { prettyBN } from "utils/bn";
import Tooltip from "components/generic/Tooltip";

const RaiseCard = (props: RaiseCardProps) => {
  const {
    title = "MoonVector",
    subtitle = "Crowdfunding",
    iconLogo = "/logo/logo_icon_primary.svg",
    contract = "",
    chain = 56,
  } = props;

  const setOpenConnectModal = useSetAtom(connectModal);
  const { account } = useWeb3React();
  const { logout } = useAuth();

  const router = useRouter();
  // We'll use static for one Time only Fetches
  const [staticSaleData, setStaticSaleData] = useState({
    pledgeTokenAddress: "",
    pledgeTokenName: "BUSD",
    rewardTokenAddress: "",
    rewardTokenName: "BUSD",
    softcap: parseEther("0"),
    hardcap: parseEther("0"),
  });
  const [currentSaleData, setCurrentSaleData] = useState({
    userPledged: BigNumber.from("0"),
    totalPledged: parseEther("0"),
    referrals: 0,
    tokensPerETH: BigNumber.from("0"),
    userWalletBalance: BigNumber.from("0"),
    referredBy: "",
    saleStatus: "PENDING",
    saleEnd: new Date("2023-01-08T00:00:00"),
  });
  const [tempFlags, setTempFlags] = useImmer({
    showRef: false,
    copySuccess: false,
  });
  const [referral, setReferral] = useState("");
  const validReferral = referral.length > 0 ? isAddress(referral) : true;
  const showRefLink = useMemo(
    () => currentSaleData.userPledged.gt(0),
    [currentSaleData.userPledged]
  );

  const [pledgeAmount, setPledgeAmount] = useState(parseEther("0"));

  // TODOs
  // After wallet is connected show the wallet and balance of fund types it has.
  // Probably will need to change the button for two textfields, address button will disconnect user

  // Sale Status (whitelist, started, ended)
  // Total Raise - amount raised. Use default chain rpc to get the data.

  // Need softcap and hardcap values
  // User set goal if no hardcap(?)
  // If no softcap, use hardcap only. If no hardcap a softcap MUST be set.
  // Excess of softcap (if no hardcap) will be the new 100%, will need to change bg of progress bar
  // to make sure it reflects that raise has gone beyond expectation.

  // Reward area Data
  // Let's standardize contract call value so that both MoonVector and Regular raise data can be shown.

  // const whitelisted = useMemo( () => {
  //    return true if sale_status = whiteslist and user is whitelisted OR sale_status = started ELSE false
  // },[])

  const referralCode = useMemo(() => {
    if (!account) return "";
    return `https://moonvector.io${router.asPath}?ref=${account}`;
  }, [router, account]);

  const copyReferral = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setTempFlags((draft) => {
        draft.copySuccess = true;
      });
    } catch (e) {
      console.log(e);
    }
  }, [referralCode, setTempFlags]);

  const rewardAmount = useMemo(() => {
    return currentSaleData.tokensPerETH
      .mul(currentSaleData.userPledged)
      .div(parseEther("1"));
  }, [currentSaleData]);

  return (
    <div className="rounded-3xl bg-bg_f_light px-9 py-8">
      <div className="flex flex-col items-center justify-center gap-y-6 gap-x-6 pb-6 md:flex-row">
        <div className="flex items-center justify-center rounded-full border-2 border-dividers bg-bg_darkest p-5">
          <Image
            src={iconLogo}
            height={60}
            width={60}
            alt={`${title}-Icon-Logo`}
          />
        </div>
        <div className="flex-grow text-center md:text-left">
          <div className="text-2xl font-bold">{title}</div>
          <div className="text-base font-semibold">{subtitle}</div>
        </div>
        <Tooltip text={account ? "Disconnect" : "Connect"} position="bottom">
          <button
            className={classNames(
              "rounded-xl bg-t_dark px-7 py-5",
              account
                ? "bg-t_dark hover:bg-primary"
                : "bg-primary hover:bg-t_dark"
            )}
            onClick={() => (account ? logout() : setOpenConnectModal(true))}
          >
            {account
              ? account.slice(0, 4) +
                "..." +
                account.slice(account.length - 4, account.length)
              : "Connect Wallet"}
          </button>
        </Tooltip>
      </div>
      <div className="flex flex-col gap-4 border-t-2 border-b-2 border-dividers py-6 md:flex-row">
        <div className="w-full font-semibold md:w-[35%]">
          <div className="flex flex-row justify-between">
            <span className="flex-grow text-t_dark md:w-28 md:flex-none">
              Sale Status
            </span>
            <span className="flex-none text-left uppercase md:flex-grow">
              Started
            </span>
          </div>
          <div className="mt-4 flex flex-row justify-between">
            <span className="flex-grow text-t_dark md:w-28 md:flex-none">
              Raised
            </span>
            <span className="flex-none text-left md:flex-grow">
              <Tooltip
                position="bottom"
                text={prettyBN(currentSaleData.totalPledged)}
              >
                {prettyBN(currentSaleData.totalPledged, 2)}{" "}
                {staticSaleData.pledgeTokenName}
              </Tooltip>
            </span>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex flex-row gap-x-1 font-semibold text-t_dark">
            {prettyBN(currentSaleData.totalPledged, 2)} /{" "}
            {prettyBN(
              staticSaleData.hardcap.isZero()
                ? staticSaleData.softcap
                : staticSaleData.hardcap,
              2
            )}
          </div>
          <progress
            value={60}
            max={100}
            className="raise-progress mt-6 w-full"
          />
        </div>
      </div>
      {/* INPUT AND ACTION */}
      <div className="grid auto-rows-auto grid-cols-1 items-center pt-6 pb-0 md:grid-cols-3 md:flex-row md:items-end md:justify-start">
        {/* ReferralInput */}
        <div className="order-3 col-span-2 flex flex-grow flex-col md:order-1 md:pb-3">
          <div className="flex w-full flex-row items-center justify-between gap-2 pb-2 md:w-[420px]">
            <label
              id="referral-id"
              htmlFor="referral_input"
              className="pl-2 font-semibold"
            >
              Referral
            </label>
            {currentSaleData.userPledged.gt(0) && (
              <div className="flex flex-row items-center gap-x-2">
                <span className="">Your link :</span>
                <Tooltip
                  text={
                    tempFlags.copySuccess ? "Copied!" : "Copy Referral Link"
                  }
                >
                  <button
                    onClick={copyReferral}
                    name="copy-ref-link"
                    className="peer rounded-full bg-primary/30 p-2 text-xs font-light text-white hover:bg-primary/80"
                    onMouseLeave={() =>
                      tempFlags.copySuccess &&
                      setTimeout(
                        () =>
                          setTempFlags((draft) => {
                            draft.copySuccess = false;
                          }),
                        200
                      )
                    }
                  >
                    <BiCopyAlt className="text-lg" />
                  </button>
                </Tooltip>
                <Tooltip text={tempFlags.showRef ? "Hide Link" : "Show Link"}>
                  <button
                    name="referral-show-btn"
                    className="peer rounded-full bg-primary/30 p-2 text-xs font-light text-white hover:bg-primary/80"
                    onClick={() =>
                      setTempFlags((draft) => {
                        draft.showRef = !draft.showRef;
                      })
                    }
                  >
                    {tempFlags.showRef ? (
                      <AiOutlineEye className="text-lg" />
                    ) : (
                      <AiOutlineEyeInvisible className="text-lg" />
                    )}
                  </button>
                </Tooltip>
              </div>
            )}
          </div>
          <input
            name="referral_input"
            className={classNames(
              "w-full rounded-xl border-2 bg-bg_darkest px-3 py-1 text-right md:w-[420px]",
              validReferral
                ? "border-b_dark"
                : "border-red-400 focus:outline-red-500"
            )}
            onFocus={(e) => e.target.select()}
            onChange={(e) => setReferral(e.target.value)}
          />
          <div
            className={classNames(
              "select-text whitespace-normal break-words pt-2 text-sm font-light md:whitespace-nowrap",
              tempFlags.showRef ? "block" : "hidden"
            )}
          >
            {referralCode}
          </div>
        </div>
        {/* LABEL AND INPUT */}
        <div className="order-1 col-span-1 flex flex-grow flex-col md:order-3 md:col-span-2">
          <label
            id="pledge-id"
            htmlFor="pledge"
            className="pl-2 pb-3 font-semibold"
          >
            Pledge {staticSaleData.pledgeTokenName}
          </label>
          <div className="flex flex-col gap-1">
            <input
              name="pledge"
              type="number"
              onFocus={(e) => e.target.select()}
              onChange={(e) => {
                const pA = parseFloat(e.target.value);
                if (isNaN(pA) || pA < 0) {
                  e.target.value = "";
                  setPledgeAmount(parseEther("0"));
                  return;
                }
                setPledgeAmount(parseEther(e.target.value));
              }}
              className="w-full rounded-xl border-2 border-b_dark bg-bg_darkest px-3 py-1 text-right md:w-[420px]"
            />
            <span className="w-full pr-2 text-right text-sm font-normal text-t_dark md:w-[400px]">
              {prettyBN(currentSaleData.userWalletBalance, 4)} in Wallet
            </span>
          </div>
        </div>
        {/* Pledge Action */}
        <div className="order-4 mt-6 flex justify-center md:mt-0 md:justify-end">
          <button
            className=" mb-[20px] w-32 rounded-xl bg-primary py-[10px]"
            // disabled={!whitelisted}
          >
            {"Pledge"}
            {/* {whitelisted ? (approved ? "Pledge" : "Approve") : "Whitelist"} */}
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end py-9 md:flex-row md:justify-between">
        <div className="w-full flex-grow font-semibold">
          <div className="mt-4 flex flex-row justify-between">
            <span className="flex-grow text-t_dark md:w-60 md:flex-none">
              Softcap
            </span>
            <span className="flex-none text-left md:flex-grow">
              {prettyBN(staticSaleData.softcap, 4)}{" "}
              {staticSaleData.pledgeTokenName}
            </span>
          </div>
          {staticSaleData.hardcap.gt(0) && (
            <div className="mt-4 flex flex-row justify-between">
              <span className="flex-grow text-t_dark md:w-60 md:flex-none">
                Hardcap
              </span>
              <span className="flex-none text-left md:flex-grow">
                {prettyBN(staticSaleData.hardcap, 4)}{" "}
                {staticSaleData.pledgeTokenName}
              </span>
            </div>
          )}
          <div className="mt-4 flex flex-row justify-between">
            <span className="flex-grow text-t_dark md:w-60 md:flex-none">
              Pledged
            </span>
            <span className="flex-none text-left md:flex-grow">
              {prettyBN(currentSaleData.userPledged, 4)}{" "}
              {staticSaleData.pledgeTokenName}
            </span>
          </div>
          <div className="mt-4 flex flex-row justify-between">
            <span className="flex-grow text-t_dark md:w-60 md:flex-none">
              Referrals
            </span>
            <span className="flex-none text-left md:flex-grow">
              {currentSaleData.referrals}
            </span>
          </div>
          <div className="mt-4 flex flex-col justify-between md:flex-row">
            <span className="flex-grow text-xl text-t_dark md:w-60 md:flex-none">
              Rewarded Amount
            </span>
            <span className="mt-1 flex-none text-right text-xl md:mt-0 md:flex-grow md:text-left">
              {prettyBN(rewardAmount, 4)} {staticSaleData.rewardTokenName}
            </span>
          </div>
        </div>
        <div className="mt-6 md:mt-0">
          {/* Conditionally render depending if rewards are available */}
          <button
            className=" w-32 rounded-xl bg-primary py-[10px] disabled:bg-t_dark"
            disabled
          >
            {"Claim"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RaiseCard;

type RaiseCardProps = {
  title: string;
  subtitle: string;
  iconLogo?: string;
  contract: string;
  chain: number;
};
