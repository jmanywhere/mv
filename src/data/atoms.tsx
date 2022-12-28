import { atom } from "jotai";

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
