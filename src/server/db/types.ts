import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;
export type SocialTypes =
  | "TWITTER"
  | "FB"
  | "DISCORD"
  | "TELEGRAM"
  | "MEDIUM"
  | "REDDIT";
export type RaiseType = "FUNDRAISE" | "CROWDSALE" | "CHARITY";
export type UpsellType = "WHITELABEL" | "DEV" | "AUDIT" | "MARKETING" | "OTHER";
export type Chain = {
  id: number;
  name: string;
};
export type Feature = {
  id: Generated<string>;
  duration: bigint;
  raiseId: string;
};
export type PaymentToken = {
  id: string;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  chainId: number;
  logo: string | null;
};
export type Raise = {
  id: Generated<string>;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  contract: string;
  tokenRaised: string;
  raised: bigint;
  goal: bigint;
  showcase: boolean;
  ownerId: string;
  description: string;
  logo_icon: string;
  banner: string;
  name: string;
  chainId: number;
  flexibleStart: boolean;
  startTime: Timestamp;
  referrerId: string | null;
  userId: string | null;
  acceptTerms: string;
  pledges: number;
  type: RaiseType;
};
export type Report = {
  id: Generated<string>;
  raiseId: string;
  text: string;
  reporter: string;
};
export type Social = {
  id: Generated<number>;
  type: string;
  url: string;
};
export type SocialsOnFunds = {
  verified: boolean;
  raiseId: string;
  socialId: number;
  removed: Generated<boolean>;
};
export type Tag = {
  id: Generated<number>;
  name: string;
};
export type TagsOnRaise = {
  raiseId: string;
  tagId: number;
};
export type Upsell = {
  id: Generated<string>;
  raiseId: string;
  name: string;
  executorId: string;
  amount: bigint;
  type: UpsellType;
  routeName: string;
  otherType: string | null;
  token: string;
};
export type User = {
  id: string;
  alias: string | null;
  writer: boolean;
  dev: boolean;
  auditor: boolean;
  referrer: boolean;
  other: boolean;
  contact: string | null;
  contact2: string | null;
  otherDetail: string | null;
};
export type Writeup = {
  id: Generated<string>;
  raiseId: string;
  text: string;
  authorId: string;
};
export type DB = {
  Chain: Chain;
  Feature: Feature;
  PaymentToken: PaymentToken;
  Raise: Raise;
  Report: Report;
  Social: Social;
  SocialsOnFunds: SocialsOnFunds;
  Tag: Tag;
  TagsOnRaise: TagsOnRaise;
  Upsell: Upsell;
  User: User;
  Writeup: Writeup;
};
