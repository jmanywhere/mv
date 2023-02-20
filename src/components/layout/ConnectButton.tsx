"use client";

import Image from "next/image";
import classNames from "classnames";
import { useAccount, useNetwork } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";
import { shortAddress } from "utils/txt";
import { chains } from "data/chainData";
import { useEffect, useState } from "react";

const ConnectButton = () => {
  const { open } = useWeb3Modal();
  const { address } = useAccount();
  const { chain } = useNetwork();

  const [btnInfo, setBtnInfo] = useState<{ text: string; icon: string | null }>(
    {
      text: "Connect",
      icon: null,
    }
  );

  useEffect(() => {
    if (address) {
      setBtnInfo({
        text: shortAddress(address),
        icon: (chain?.id && chains[chain.id]?.icon) || null,
      });
    } else {
      setBtnInfo({ text: "Connect", icon: null });
    }
  }, [address, chain]);

  return (
    <button
      className={classNames(
        "flex w-[145px] flex-row items-center gap-x-2 rounded-lg px-2 py-2 transition duration-200 ease-in-out",
        "hover:border-2/30 hover:border-white hover:bg-primary hover:text-black"
      )}
      onClick={() => open()}
    >
      {btnInfo.icon && (
        <Image src={btnInfo.icon} width={28} height={28} alt="Current chain" />
      )}
      {btnInfo.text}
    </button>
  );
};
export default ConnectButton;
