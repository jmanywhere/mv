import { BigNumber } from "ethers";
import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { AddressZero } from "@ethersproject/constants";
import { parseEther } from "ethers/lib/utils";

export const stepAtom = atom(1);

const defaultRaiseData: RaiseFormType = {
  // Basics
  name: "",
  description: "",
  referral: "",
  type: "" as const, // options: "fund" || "token" || "charity" || "other
  personalContact: "",
  personalContact2: "",
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
  // Token Specifics - we'll use token address
  tokensPerEth: BigNumber.from("0"), // options depend on chain: busd || native
  tokenToGive: AddressZero, // options depend on chain: busd || native
  tokenToReceive: AddressZero, // options depend on chain: busd || native
  tokenToPay: AddressZero, // options depend on chain: busd || native
  chainId: 0, // options: 1 || 56 
  // Whitelist
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
  extras: {
    referrals: false,
    flexibleDate: false, // send to DB as well
    whitelist: false,
    vesting: false,
    whitelabelFooter: false,
    whitelabelURL: undefined,
    kyc: false,
    audit: false,
  }
}
const raiseTestData: RaiseFormType = {
  // Basics
  name: "Test MoonVector",
  description: "Really dope raise description of stuff, this needs to be at leaste 100 characters long but still not too long in order for it to make sense and look good",
  referral: "0x6b230Af9527AF9d253Fd0B503a9D451239a9e2cE",
  type: "charity" as const, // options: "fund" || "token" || "charity" || "other
  personalContact: "",
  personalContact2: "",
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
  // Token Specifics - we'll use token address
  tokenToReceive: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", // options depend on chain: busd || native
  tokenToGive: "", // options depend on chain: busd || native
  tokenToPay: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", // options depend on chain: busd || native
  tokensPerEth: BigNumber.from("0"),
  chainId: 56, // options: 1 || 56 
  // Whitelist
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
  extras: {
    referrals: false,
    flexibleDate: false, // send to DB as well
    whitelist: false,
    vesting: false,
    whitelabelFooter: false,
    whitelabelURL: undefined,
    kyc: false,
    kycTime: "now",
    audit: false,
  }
}

export const raiseCreateAtom = atomWithImmer<RaiseFormType>(raiseTestData)

export type RaiseFormType = {
  // DB Info
  name: string;
  description: string;
  referral: string; // also to Contract
  type: "fund" | "token" | "charity" | ""; // transform in order to send to contract
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
  personalContact: string;
  personalContact2: string;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  banner: string;
  chainId: number; // options: 1 || 56 
  // Contract Values
  softcap?: BigNumber; // send to DB if hardcap not set
  hardcap: BigNumber;  // send to DB if no softcap
  minContribution?: BigNumber;
  maxContribution?: BigNumber;
  minContributionStep?: BigNumber;
  raiseDuration: number;
  raiseStart: number; // send to dB as well
  tokenToReceive: string; // token that the raise will receive options depend on chain: busd || native
  tokenToGive: string; // token to give to pledgers - custom tokens
  tokenToPay: string; // payment token
  whitelistInfo: {
    type: "token" | "list" | null; // options: token || list
    // If type is token
    tokenAddress: string;
    tokenAmount: BigNumber;
  };
  tokensPerEth: BigNumber;
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
  extras: {
    referrals: boolean;
    flexibleDate: boolean; // send to DB as well
    whitelist: boolean;
    vesting: boolean;
    whitelabelFooter: boolean;
    whitelabelURL?: string;
    kyc: boolean;
    kycTime?: "now" | "later";
    audit: boolean;
  };
};

