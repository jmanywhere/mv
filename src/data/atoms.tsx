import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";

export const raiseBasic = atom<{
  bg_dark: string;
  bg_light: string;
  primary: string;
  icon_logo: string | null;
  text: string;
  contract: string;
}>({
  bg_dark: "bg_dark_m",
  bg_light: "bg_f_light",
  primary: "primary",
  icon_logo: null,
  text: "white",
  contract: "",
});

export const connectModal = atom(false);

export type TxData = {
  description: string; // Short description of what needs to happen
  chainId: number; // This will let the UI know which block explorer to use
  status: "complete" | "pending" | "error" | "done";
};
export const txQueue = atomWithImmer<{ [hash: string]: TxData }>({});

export const shownTxQueue = atom((get) => {
  const currentQueue = get(txQueue);
  const txArray = Object.keys(currentQueue);
  return txArray.filter((hash) => currentQueue[hash]?.status !== "done");
});
