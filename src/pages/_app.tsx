import { type AppType } from "next/app";
import { Provider } from "jotai";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { bsc } from "@wagmi/chains";

import { Web3ReactProvider } from "@web3-react/core";
import { providers } from "ethers";

if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const chains = [bsc];

const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    version: "2",
    appName: "unicus",
    chains,
    projectId,
  }),
  provider,
});
const ethereumClient = new EthereumClient(wagmiClient, chains);

const MyApp: AppType = ({ Component, pageProps }) => {
  const getLibrary = (provider: any): providers.Web3Provider => {
    const library = new providers.Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
  };

  return (
    <Provider>
      <WagmiConfig client={wagmiClient}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Component {...pageProps} />
        </Web3ReactProvider>
      </WagmiConfig>
      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeMode="dark"
        themeColor="default"
        themeBackground="gradient"
      />
    </Provider>
  );
};

export default trpc.withTRPC(MyApp);
