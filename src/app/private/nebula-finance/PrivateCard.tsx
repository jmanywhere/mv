"use client";
import Image from "next/image";
import iconLogo from "../../../../public/partners/NebulaLogo.png";
import classNames from "classnames";
import { useAccount, useContractReads } from "wagmi";
import { formatEther } from "viem";
import { useWeb3Modal } from "@web3modal/react";
import raiseAbi from "abi/SimpleRaiseABI";

const raiseContract = "0x20CF1fe9f1854E705e36Af5d1B5eaCEA55489897";
const zeroAddress = "0x0000000000000000000000000000000000000000";

const PrivateCardNebFinance = () => {
  const { address } = useAccount();
  const { open } = useWeb3Modal();

  const { data } = useContractReads({
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
    ],
  });

  return (
    <div className="w-full rounded-3xl bg-bg_f_light px-9 py-8">
      <div className="flex flex-col items-center justify-center gap-x-6 gap-y-6 pb-6 text-white/90 md:flex-row">
        <div className="flex items-center justify-center rounded-full border-2 border-dividers bg-bg_darkest px-4 py-6">
          <Image
            src={iconLogo}
            height={60}
            width={60}
            alt={`Nebula-Finance-Icon-Logo`}
          />
        </div>
        <div className="flex-grow text-center md:text-left">
          <div className="text-2xl font-bold">Nebula Finance</div>
          <div className="text-base font-semibold">Private Sale</div>
        </div>
        <button
          suppressHydrationWarning
          className={classNames(
            "rounded-xl px-7 py-5",
            " bg-primary hover:bg-primary-focus"
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
              {data?.[1]?.result ? formatEther(data[1].result) : "--"} {"BNB"}
            </span>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between font-semibold text-t_dark">
            <span>
              {data?.[1]?.result ? formatEther(data[1].result) : "--"} /{" "}
              {data?.[3]?.result ? formatEther(data[3].result) : "--"}
            </span>
          </div>
          <progress
            value={
              Number(
                ((data?.[1]?.result || 0n) * 10000n) / (data?.[3]?.result || 1n)
              ) / 100
            }
            max={100}
            className="raise-progress mt-6 w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default PrivateCardNebFinance;
