import { useMemo } from "react";
import { Contract, providers } from "ethers";
import { useWeb3React } from "@web3-react/core";

import SimpleETHRaise from "abi/SimpleCFETH.json";
import MVRaise from "abi/MVRaise.json";
import ERC20 from "abi/ERC20.json";
import { getRpcUrl } from "data/chainData";

const abiTypes = {
  SimpleETH: SimpleETHRaise,
  MVRaise: MVRaise,
  ERC20: ERC20,
};

const useContract = (
  address: string,
  chainId: number,
  type: keyof typeof abiTypes
) => {
  const { library } = useWeb3React();
  const baseLib = useMemo(() => {
    if (chainId == 97) return library;
    return new providers.StaticJsonRpcProvider(getRpcUrl(chainId));
  }, [chainId, library]);
  // TODO cross chain implementations, get the static rpc for the respective chain.
  const reader: null | Contract = useMemo(() => {
    if (!address) return null;
    return new Contract(address, abiTypes[type].abi, baseLib);
  }, [address, type, baseLib]);

  // IF USER CHANGES THEIR CHAINID, MAKE SURE TO ASK THE IDIOT TO CHANGE IT BACK TO THE APPROPRIATE CHAINID BEFORE FUCKUPS OCCUR

  const writer: null | Contract = useMemo(() => {
    if (!library || !address) return null;
    return new Contract(address, abiTypes[type].abi, library.getSigner());
  }, [library, address, type]);

  return { reader, writer, baseLib };
};

export default useContract;
