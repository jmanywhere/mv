// State
import { useEffect, useCallback } from "react";
// Web3
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import {
  WalletConnectConnector,
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
} from "@web3-react/walletconnect-connector";
// data
import { useSetAtom } from "jotai";
import { connectModal } from "data/atoms";
import { getRpcUrl, validChains } from "data/chainData";

// Login and Logout Hook -> Handles Wallet Connection
export const useAuth = () => {
  const { activate, deactivate, account, chainId } = useWeb3React();
  const setOpenConnectModal = useSetAtom(connectModal);

  const login = useCallback(
    (specifiedConnector?: ConnectorNames) => {
      const connector = CONNECTORS[specifiedConnector || "injected"];
      if (connector)
        activate(connector, async (error) => {
          console.log("failed activation", error);
          if (
            error instanceof UserRejectedRequestErrorWalletConnect &&
            connector instanceof WalletConnectConnector
          )
            connector.walletConnectProvider = undefined;
          if (error)
            setTimeout(
              () => window.localStorage.setItem("connectorId", ""),
              1000
            );
        })
          .then((c) => {
            window.localStorage.setItem(
              "connectorId",
              specifiedConnector || ""
            );
            setOpenConnectModal(false);
          })
          .catch((e) => {
            console.log("failed to activate", e);
          });
    },
    [activate, setOpenConnectModal]
  );

  const logout = useCallback(() => {
    deactivate();
    if (window.localStorage.getItem("connectorId") == "walletConnect") {
      CONNECTORS.walletConnect.close();
      CONNECTORS.walletConnect.walletConnectProvider = null;
    }
    window.localStorage.setItem("connectorId", "");
  }, [deactivate]);

  return { login, logout, account, chainId };
};
// Automatically try to login if use has previously logged in
export const useEagerConnect = () => {
  const { account, login } = useAuth();

  useEffect(() => {
    const connector = window.localStorage.getItem(
      "connectorId"
    ) as ConnectorNames;
    if (!connector || account) return;
    setTimeout(() => login(connector), 1000);
  }, [login, account]);
};

export const CONNECTORS: { [connector in ConnectorNames]: any } = {
  injected: new InjectedConnector({ supportedChainIds: validChains }),
  walletConnect: new WalletConnectConnector({
    rpc: {
      56: getRpcUrl(56) || "",
      97: getRpcUrl(97) || "",
    },
    qrcode: true,
  }),
  //clover: new CloverConnector({ supportedChainIds: [56] }),
};
export enum ConnectorNames {
  INJECTED = "injected",
  WALLET_CONNECT = "walletConnect",
  //CLOVER_WALLET = "clover",
}
