import { type AppType } from "next/app";
import { Provider } from "jotai";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { bsc, bscTestnet } from "@wagmi/chains";

import { Web3ReactProvider } from "@web3-react/core";
import { providers } from "ethers";

if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const supportedChains = [bsc, bscTestnet];

const { chains, publicClient } = configureChains(supportedChains, [
  publicProvider(),
  w3mProvider({ projectId }),
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

const MyApp: AppType = ({ Component, pageProps }) => {
  const getLibrary = (provider: any): providers.Web3Provider => {
    const library = new providers.Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
  };

  return (
    <Provider>
      <WagmiConfig config={wagmiConfig}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Component {...pageProps} />
        </Web3ReactProvider>
      </WagmiConfig>
      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeMode="dark"
      />
    </Provider>
  );
};

export default trpc.withTRPC(MyApp);
