import { useCallback, useEffect, useState, useMemo } from "react";
// Next
import Image from "next/image";
// Data stuff
import { useSetAtom } from "jotai";
import { connectModal } from "data/atoms";
// Web3 stuff
import { useWeb3React } from "@web3-react/core";
// hooks
import { useAuth } from "hooks/useAuth";
// utils
import classNames from "classnames";
import { BigNumber } from "@ethersproject/bignumber";
import { prettyBN } from "utils/bn";
import useContract from "hooks/useContracts";
import { formatEther, parseEther } from "ethers/lib/utils";
import { useRef } from "react";

const RaiseCard = (props: RaiseCardProps) => {
  const {
    title = "MoonVector",
    subtitle = "Crowdfunding",
    iconLogo = "/logo/logo_icon_primary.svg",
  } = props;

  const setOpenConnectModal = useSetAtom(connectModal);
  const { account, library } = useWeb3React();
  const { logout } = useAuth();

  const [pLoad, setPLoad] = useState(false);
  const [pledgeAmount, setPledgeAmount] = useState(0);
  const pledgeRef = useRef<HTMLInputElement>(null);

  const { reader, writer, baseLib } = useContract(
    "0x3f7bc3404C8608B8a04ba2321613fcA9063048a1",
    56,
    "SimpleETH"
  );

  const [saleData, setSaleData] = useState({
    userBalance: BigNumber.from("0"),
    hardcap: BigNumber.from("0"),
    currentRaise: BigNumber.from("0"),
    tokensPerETH: BigNumber.from("0"),
    endSale: false,
    success: false,
    min: BigNumber.from("0"),
    max: BigNumber.from("0"),
    userPledge: BigNumber.from("0"),
    userClaimed: false,
  });

  useEffect(() => {
    const getData = async () => {
      let userBal = BigNumber.from("0");
      if (baseLib && account) userBal = await baseLib.getBalance(account);
      if (!reader) return;
      const hc = await reader.hardcap();
      const cr = await reader.totalPledge();
      const tpe = await reader.tokensPerETH();
      const es = await reader.endSale();
      const suc = await reader.success();
      const min = await reader.minDeposit();
      const max = await reader.maxDeposit();
      let user = { pledge: BigNumber.from("0"), claimed: false };
      if (account) user = await reader.user(account);

      setSaleData({
        userBalance: userBal,
        hardcap: hc,
        currentRaise: cr,
        tokensPerETH: tpe,
        endSale: es,
        success: suc,
        min,
        max,
        userClaimed: user.claimed,
        userPledge: user.pledge,
      });
    };

    if (saleData.hardcap.isZero()) getData();
    const interval = setInterval(getData, 5000);
    return () => clearInterval(interval);
  }, [reader, account, baseLib, saleData.hardcap]);

  const errorAmount = useMemo(() => {
    if (!pledgeRef.current || isNaN(parseFloat(pledgeRef.current.value)))
      return false;

    return (
      pledgeAmount < 0.2 ||
      saleData.userBalance.lt(parseEther(pledgeAmount.toString())) ||
      saleData.userPledge
        .add(parseEther(pledgeAmount.toString()))
        .gt(saleData.max) ||
      pledgeAmount > 2
    );
  }, [pledgeRef, saleData, pledgeAmount]);

  const pledge = useCallback(async () => {
    if (pledgeAmount <= 0 || !writer) return;
    if (errorAmount) {
      alert("Error in pledge amount");
      return;
    }
    setPLoad(true);
    try {
      const tx = await writer.pledge({
        value: parseEther(pledgeAmount.toString()),
      });
      const rc = await tx.wait();
      if (rc.status == 1) alert("Successfully pledged!");
      else alert("Check tx hash");
    } catch (e) {
      alert("Something went wrong, did you cancel the tx?");
    }
    setPLoad(false);
  }, [pledgeAmount, errorAmount, writer]);

  // TODOs
  // connect wallet stuff
  // After wallet is connected show the wallet and balance of fund types it has.
  // Probably will need to change the button for two textfields, address button will disconnect user

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
      </div>
      <div className="flex flex-col gap-4 border-t-2 border-b-2 border-dividers py-6 md:flex-row">
        <div className="w-full font-semibold md:w-[35%]">
          <div className="flex flex-row justify-between">
            <span className="flex-grow text-t_dark md:w-32 md:flex-none">
              Sale Status
            </span>
            <span className="flex-none text-left uppercase md:flex-grow">
              {saleData.endSale ? "Ended" : "Started"}
            </span>
          </div>
          <div className="mt-4 flex flex-row justify-between">
            <span className="flex-grow text-t_dark md:w-32 md:flex-none">
              Raised
            </span>
            <span className="flex-none text-left md:flex-grow">
              {prettyBN(saleData.currentRaise, 2)} {"BNB"}
            </span>
          </div>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-t_dark">
            {prettyBN(saleData.currentRaise, 2)} /{" HC: "}
            {prettyBN(saleData.hardcap, 2)}
          </div>
          <progress
            value={saleData.currentRaise
              .mul(100)
              .div(saleData.hardcap.isZero() ? 1 : saleData.hardcap)
              .toNumber()}
            max={100}
            className="raise-progress mt-6 w-full"
          />
        </div>
      </div>
      {/* INPUT AND ACTION */}
      <div className="flex flex-col items-center py-6 md:flex-row md:items-end md:justify-start">
        {/* INPUT AND TOKENS IN WALLET */}
        {/* LABEL AND INPUT */}
        <div className="flex flex-grow flex-col">
          <label
            id="pledge-id"
            htmlFor="pledge"
            className="pl-2 pb-3 font-semibold"
          >
            {/* TODO get ETH token name based on chain ID of raise */}
            Pledge {`BNB`}
          </label>
          <div className="flex flex-col gap-1">
            <input
              className={classNames(
                "w-72 rounded-xl border-2 bg-bg_darkest px-3 py-1 text-right focus:border-slate-300 focus:outline-none",
                errorAmount ? "border-rose-500" : "border-b_dark"
              )}
              ref={pledgeRef}
              name="pledge"
              type="number"
              min={parseFloat(formatEther(saleData.min))}
              max={parseFloat(formatEther(saleData.max))}
              step={0.1}
              onChange={(e) => {
                const newNumber = parseFloat(e.target.value);
                if (isNaN(newNumber) || newNumber < 0) setPledgeAmount(0);
                else setPledgeAmount(newNumber);
              }}
              onFocus={(e) => e.target.select()}
            />
            <span className=" ml-3 text-sm font-normal text-t_dark">
              Wallet: {prettyBN(saleData.userBalance, 3)}
            </span>
          </div>
        </div>
        <div className="mt-6 md:mt-0">
          <button
            className={classNames(
              "mb-[20px] w-32 rounded-xl py-[10px]",
              pLoad ? "bg-slate-600" : "bg-primary"
            )}
            disabled={errorAmount}
            onClick={pledge}
          >
            {pLoad ? (
              <Image
                src="/ring_loader.svg"
                width={24}
                height={24}
                className="mx-auto w-6"
                alt="loader"
              />
            ) : (
              "Pledge"
            )}
            {/* {whitelisted ? (approved ? "Pledge" : "Approve") : "Whitelist"} */}
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center py-9 md:flex-row md:justify-between">
        <div className="w-full flex-grow font-semibold">
          <div className="mt-4 flex flex-row justify-between">
            <span className="flex-grow text-t_dark md:w-60 md:flex-none">
              Pledged
            </span>
            <span className="flex-none text-left md:flex-grow">
              {prettyBN(saleData.userPledge)} {"BNB"}
            </span>
          </div>
          {saleData.tokensPerETH.isZero() ? null : (
            <div className="mt-4 flex flex-col justify-between md:flex-row">
              <span className="flex-grow text-xl text-t_dark md:w-60 md:flex-none">
                Rewarded Amount
              </span>
              <span className="mt-1 flex-none text-right text-xl md:mt-0 md:flex-grow md:text-left">
                XXX reward Token
              </span>
            </div>
          )}
        </div>
        {saleData.endSale && (
          <div className="mt-6 md:mt-0">
            {/* Conditionally render depending if rewards are available */}
            <button
              className=" w-32 rounded-xl bg-primary py-[10px] disabled:bg-t_dark"
              disabled
            >
              {saleData.success ? "Claim" : "Refund"}
            </button>
          </div>
        )}
      </div>
      <div className="mt-4">
        <span className="flex-grow text-sm text-t_dark md:w-60 md:flex-none">
          No refunds will be allowed once committed.
          <br />
          If the hardcap is not reached we will send your BNB back to your
          wallet.
        </span>
      </div>
    </div>
  );
};

export default RaiseCard;

type RaiseCardProps = {
  title: string;
  subtitle: string;
  iconLogo?: string;
};
