"use client";
import { Provider } from "jotai";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { bsc, mainnet, pulsechain } from "@wagmi/chains";
import TxContainer from "components/TxContainer";
import {chains as chainData} from 'data/chainData'
import sample from "lodash/sample";

if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const supportedChains = [bsc, mainnet, pulsechain];

const { chains, publicClient } = configureChains(supportedChains, [
  publicProvider(),
  w3mProvider({ projectId }),
  jsonRpcProvider({
    rpc: (chain) => {
      const chainRpcs = chainData[chain.id]?.rpcUrls || [];
      return {
        http: chainRpcs.length > 0 ? chainRpcs[0] as string : chain.rpcUrls.default.http[0] as string,
      }
    }
  }),
]);
const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
  connectors: w3mConnectors({
    projectId,
    version: 2,
    chains,
  }),
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <WagmiConfig config={wagmiConfig}>
        <TxContainer />
        {children}
      </WagmiConfig>
      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeMode="dark"
      />
    </Provider>
  );
}
