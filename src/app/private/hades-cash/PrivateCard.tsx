"use client";
import Image from "next/image";
import iconLogo from "../../../../public/partners/hades/HadesLogo.png";
import classNames from "classnames";
import {
  useAccount,
  useBalance,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { BaseError, formatEther, parseEther } from "viem";
import { useWeb3Modal } from "@web3modal/react";
import raiseAbi from "abi/SimpleRaiseABI";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSetAtom } from "jotai";
import { txQueue } from "data/atoms";
import { waitForTransaction } from "@wagmi/core";

const raiseContract = "0x72631f8d8905bA15574dDCE12c898f0436c7159a";
const zeroAddress = "0x0000000000000000000000000000000000000000";

const PrivateCardHadesCash = () => {
  const { address } = useAccount();
  const { data: userBalance } = useBalance({ address });
  const { open } = useWeb3Modal();

  const setTxQueue = useSetAtom(txQueue);

  const [pledgeAmount, setPledgeAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const { data, refetch } = useContractReads({
    contracts: [
      {
        address: raiseContract,
        abi: raiseAbi,
        functionName: "user",
        args: [address ?? zeroAddress],
      },
      {
        address: raiseContract,
        abi: raiseAbi,
        functionName: "totalPledge",
      },
      {
        address: raiseContract,
        abi: raiseAbi,
        functionName: "tokensPerETH",
      },
      {
        address: raiseContract,
        abi: raiseAbi,
        functionName: "hardcap",
      },
      {
        address: raiseContract,
        abi: raiseAbi,
        functionName: "minDeposit",
      },
      {
        address: raiseContract,
        abi: raiseAbi,
        functionName: "maxDeposit",
      },
      {
        address: raiseContract,
        abi: raiseAbi,
        functionName: "endSale",
      },
      {
        address: raiseContract,
        abi: raiseAbi,
        functionName: "endTime",
      },
    ],
    enabled: true,
    staleTime: 15000,
  });
  const { config, error: pledgeError } = usePrepareContractWrite({
    address: raiseContract,
    abi: raiseAbi,
    functionName: "pledge",
    value: parseEther(`${pledgeAmount}`),
  });
  const { writeAsync } = useContractWrite(config);

  const { writeAsync: claimAsync } = useContractWrite({
    address: raiseContract,
    abi: raiseAbi,
    functionName: "claim",
  });

  const userPledgeAmount = useMemo(
    () => (data?.[0]?.result as undefined | [bigint, boolean])?.[0] || 0n,
    [data]
  );

  const inputError = useMemo(() => {
    const convertedAmount = parseEther(`${pledgeAmount}`);

    const reason =
      (convertedAmount >
        (userBalance?.value ?? parseEther("100000000000000")) &&
        1) ||
      (pledgeAmount >= ((data?.[4]?.result as bigint) || 0n) && 2) ||
      (userPledgeAmount + convertedAmount >
        ((data?.[5]?.result as bigint) || 0n) &&
        3) ||
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
  }, [pledgeAmount, data, userBalance, userPledgeAmount]);

  const pledgeStuff = useCallback(async () => {
    if (inputError.status || pledgeError || !writeAsync) {
      setLoading(false);
      return;
    }
    const { hash } = await writeAsync().catch((e) => {
      return { hash: false as false };
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
  }, [pledgeAmount, writeAsync, refetch, inputError, pledgeError]);

  const claim = useCallback(async () => {
    const { hash } = await claimAsync().catch((e) => {
      return { hash: false as false };
    });
    if (!hash) {
      setLoading(false);
      return;
    }
    setTxQueue((draft) => {
      draft[hash] = {
        status: "pending",
        description: `Claiming pNSH`,
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
  }, [data, refetch, address]);

  const status = useMemo(() => {
    if (!data) return "...";
    if ((data[7]?.result as bigint) == 0n) return "Not Started";
    return (data[6]?.result as boolean) ? "Ended" : "In Progress";
  }, [data]);

  const totalPledged = formatEther((data?.[1]?.result as bigint) || 0n);

  return (
    <div className="w-full rounded-3xl bg-bg_f_light px-9 py-8 text-readable">
      <div className="flex flex-col items-center justify-center gap-x-6 gap-y-6 pb-6 md:flex-row">
        <div className="flex items-center justify-center rounded-full border-2 border-dividers bg-bg_darkest p-2">
          <Image
            src={iconLogo}
            height={80}
            width={80}
            alt={`Hades-Cash-Icon-Logo`}
          />
        </div>
        <div className="flex-grow text-center md:text-left">
          <div className="text-2xl font-bold">Hades Cash</div>
          <div className="text-base font-semibold">Private Sale</div>
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
              {status}
            </span>
          </div>
          <div className="mt-4 flex flex-row justify-between">
            <span className="flex-grow text-t_dark md:w-32 md:flex-none">
              Raised
            </span>
            <span className="flex-none text-left md:flex-grow">
              {data?.[1]?.result ? totalPledged : "--"} {"BNB"}
            </span>
          </div>
        </div>
        <div className="main-progress flex-1">
          <div className="flex justify-between font-semibold text-t_dark">
            <span>
              {data?.[1]?.result ? totalPledged : "--"} /{" "}
              {data?.[3]?.result
                ? formatEther((data[3].result as bigint) || 0n)
                : "--"}
            </span>
          </div>
          <progress
            value={
              Number(
                (((data?.[1]?.result as bigint) || 0n) * 10000n) /
                  ((data?.[3]?.result as bigint) || 1n)
              ) / 100
            }
            max={100}
            className="raise-progress mt-6 w-full"
          />
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
            Pledge {`BNB`}
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
              min={parseFloat(formatEther((data?.[4]?.result as bigint) || 0n))}
              max={parseFloat(formatEther((data?.[5]?.result as bigint) || 0n))}
              step={0.1}
              onChange={(e) => {
                const newNumber = e.target.valueAsNumber;
                if (isNaN(newNumber) || newNumber < 0) setPledgeAmount(0);
                else setPledgeAmount(newNumber);
              }}
              onFocus={(e) => e.target.select()}
            />
            <span className=" ml-3 whitespace-pre-wrap text-sm font-normal text-t_dark">
              Min: 0.5 BNB, Max: 5 BNB{"\n"}Wallet:{" "}
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
        <div className="mt-6 flex flex-col md:mt-0">
          <button
            className={classNames(
              "btn mb-2 w-32",
              loading ||
                inputError.status ||
                (data?.[0]?.result as undefined | { claimed: bigint })?.claimed
                ? "btn-disabled"
                : "btn-primary",
              pledgeError ? "btn-disabled" : ""
            )}
            onClick={() => {
              setLoading(true);
              // claim();
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
          </button>
          {pledgeError?.message && (
            <p className="text-center text-sm text-error">
              {(pledgeError as BaseError).shortMessage.split(":")[1]}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex w-full flex-row items-center gap-x-6">
          <div className="w-48 font-semibold">Pledged</div>
          <div className="w-28 text-right text-primary">
            {formatEther(userPledgeAmount)}&nbsp;BNB
          </div>
        </div>
        <div className="flex w-full flex-row items-center gap-x-6">
          <div className="w-48 font-semibold">Token To Receive</div>
          <div className="w-28 text-right text-primary">$HADES</div>
        </div>
        {/* <div className="flex w-full flex-row items-center gap-x-6">
          <div className="w-48 font-semibold">Amount to Receive</div>
          <div className="w-28 text-right text-primary">
            {commifyJs(
              formatEther(
                (totalPrivateSale * (data?.[0]?.result?.pledge || 0n)) /
                  parseEther(`${80}`)
              )
            )}
          </div>
        </div> */}
        <div className="flex w-full flex-row items-center gap-x-6 pt-6 text-readable/50">
          <div className="text-sm">
            Claim after launch. 50% will be sent directly to your faucet as
            Airdrop.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateCardHadesCash;
