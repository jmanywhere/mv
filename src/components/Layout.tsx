import { Provider } from "jotai";

import { trpc } from "../utils/trpc";

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
//React
import type { ReactNode } from "react";
//NextJS
import Head from "next/head";
//MV
import Header from "./Header";
import Footer from "./Footer";
import SimpleFooter from "./SimpleFooter";
import { useAtomValue } from "jotai";
import { raiseBasic } from "data/atoms";
import classNames from "classnames";
import TxContainer from "./TxContainer";

/// @TODO add props to select a simple Footer
/// @TODO add props for whitelabel

const Layout = (props: {
  children: ReactNode;
  title: string;
  hideHeader?: boolean;
  simpleFooter?: boolean;
  meta?: {
    url?: string;
    description?: string;
    image?: string;
  };
}) => {
  const { title, children, hideHeader, simpleFooter, meta } = props;
  const raiseStyles = useAtomValue(raiseBasic);
  const getLibrary = (provider: any): providers.Web3Provider => {
    const library = new providers.Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
  };
  return (
    <Provider>
      <WagmiConfig config={wagmiConfig}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <div
            className={classNames(
              raiseStyles.bg_dark,
              raiseStyles.text,
              hideHeader ? "pt-10" : "pt-0"
            )}
          >
            <Head>
              <title>{title}</title>
              <meta property="twitter:title" content={title} />
              <meta name="og:title" content={title} />
              {meta && (
                <>
                  {meta.url && <meta name="og:url" content={meta.url} />}
                  {meta.description && (
                    <meta name="description" content={meta.description} />
                  )}
                  {meta.description && (
                    <meta
                      property="og:description"
                      content={meta.description}
                    />
                  )}
                  {meta.description && (
                    <meta
                      property="twitter:description"
                      content={meta.description}
                    />
                  )}
                  <meta
                    property="og:image"
                    content={
                      meta.image || "https://moonvector.io/logo/mainLogo.png"
                    }
                  />
                  <meta
                    property="twitter:image"
                    content={
                      meta.image || "https://moonvector.io/logo/mainLogo.png"
                    }
                  />
                  <meta property="twitter:card" content="summary" />
                  <meta property="twitter:site" content="@MoonVector_" />
                </>
              )}
            </Head>
            <Header price={100000000} hideHeader={hideHeader} />
            <main>
              <TxContainer />
              {children}
            </main>
            {simpleFooter ? <SimpleFooter /> : <Footer />}
          </div>
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

export default Layout;
