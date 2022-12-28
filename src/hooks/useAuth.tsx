// State
import { useState, useEffect, useCallback } from "react";
// Web3
import { useWeb3React } from "@web3-react/core";
import {
  InjectedConnector,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import {
  WalletConnectConnector,
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
} from "@web3-react/walletconnect-connector";
// data
import sample from "lodash/sample";
import { useSetAtom } from "jotai";
import { connectModal } from "data/atoms";

const validChains = [56, 97];

const getRpcUrl = (chainId: number) => {
  const chainRpc: { [key: number]: Array<string> | null } = {
    1: null,
    56: [
      "https://bsc-dataseed1.binance.org/",
      "https://bsc-dataseed1.defibit.io/",
      "https://bsc-dataseed2.binance.org/",
      "https://bsc-dataseed3.binance.org/",
      "https://bsc-dataseed4.binance.org/",
    ],
    97: [
      "https://data-seed-prebsc-1-s1.binance.org:8545/",
      "https://data-seed-prebsc-2-s1.binance.org:8545/",
      "http://data-seed-prebsc-1-s2.binance.org:8545/",
      "http://data-seed-prebsc-2-s2.binance.org:8545/",
    ],
  };
  if (!chainRpc[chainId]) return null;
  return sample(chainRpc[chainId]);
};
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
    [activate]
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
