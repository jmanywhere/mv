import { BigNumber } from "ethers";
import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { AddressZero } from "@ethersproject/constants";
import { parseEther } from "ethers/lib/utils";

export const stepAtom = atom(4);

const defaultRaiseData = {
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
}
const raiseTestData = {
  // Basics
  name: "Test MoonVector",
  description: "Really dope raise description of stuff, this needs to be at leaste 100 characters long but still not too long in order for it to make sense and look good",
  referral: "0x123456789123456789123456789123456789",
  type: "charity", // options: "fund" || "token" || "charity" || "other
  socials: {
    twitter: "https://twitter.com/Moonvector_",
    medium: "https://medium.com/@moonvector",
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
  backgroundColor: "#d24dff",
  primaryColor: "#00b386",
  secondaryColor: "#ff7733",
  logo: "/logo/icon.png",
  banner: "/images/Big Moon.png",
  // Raise Specifics
  softcap: parseEther("25000"),
  hardcap: parseEther("50000"),
  minContribution: parseEther("100"),
  maxContribution: parseEther("1000"),
  minContributionStep: parseEther("1"),
  raiseDuration: 3 * 24 * 3600, //3 days
  raiseStart: 1678838400,
  flexibleDate: false,
  hasReferral: false,
  // Token Specifics - we'll use token address
  tokenToReceive: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", // options depend on chain: busd || native
  chainId: 56, // options: 1 || 56 
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
}

export const raiseCreateAtom = atomWithImmer<RaiseFormType>(raiseTestData)

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
  // 0 - free, transfer fee 10% - success fee 15%
  // 1 - 100$, transfer fee  2% - success fee  7%
  // 2 - 200$, transfer fee  1% - success fee  5%
  // 3 - 500$, transfer fee  0% - success fee  4%
  // 4 - 1000$, transfer fee 0% - success fee  2%
  // 5 - 2000$, transfer fee 0% - success fee  1%
  // 6+ - 0$, transfer fee 4% - success fee  0%  CHARITY ONLY
  pricing: number; // will only show/use 0 -> free if factory has user with a free raise
  // UPSELLS -> these are all optional but affect pricing
  extras: string[];
};

