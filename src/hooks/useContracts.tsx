import { useMemo, useState } from "react";
import { Contract, providers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import sample from "lodash/sample";

import SimpleETHRaise from "abi/SimpleCFETH.json";

const abiTypes = {
  SimpleETH: SimpleETHRaise,
};

const useContract = (
  address: string,
  chainId: number,
  type: keyof typeof abiTypes
) => {
  const { library } = useWeb3React();
  const baseLib = useMemo(() => {
    return new providers.StaticJsonRpcProvider(
      sample([
        "https://bsc-dataseed1.binance.org/",
        "https://bsc-dataseed1.defibit.io/",
        "https://bsc-dataseed1.ninicoin.io/",
      ])
    );
  }, []);
  // TODO cross chain implementations, get the static rpc for the respective chain.
  const reader: null | Contract = useMemo(() => {
    return new Contract(address, abiTypes[type].abi, baseLib);
  }, [address, type, baseLib]);

  // IF USER CHANGES THEIR CHAINID, MAKE SURE TO ASK THE IDIOT TO CHANGE IT BACK TO THE APPROPRIATE CHAINID BEFORE FUCKUPS OCCUR

  const writer: null | Contract = useMemo(() => {
    if (!library) return null;
    return new Contract(address, abiTypes[type].abi, library.getSigner());
  }, [library, address, type]);

  return { reader, writer, baseLib };
};

export default useContract;
