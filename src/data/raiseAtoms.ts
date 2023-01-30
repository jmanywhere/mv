import { BigNumber } from "ethers";
import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { AddressZero } from "@ethersproject/constants";

export const stepAtom = atom(3);

export const raiseCreateAtom = atomWithImmer<RaiseFormType>({
  // Basics
  name: "",
  description: "",
  referral: "",
  type: "", // options: "fund" || "token" || "charity" || "other
  socials: {
    twitter: "",
    medium: "",
    telegram: "",
    website: "",
    docs: "",
    youtube: "",
    // these others are nice to have
    discord: "",
    facebook: "",
    reddit: "",
    instagram: "",
    linkedin: "",
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
  // Token Specifics - we'll use token address
  tokenToReceive: AddressZero, // options depend on chain: busd || native
  chainId: 0, // options: 1 || 56 
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

type RaiseFormType = {
  // Basics
  name: string;
  description: string;
  referral: string;
  type: string; // options: "fund" ||
  socials: {
    twitter?: string;
    medium?: string;
    telegram?: string;
    website?: string;
    docs?: string;
    youtube?: string;
    // these others are nice to have
    discord?: string;
    facebook?: string;
    reddit?: string;
    instagram?: string;
    linkedin?: string;
    tiktok?: string;
    twitch?: string;
    github?: string;
  };
  // customization
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  banner: string;
  // Raise Specifics
  softcap?: BigNumber;
  hardcap: BigNumber;
  minContribution?: BigNumber;
  maxContribution?: BigNumber;
  minContributionStep?: BigNumber;
  raiseDuration: number;
  raiseStart: number;
  flexibleDate: boolean;
  hasReferral: boolean;
  // Token Specifics
  tokenToReceive: string; // options depend on chain: busd || native
  chainId: number; // options: 1 || 56 
  // Whitelist
  whitelist: boolean;
  whitelistInfo: {
    type: string; // options: token || list
    // If type is token
    tokenAddress: string;
    tokenAmount: BigNumber;
  };
  // PriceSelection
  // Pricing -> 0 ,1 ,2 ,3 and so on depending on how many pricing options we want
  pricing: number; // will only show/use 0 -> free if factory has user with a free raise
  // UPSELLS -> these are all optional but affect pricing
  extras: string[];
};

