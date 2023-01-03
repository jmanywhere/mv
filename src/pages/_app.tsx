import { type AppType } from "next/app";
import { Provider } from "jotai";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { Web3ReactProvider } from "@web3-react/core";
import { providers } from "ethers";

const MyApp: AppType = ({ Component, pageProps }) => {
  const getLibrary = (provider: any): providers.Web3Provider => {
    const library = new providers.Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
  };

  return (
    <Provider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Component {...pageProps} />
      </Web3ReactProvider>
    </Provider>
  );
};

export default trpc.withTRPC(MyApp);
