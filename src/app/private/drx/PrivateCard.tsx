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
import raiseAbi from "abi/EthOpenRaise";
import priceFeedAbi from "abi/ChainlinkPriceFeed";
import plsPairAbi from 'abi/PLSV2Pair';
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSetAtom } from "jotai";
import { txQueue } from "data/atoms";
import { waitForTransaction } from "@wagmi/core";

const raiseContractBNB = "0x683aA822D3c30a60f93286d3BE4E52722e7091b2";
const raiseContractETH = "0xbEb3d8da739e903fe507bd1c5575CFd010bf651B";
const raiseContractPLS = "0xbEb3d8da739e903fe507bd1c5575CFd010bf651B";
const ethPriceFeed = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
const bnbPriceFeed = "0x0567f2323251f0aab15c8dfb1967e4e8a7d42aee";
const plsDaiLP = "0xE56043671df55dE5CDf8459710433C10324DE0aE"
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
      // BSC
      {
        address: raiseContractBNB,
        chainId: 56,
        abi: raiseAbi,
        functionName: "contributions",
        args: [address ?? zeroAddress],
      },
      {
        address: raiseContractBNB,
        chainId: 56,
        abi: raiseAbi,
        functionName: "totalContributions",
      },
      {
        address: raiseContractBNB,
        chainId: 56,
        abi: raiseAbi,
        functionName: "min",
      },
      {
        address: raiseContractBNB,
        chainId: 56,
        abi: raiseAbi,
        functionName: "max",
      },
      // ETH
      {
        address: raiseContractETH,
        chainId: 1,
        abi: raiseAbi,
        functionName: "contributions",
        args: [address ?? zeroAddress],
      },
      {
        address: raiseContractETH,
        chainId: 1,
        abi: raiseAbi,
        functionName: "totalContributions",
      },
      {
        address: raiseContractETH,
        chainId: 1,
        abi: raiseAbi,
        functionName: "min",
      },
      {
        address: raiseContractETH,
        chainId: 1,
        abi: raiseAbi,
        functionName: "max",
      },
      // PLS
      {
        address: raiseContractPLS,
        chainId: 369,
        abi: raiseAbi,
        functionName: "contributions",
        args: [address ?? zeroAddress],
      },
      {
        address: raiseContractPLS,
        chainId: 369,
        abi: raiseAbi,
        functionName: "totalContributions",
      },
      {
        address: raiseContractPLS,
        chainId: 369,
        abi: raiseAbi,
        functionName: "min",
      },
      {
        address: raiseContractPLS,
        chainId: 369,
        abi: raiseAbi,
        functionName: "max",
      },
      // PRICE FEEDS
      {
        address: ethPriceFeed,
        chainId: 1,
        abi: priceFeedAbi,
        functionName: "latestRoundData",
      },
      {
        address: bnbPriceFeed,
        chainId: 56,
        abi: priceFeedAbi,
        functionName: "latestRoundData",
      },
      {
        address: plsDaiLP,
        chainId: 369,
        abi: plsPairAbi,
        functionName: "getReserves",
      }
    ],
    enabled: true,
    staleTime: 15000,
  });
  const { writeAsync } = useContractWrite({
    address: (chain?.id || 0) == 56 && raiseContractBNB || (chain?.id || 0) == 1 && raiseContractETH ||  (chain?.id || 0) == 369 && raiseContractPLS || raiseContractBNB,
    abi: raiseAbi,
    functionName: "contribute",
    chainId: chain?.id || 56,
    value: parseEther(`${pledgeAmount}`),
  });


  const raiseInfoAndErrorStatus = useMemo(() => {
    const selectedChain = {
      56: {
        contributed: data?.[0]?.result as bigint || 0n,
        min: data?.[2]?.result as bigint || 0n,
        max: data?.[3]?.result as bigint || 0n,
      },
      1: {
        contributed: data?.[4]?.result as bigint || 0n,
        min: data?.[6]?.result as bigint || 0n,
        max: data?.[7]?.result as bigint || 0n,
      },
      369: {
        contributed: data?.[8]?.result as bigint || 0n,
        min: data?.[10]?.result as bigint || 0n,
        max: data?.[11]?.result as bigint || 0n,
      },
    };
    if([1,56,369].indexOf(chain?.id || 0) === -1) 
      return { status: true, reason: "Invalid chain", contributed: 0n, min: 0n, max: 0n };
    const raiseData = selectedChain[chain?.id as 1 | 56 | 369 || 56];
    const {contributed, min, max} = raiseData;
    
    const convertedAmount = parseEther(`${pledgeAmount}`);
    const endAmount = contributed + convertedAmount
    const reason =
      (convertedAmount >
        (userBalance?.value ?? parseEther("100000000000000")) &&
        1) ||
      (endAmount <= (min) && 2) ||
      (endAmount > (max) && 3) ||
      0;
    switch (reason) {
      case 1:
        return {
          status: true,
          reason: "You cannot pledge more than your balance",
          ...raiseData
        };
      case 2:
        return { status: true, reason: "Invalid pledge amount", ...raiseData };
      case 3:
        return { status: true, reason: "Amount over Max", ...raiseData };
      default:
        return { status: false, reason: "", ...raiseData };
    }
  }, [pledgeAmount, data, userBalance, chain]);

  const pledgeStuff = useCallback(async () => {
    if (raiseInfoAndErrorStatus.status) {
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
        description: `Contributing ${pledgeAmount} ${chain?.name}`,
        chainId: chain?.id || 56,
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
  }, [pledgeAmount, writeAsync, refetch, raiseInfoAndErrorStatus, chain, setTxQueue]);

  useEffect(() => {
    if (!address) return;
    const interval = setInterval(() => {
      refetch();
    }, 10000);
    return () => clearInterval(interval);
  }, [data, refetch, address]);

  const raisedInfo = useMemo(() => {
    const ethPrice = Number(data?.[12]?.result?.[1] as bigint || 0n) / 1e8;
    const bnbPrice = Number(data?.[13]?.result?.[1] as bigint || 0n) / 1e8;
    const plsDai = data?.[14]?.result?.[1] as bigint || 0n
    const pldRes = data?.[14]?.result?.[0] as bigint || 1n;
    const plsPrice = Number(plsDai * 100000000n / pldRes) / 1e8;

    const bnbRaised = Number((data?.[0]?.result as bigint || 0n) / 10000000000n) * ethPrice / 1e8;
    const ethRaised = Number((data?.[4]?.result as bigint || 0n) / 10000000000n) * bnbPrice / 1e8;
    const plsRaised = Number((data?.[8]?.result as bigint || 0n) / 10000000000n) * plsPrice / 1e8;
    const totalRaised = bnbRaised + ethRaised + plsRaised;

    return { 
      eth: ethPrice, 
      bnb: bnbPrice, 
      pls: plsPrice,
      bnbRaised,
      ethRaised,
      plsRaised,
      totalRaised
    };
  },[data])

  console.log({raisedInfo, chain})


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
              {"Started"}
            </span>
          </div>
          <div className="mt-4 flex flex-row justify-between">
            <span className="flex-grow text-t_dark md:w-32 md:flex-none">
              Raised
            </span>
            <span className="flex-none text-left md:flex-grow">
              {raisedInfo.totalRaised || "--"} {"USD"}
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
                  raisedInfo.ethRaised * 100/(raisedInfo.totalRaised || 1)
                }
                max={100}
                className="mt-6 w-full"
                
              />
            </div>
            <div className="second-progress absolute top-0 w-full z-10">
              <progress
                value={
                  raisedInfo.bnbRaised * 100/(raisedInfo.totalRaised || 1)
                }
                max={100}
                className="raise-progress mt-6 w-full"
              />
            </div>
            <div className="third-progress absolute top-0 w-full z-20">
              <progress
                value={
                  raisedInfo.plsRaised * 100/(raisedInfo.totalRaised || 1)
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
            Contribute {chain?.nativeCurrency.symbol || ""}
          </label>
          <div className="flex h-[96px] flex-col gap-1">
            <input
              className={classNames(
                "input-bordered input w-72 border-2 bg-bg_darkest px-3 py-1 text-right",
                raiseInfoAndErrorStatus.status ? "input-error" : "input-primary"
              )}
              value={pledgeAmount}
              name="pledge"
              type="number"
              min={parseFloat(formatEther(data?.[2]?.result as bigint || 0n))}
              max={parseFloat(formatEther(data?.[3]?.result as bigint || 0n))}
              step={0.1}
              onChange={(e) => {
                const newNumber = e.target.valueAsNumber;
                if (isNaN(newNumber) || newNumber < 0) setPledgeAmount(0);
                else setPledgeAmount(newNumber);
              }}
              onFocus={(e) => e.target.select()}
            />
            <span className=" ml-3 whitespace-pre-wrap text-sm font-normal text-t_dark">
              Min: {formatEther(raiseInfoAndErrorStatus.min)} {chain?.nativeCurrency.symbol}, Max: {formatEther(raiseInfoAndErrorStatus.max)} {chain?.nativeCurrency.symbol}{"\n"}Wallet:{" "}
              {formatEther(userBalance?.value || 0n)
                .split(".")
                .map((x, i) => (i == 1 ? x.slice(0, 3) : x))
                .join(".")}
              &nbsp;{chain?.nativeCurrency.symbol}
            </span>
            <span className=" ml-3 text-sm font-normal text-rose-500">
              {raiseInfoAndErrorStatus.status ? raiseInfoAndErrorStatus.reason : ""}
            </span>
          </div>
        </div>
        <div className="mt-6 md:mt-0">
          <button
            className={classNames(
              "btn w-32",
              (loading || raiseInfoAndErrorStatus.status) ? "btn-disabled" : "btn-primary"
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
            {formatEther(data?.[0]?.result as bigint || 0n)}&nbsp;BNB
          </div>
        </div>
        <div className="flex w-full flex-row items-center gap-x-6">
          <div className="w-40 font-semibold"></div>
          <div className="w-40 text-right text-primary">
            {formatEther(data?.[4]?.result as bigint || 0n)}&nbsp;ETH
          </div>
        </div>
        <div className="flex w-full flex-row items-center gap-x-6">
          <div className="w-40 font-semibold"></div>
          <div className="w-40 text-right text-primary">
            {formatEther(data?.[8]?.result as bigint || 0n)}&nbsp;PLS
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
