import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useImmer } from "use-immer";
// Next
import Image from "next/image";
import { useRouter } from "next/router";
// Data stuff
import { useSetAtom } from "jotai";
import { connectModal, txQueue } from "data/atoms";
// Web3 stuff
import { useWeb3React } from "@web3-react/core";
import { isAddress, parseEther } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { AddressZero } from "@ethersproject/constants";
// hooks
import { useAuth } from "hooks/useAuth";
import useContract from "hooks/useContracts";
// utils
import classNames from "classnames";
import { prettyBN } from "utils/bn";
// Icons
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { BiCopyAlt } from "react-icons/bi";
// Components
import Tooltip from "components/generic/Tooltip";

const RaiseCard = (props: RaiseCardProps) => {
  const {
    title,
    subtitle,
    iconLogo = "/logo/logo_icon_primary.svg",
    contract,
    chain,
  } = props;

  const setOpenConnectModal = useSetAtom(connectModal);
  const { account, chainId } = useWeb3React();
  const { logout } = useAuth();

  const router = useRouter();
  const setTxQueue = useSetAtom(txQueue);
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
    saleStatus: "In progress",
    saleEnd: new Date("2023-01-08T00:00:00"),
    allowance: parseEther("0"),
    rewarded: BigNumber.from("0"),
  });
  const [tempFlags, setTempFlags] = useImmer({
    showRef: false,
    copySuccess: false,
    pledgeLoad: false,
    claimLoad: false,
  });
  const [referral, setReferral] = useState((router.query.ref as string) || "");
  const validReferral = referral.length > 0 ? isAddress(referral) : true;

  const [pledgeAmount, setPledgeAmount] = useState(parseEther("0"));
  const pledgeInput = useRef<HTMLInputElement>(null);

  const { reader, writer } = useContract(contract, chain, "MVRaise");
  const { reader: tokenReader, writer: tokenWriter } = useContract(
    staticSaleData.pledgeTokenAddress || null,
    chain,
    "ERC20"
  );

  const getData = useCallback(async () => {
    if (!reader) return;
    const data = await reader.raiseStatus(account || AddressZero);
    // get token name somewhere around here
    setStaticSaleData({
      pledgeTokenAddress: data.tokens[0],
      pledgeTokenName: "BUSD",
      rewardTokenAddress: data.tokens[1],
      rewardTokenName: "MVS",
      softcap: data.numStats[0],
      hardcap: data.numStats[1],
    });
    const pledge = await reader.pledges(account || AddressZero);
    let bal = parseEther("0");
    let allowance = parseEther("0");
    if (tokenReader && account) {
      bal = await tokenReader.balanceOf(account);
      allowance = account
        ? await tokenReader.allowance(account, reader.address)
        : parseEther("0");
    }
    setCurrentSaleData({
      userPledged: data.numStats[3],
      totalPledged: data.numStats[4],
      referrals: data.numStats[6],
      tokensPerETH: data.numStats[2],
      userWalletBalance: bal,
      referredBy: pledge.referrer,
      saleStatus: data.numStats[1].sub(data.numStats[4]).gt(0)
        ? "In progress"
        : "Complete",
      saleEnd: new Date(0),
      allowance,
      rewarded: data.numStats[9],
    });
  }, [reader, account, tokenReader, setCurrentSaleData, setStaticSaleData]);

  useEffect(() => {
    if (!staticSaleData.pledgeTokenAddress) getData();
    const interval = setInterval(getData, 5000);
    return () => clearInterval(interval);
  }, [getData, staticSaleData.pledgeTokenAddress]);

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
    return `https://moonvector.io${router.pathname}?ref=${account}`;
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
    if (currentSaleData.rewarded) return currentSaleData.rewarded;
    return currentSaleData.tokensPerETH
      .mul(currentSaleData.userPledged)
      .div(parseEther("1"));
  }, [currentSaleData]);

  const approve = useCallback(async () => {
    if (!tokenWriter || !reader || !chainId || chainId != chain) return;
    setTempFlags((draft) => {
      draft.pledgeLoad = true;
    });
    const tx = await tokenWriter
      .approve(reader.address, staticSaleData.hardcap)
      .catch((e: { code: string; reason: string }) => {
        setTxQueue((draft) => {
          draft["at1"] = {
            description: e.reason || e.code,
            chainId,
            status: "error",
            customTimeout: 5000,
          };
        });
        return null;
      });
    if (tx) {
      setTxQueue((draft) => {
        draft[tx.hash] = {
          description: "Approve BUSD spend",
          chainId,
          status: "pending",
        };
      });
      const rc = await tx.wait();
      setTxQueue((draft) => {
        const txnData = draft[tx.hash];
        if (!txnData) return;
        txnData.status = rc.status == 1 ? "complete" : "error";
        draft[tx.hash] = txnData;
      });
    }
    setTempFlags((draft) => {
      draft.pledgeLoad = false;
    });
  }, [
    tokenWriter,
    reader,
    chainId,
    chain,
    setTxQueue,
    staticSaleData.hardcap,
    setTempFlags,
  ]);

  const pledgeError = useMemo(() => {
    if (!chainId) return "Please connect";
    if (!writer) return "Pending writer lib";
    if (referral.length > 0 && !validReferral) return "Invalid Referral";
    if (chainId !== chain) return "Switch to correct network";
    if (pledgeAmount.isZero() && pledgeInput.current?.value)
      return "Invalid pledgeAmount";
    return null;
  }, [
    writer,
    referral,
    chainId,
    chain,
    pledgeAmount,
    validReferral,
    pledgeInput,
  ]);

  const pledge = useCallback(async () => {
    alert(
      "By confirming the next transaction you acknowledge that this is not a token sale, and that shares can not be sold, transfered, or positions exited at this time. Shares represent a percentage of Moon Vector royalties, and only if and when all shares are sold, will the option for OTC shared trading be explored. OTC is not guaranteed, nor is any timeframe set. Shares will be consitant cross-chain. BSC shares will be updated immedeitely, and all other EVM chains Moon Vector is deployed on with be updated at weekly intervals, unless upcharge snapshots are requested."
    );
    if (
      !writer ||
      (referral.length > 0 && !validReferral) ||
      !chainId ||
      chainId !== chain ||
      pledgeAmount.isZero()
    )
      return console.log({
        stat1: !writer,
        referral,
        stat2: referral && !validReferral,
        stat3: !chainId,
        stat4: chainId != chain,
        stat5: pledgeAmount.isZero(),
      });
    setTempFlags((draft) => {
      draft.pledgeLoad = true;
    });
    const tx = referral
      ? await writer
          .pledgeReferred(pledgeAmount, referral)
          .catch((e: { code: string; reason: string }) => {
            setTxQueue((draft) => {
              draft["at1"] = {
                description: e.reason || e.code,
                chainId,
                status: "error",
                customTimeout: 5000,
              };
            });
            return null;
          })
      : await writer
          .pledge(pledgeAmount)
          .catch((e: { code: string; reason: string }) => {
            setTxQueue((draft) => {
              draft["at1"] = {
                description: e.reason || e.code,
                chainId,
                status: "error",
                customTimeout: 5000,
              };
            });
            return null;
          });
    if (tx) {
      setTxQueue((draft) => {
        draft[tx.hash] = {
          description:
            "Pledge " +
            prettyBN(pledgeAmount, 0) +
            " " +
            staticSaleData.pledgeTokenName,
          chainId,
          status: "pending",
        };
      });
      const rc = await tx.wait();
      setTxQueue((draft) => {
        const txnData = draft[tx.hash];
        if (!txnData) return;
        txnData.status = rc.status == 1 ? "complete" : "error";
        draft[tx.hash] = txnData;
      });
    }
    setTempFlags((draft) => {
      draft.pledgeLoad = false;
    });
    setPledgeAmount(BigNumber.from("0"));
    setTempFlags((draft) => {
      draft.pledgeLoad = false;
    });
    if (pledgeInput.current) pledgeInput.current.value = "";
  }, [
    writer,
    referral,
    validReferral,
    chainId,
    chain,
    pledgeAmount,
    pledgeInput,
    setTxQueue,
    setTempFlags,
    staticSaleData.pledgeTokenName,
  ]);

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
              "rounded-xl px-7 py-5",
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
              {currentSaleData.saleStatus}
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
            value={currentSaleData.totalPledged
              .mul(100)
              .div(
                staticSaleData.softcap.isZero()
                  ? staticSaleData.hardcap.isZero()
                    ? 1
                    : staticSaleData.hardcap
                  : staticSaleData.softcap
              )
              .toNumber()}
            max={100}
            className="raise-progress mt-6 w-full"
          />
        </div>
      </div>
      {/* INPUT AND ACTION */}
      <div className="grid auto-rows-auto grid-cols-1 items-center pt-6 pb-0 md:grid-cols-3 md:flex-row md:items-end md:justify-start">
        {/* ReferralInput */}
        <div className="order-3 col-span-2 flex flex-grow flex-col md:order-1 md:pb-3">
          <div className="flex h-[42px] w-full flex-row items-center justify-between gap-2 pb-2 md:w-[420px]">
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
            defaultValue={router.query.ref}
          />
          {pledgeError && (
            <span className="font-bold text-red-400">{pledgeError}</span>
          )}
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
              ref={pledgeInput}
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
            className=" mb-[20px] w-32 rounded-xl bg-primary py-[10px] hover:bg-primary/80 disabled:bg-slate-700"
            disabled={tempFlags.pledgeLoad}
            onClick={() => {
              if (currentSaleData.allowance.isZero()) approve();
              else pledge();
            }}
          >
            {tempFlags.pledgeLoad ? (
              <Image
                src="/ring_loader.svg"
                width={24}
                height={24}
                className="mx-auto w-6"
                alt="loader"
              />
            ) : currentSaleData.allowance.isZero() ? (
              "Approve"
            ) : (
              "Pledge"
            )}
            {/* {whitelisted ? (approved ? "Pledge" : "Approve") : "Whitelist"} */}
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end py-9 md:flex-row md:justify-between">
        <div className="w-full flex-grow font-semibold">
          <div className="mt-4 flex flex-row justify-between">
            <span className="flex-grow text-t_dark md:w-60 md:flex-none">
              Pledged
            </span>
            <span className="flex-none text-left md:flex-grow">
              {prettyBN(currentSaleData.userPledged, 4)}{" "}
              {staticSaleData.pledgeTokenName}
            </span>
          </div>
          {staticSaleData.softcap.gt(0) && (
            <div className="mt-4 flex flex-row justify-between">
              <span className="flex-grow text-t_dark md:w-60 md:flex-none">
                Softcap
              </span>
              <span className="flex-none text-left md:flex-grow">
                {prettyBN(staticSaleData.softcap, 4)}{" "}
                {staticSaleData.pledgeTokenName}
              </span>
            </div>
          )}
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
              Referrals
            </span>
            <span className="flex-none text-left md:flex-grow">
              {currentSaleData.referrals.toString()}
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
