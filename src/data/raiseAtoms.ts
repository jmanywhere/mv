import { BigNumber } from "ethers";
import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";

export const stepAtom = atom(1);

export const raiseCreateAtom = atomWithImmer({
  // Basics
  name: "",
  description: "",
  referral: "",
  type: "", // options: "fund" || "token" || "charity" || "other
  socials: {
    twitter: "",
    medium: "",
    discord: "",
    telegram: "",
    reddit: "",
    facebook: "",
    website: "",
    docs: "",
    // these others are nice to have
    instagram: "",
    linkedin: "",
    youtube: "",
    tiktok: "",
    twitch: "",
    github: "",
  },
  // customization
  backgroundColor: "",
  primaryColor: "",
  secondaryColor: "",
  logo: "",
  banner: "",
  // Raise Specifics
  softcap: BigNumber.from("0"),
  hardcap: BigNumber.from("0"),
  minContribution: BigNumber.from("0"),
  maxContribution: BigNumber.from("0"),
  minContributionStep: BigNumber.from("0"),
  raiseDuration: 0,
  raiseStart: 0,
  flexibleDate: false,
  hasReferral: false,
  // Token Specifics
  tokenToReceive: "busd", // options depend on chain: busd || native
  // Whitelist
  whitelist: false,
  whitelistInfo: {
    type: "token", // options: token || list
    // If type is token
    tokenAddress: "",
    tokenAmount: BigNumber.from("0"),
  },
  // PriceSelection
  // Pricing -> 0 ,1 ,2 ,3 and so on depending on how many pricing options we want
  pricing: 0, // will only show/use 0 -> free if factory has user with a free raise
  // UPSELLS -> these are all optional but affect pricing
  extras: []
})