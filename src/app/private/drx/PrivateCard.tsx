"use client";
import Image, {type StaticImageData } from "next/image";
import classNames from "classnames";
import {
  useAccount,
  useBalance,
  useContractReads,
  useContractWrite,
  useNetwork,
} from "wagmi";
import { formatEther, parseEther } from "viem";
import { useWeb3Modal } from "@web3modal/react";
import raiseAbi from "abi/SimpleRaiseABI";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSetAtom } from "jotai";
import { txQueue } from "data/atoms";
import { waitForTransaction } from "@wagmi/core";

const raiseContract = "0x7F7D4b9c86B49C5856C496188C79980A1C2f15eD";
const zeroAddress = "0x0000000000000000000000000000000000000000";

export type PrivateCardProps = {
  iconLogo: StaticImageData,
  customLogoPadding?: string,
  contracts: Array<{ chainId: number, contract: `0x${string}` }>,
  cardTitleInfo: {
    title: string,
    description: string,
  }
}

const PrivateCard = (props: PrivateCardProps) => {
  const { iconLogo, customLogoPadding, cardTitleInfo: { title, description } } = props;
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: userBalance } = useBalance({ address });
  const { open } = useWeb3Modal();
  const setTxQueue = useSetAtom(txQueue);
  console.log(chain?.name || "Not connected")
  const [pledgeAmount, setPledgeAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  ///TODO - add price feed for BNB, ETH, PLS
  /// TODO - add contracts to read from to collect PLS, ETH, BNB
  /// TODO - setup pledge function dependent on the chain ID the user is on.
  /// TODO - if not connected to a chain, display all 3 chain icons to connect to any of those.
  /// TODO - if user is on a valid chain, display icons to connect to other chains.
  /// TODO - if user is on an invalid chain, display all 3 chain icons as if disconnected.

  const { data, refetch } = useContractReads({
    contracts: [
      {
        address: raiseContract,
        chainId: 56,
        abi: raiseAbi,
        functionName: "user",
        args: [address ?? zeroAddress],
      },
      {
        address: raiseContract,
        chainId: 56,
        abi: raiseAbi,
        functionName: "totalPledge",
      },
      {
        address: raiseContract,
        chainId: 56,
        abi: raiseAbi,
        functionName: "tokensPerETH",
      },
      {
        address: raiseContract,
        chainId: 56,
        abi: raiseAbi,
        functionName: "hardcap",
      },
      {
        address: raiseContract,
        chainId: 56,
        abi: raiseAbi,
        functionName: "minDeposit",
      },
      {
        address: raiseContract,
        chainId: 56,
        abi: raiseAbi,
        functionName: "maxDeposit",
      },
    ],
    enabled: true,
    staleTime: 15000,
  });
  const { writeAsync } = useContractWrite({
    address: raiseContract,
    abi: raiseAbi,
    functionName: "pledge",
    chainId: 56,
    value: parseEther(`${pledgeAmount}`),
  });


  const inputError = useMemo(() => {
    const userPledgeAmount = data?.[0]?.result?.pledge || 0n;
    const convertedAmount = parseEther(`${pledgeAmount}`);

    const reason =
      (convertedAmount >
        (userBalance?.value ?? parseEther("100000000000000")) &&
        1) ||
      (pledgeAmount >= (data?.[4]?.result || 0n) && 2) ||
      (userPledgeAmount + convertedAmount > (data?.[5]?.result || 0n) && 3) ||
      0;
    switch (reason) {
      case 1:
        return {
          status: true,
          reason: "You cannot pledge more than your balance",
        };
      case 2:
        return { status: true, reason: "Invalid pledge amount" };
      case 3:
        return { status: true, reason: "Amount over Max" };
      default:
        return { status: false, reason: "" };
    }
  }, [pledgeAmount, data, userBalance]);

  const pledgeStuff = useCallback(async () => {
    if (inputError.status) {
      setLoading(false);
      return;
    }
    const { hash } = await writeAsync().catch((e) => {
      return { hash: false as const };
    });
    if (!hash) {
      setLoading(false);
      return;
    }
    setTxQueue((draft) => {
      draft[hash] = {
        status: "pending",
        description: `Pledging ${pledgeAmount} BNB`,
        chainId: 56,
      };
    });
    const data = await waitForTransaction({ hash });
    if (data.status === "success") {
      setTxQueue((draft) => {
        const txnData = draft[hash];
        if (!txnData) return;
        txnData.status = data.status === "success" ? "complete" : "error";
        draft[hash] = txnData;
      });
    }
    setLoading(false);
    refetch();
  }, [pledgeAmount, writeAsync, refetch, inputError]);

  useEffect(() => {
    if (!address) return;
    const interval = setInterval(() => {
      refetch();
    }, 10000);
    return () => clearInterval(interval);
  }, [data, refetch]);

  return (
    <div className="w-full rounded-3xl bg-bg_f_light px-9 py-8 text-readable">
      <div className="flex flex-col items-center justify-center gap-x-6 gap-y-6 pb-6 md:flex-row">
        <div className={classNames("flex items-center justify-center rounded-full border-2 border-dividers bg-bg_darkest", customLogoPadding)}>
          <Image
            src={iconLogo}
            height={60}
            width={60}
            alt={`Nebula-Finance-Icon-Logo`}
          />
        </div>
        <div className="flex-grow text-center md:text-left">
          <div className="text-2xl font-bold">{title}</div>
          <div className="text-base font-semibold">{description}</div>
        </div>
        <button
          className={classNames(
            "rounded-xl px-7 py-5",
            "bg-primary hover:bg-primary-focus"
          )}
          onClick={() => open()}
        >
          {address
            ? address.slice(0, 4) +
              "..." +
              address.slice(address.length - 4, address.length)
            : "Connect Wallet"}
        </button>
      </div>
      <div className="flex flex-col gap-4 border-b-2 border-t-2 border-dividers py-6 md:flex-row">
        <div className="w-full font-semibold md:w-[35%]">
          <div className="flex flex-row justify-between">
            <span className="flex-grow text-t_dark md:w-32 md:flex-none">
              Sale Status
            </span>
            <span className="flex-none text-left uppercase md:flex-grow">
              {"Starting Soon"}
            </span>
          </div>
          <div className="mt-4 flex flex-row justify-between">
            <span className="flex-grow text-t_dark md:w-32 md:flex-none">
              Raised
            </span>
            <span className="flex-none text-left md:flex-grow">
              {data?.[1]?.result ? "-_-" : "--"} {"USD"}
            </span>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between font-semibold text-t_dark">
            <span>
              Accepting ETH, BNB & PLS
            </span>
          </div>
          <div className="relative">
            <div className="main-progress">
              <progress
                value={
                  // Number(
                  //   ((data?.[1]?.result || 0n) * 10000n) / (data?.[3]?.result || 1n)
                  // ) / 100
                  100
                }
                max={100}
                className="mt-6 w-full"
                
              />
            </div>
            <div className="second-progress absolute top-0 w-full z-10">
              <progress
                value={
                  // Number(
                  //   ((data?.[1]?.result || 0n) * 10000n) / (data?.[3]?.result || 1n)
                  // ) / 100
                  60
                }
                max={100}
                className="raise-progress mt-6 w-full"
              />
            </div>
            <div className="third-progress absolute top-0 w-full z-20">
              <progress
                value={
                  // Number(
                  //   ((data?.[1]?.result || 0n) * 10000n) / (data?.[3]?.result || 1n)
                  // ) / 100
                  25
                }
                max={100}
                className="raise-progress mt-6 w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center py-6 md:flex-row md:items-center md:justify-start">
        {/* INPUT AND TOKENS IN WALLET */}
        {/* LABEL AND INPUT */}
        <div className="flex flex-grow flex-col">
          <label
            id="pledge-id"
            htmlFor="pledge"
            className="pb-3 pl-2 font-semibold"
          >
            {/* TODO get ETH token name based on chain ID of raise */}
            Pledge {chain?.nativeCurrency.symbol || ""}
          </label>
          <div className="flex h-[96px] flex-col gap-1">
            <input
              className={classNames(
                "input-bordered input w-72 border-2 bg-bg_darkest px-3 py-1 text-right",
                inputError.status ? "input-error" : "input-primary"
              )}
              value={pledgeAmount}
              name="pledge"
              type="number"
              min={parseFloat(formatEther(data?.[4]?.result || 0n))}
              max={parseFloat(formatEther(data?.[5]?.result || 0n))}
              step={0.1}
              onChange={(e) => {
                const newNumber = e.target.valueAsNumber;
                if (isNaN(newNumber) || newNumber < 0) setPledgeAmount(0);
                else setPledgeAmount(newNumber);
              }}
              onFocus={(e) => e.target.select()}
            />
            <span className=" ml-3 whitespace-pre-wrap text-sm font-normal text-t_dark">
              Min: 0.5 BNB, Max: 10 BNB{"\n"}Wallet:{" "}
              {formatEther(userBalance?.value || 0n)
                .split(".")
                .map((x, i) => (i == 1 ? x.slice(0, 3) : x))
                .join(".")}
              &nbsp;BNB
            </span>
            <span className=" ml-3 text-sm font-normal text-rose-500">
              {inputError.status ? inputError.reason : ""}
            </span>
          </div>
        </div>
        <div className="mt-6 md:mt-0">
          <button
            disabled
            className={classNames(
              "btn w-32 btn-disabled",
              loading || inputError.status ? "btn-disabled" : "btn-primary"
            )}
            onClick={() => {
              setLoading(true);
              pledgeStuff();
            }}
          >
            {loading ? (
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
      <div className="flex flex-col">
        <div className="flex w-full flex-row items-center gap-x-6">
          <div className="w-40 font-semibold">Pledged</div>
          <div className="w-40 text-right text-primary">
            {formatEther(data?.[0]?.result?.pledge || 0n)}&nbsp;BNB
          </div>
        </div>
        <div className="flex w-full flex-row items-center gap-x-6">
          <div className="w-40 font-semibold"></div>
          <div className="w-40 text-right text-primary">
            {formatEther(data?.[0]?.result?.pledge || 0n)}&nbsp;ETH
          </div>
        </div>
        <div className="flex w-full flex-row items-center gap-x-6">
          <div className="w-40 font-semibold"></div>
          <div className="w-40 text-right text-primary">
            {formatEther(data?.[0]?.result?.pledge || 0n)}&nbsp;PLS
          </div>
        </div>
        <div className="flex w-full flex-row items-center gap-x-6">
          <div className="w-40 font-semibold">Receive</div>
          <div className="w-40 text-right text-primary">DAO Access & NFT</div>
        </div>
      </div>
    </div>
  );
};

export default PrivateCard;
