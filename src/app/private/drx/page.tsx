// Import logo
import type { Metadata } from "next";
import Image from "next/image";
import Web3ButtonContainer from "app/Web3ButtonContainer";
import classNames from "classnames";
import { AiFillTwitterCircle } from "react-icons/ai";
import { BsTelegram, BsYoutube, BsFacebook } from "react-icons/bs";
 import { FaSnapchat } from 'react-icons/fa'
// Images
import Logo from "../../../../public/partners/drx/DRXLogo.png";
import PrivateCard from "./PrivateCard";
import { Suspense } from "react";

const metaDescription = 
  "Introducing DRX Finance, an innovative ecosystem operating on a dual token system with education, security and real world utility at its core. We would like to invite you to get in early before anyone else. Our private sale contribution can be made in ETH, BNB or PLS and each wallet is limited to 2k. Contributors will be added to our DRX DAO and given one of our exclusive NFTs (worth $2500) which allows users to onboard others underneath them and earn together.";
const customLogoPadding = "pb-2 pt-4 px-3";

const shade1 = "#36CCEB"
const shade2 = "#0C639E"
const shade3 = "#32A4BC"
const shade4 = "#1987B9"

export const metadata: Metadata = {
  title: "Dripstax Frenenemies Sale",
  description: metaDescription,
  creator: "Moonvector",
  openGraph: {
    type: "website",
    url: "https://moonvector.io",
    title: "Dripstax Frenenemies Sale",
    description: metaDescription,
    siteName: "Dripstax Frenenemies Sale",
    images: [
      {
        url: "https://moonvector.io/partners/drx/DRXLogo.png",
      },
    ],
  },
  twitter:{
    images: ["https://moonvector.io/partners/drx/DRXLogo.png"]

  }
};

export default function Page() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start px-4">
      <video autoPlay playsInline muted loop preload="auto"
        className="w-full fixed top-0 h-full object-cover z-0 brightness-50"
      >
        <source src="/partners/drx/bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <header
        className={
          "z-30 flex min-h-[88px] w-full flex-row items-center justify-between px-6 py-6 lg:relative"
        }
      >
        <div>
          {/* <Image src={NebulaLogo} alt="Nebula Logo" width={100} height={100} /> */}
        </div>
        <Web3ButtonContainer />
      </header>
      <div className="z-10 flex w-full max-w-4xl grow flex-col items-center py-20">
        {/* Banner */}
        <div className="relative w-full max-w-4xl">
          <div
            className={classNames(
              "w-42 h-42 absolute -top-[63px] left-[calc(50%-64px)] z-10 rounded-full border-4 border-bg_f_light bg-bg_darkest",
              customLogoPadding
            )}
          >
            <Image src={Logo} alt="Logo main" height={80} width={80} />
          </div>
          <div
            className={classNames(
              "relative flex h-[220px] w-full flex-row items-center justify-center rounded-3xl rounded-tr-sm  md:h-[250px]",
              " overflow-hidden border-8 border-bg_f_light shadow-xl"
            )}
          >
            <video autoPlay playsInline controls disablePictureInPicture controlsList="nodownload"
              className="w-full absolute top-0 h-full object-cover"
            >
              <source src="/partners/drx/DRIPSTAX.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

          </div>
        </div>
        {/* Socials */}
        <div className="flex w-full flex-row items-center justify-between gap-x-6 pt-6">
          <h1 className={classNames("text-4xl font-bold drop-shadow", "text-[#36CCEB]")}>
            DRX Finance
          </h1>
          <div className="flex flex-row items-center gap-x-6">
            <a
              href="https://twitter.com/dripstax"
              target="_blank"
              rel="noreferrer"
            >
              <AiFillTwitterCircle
                size="40px"
                className="rounded-full bg-white text-primary hover:text-primary-focus"
              />
            </a>
            <a href="https://t.me/drxchat" target="_blank" rel="noreferrer">
              <BsTelegram
                size="40px"
                className="rounded-full border-2 border-white bg-white text-primary hover:text-primary-focus"
              />
            </a>
            <a href="https://youtube.com/channel/UCnjSDLmTJw_Cach4tZjAOKA?" target="_blank" rel="noreferrer">
              <BsYoutube
                size="40px"
                className="rounded-full border-2 border-white bg-primary text-white hover:bg-primary-focus p-1"
              />
            </a>
            {/* <a href="https://m.facebook.com/dripstax/" target="_blank" rel="noreferrer">
              <BsFacebook
                size="40px"
                className="rounded-full border-2 border-white bg-white text-primary hover:text-primary-focus"
              />
            </a> */}
            <a href="https://www.snapchat.com/add/dripstax" target="_blank" rel="noreferrer">
              <FaSnapchat
                size="40px"
                className="rounded-full border-2 border-white bg-white text-primary hover:text-primary-focus"
              />
            </a>
          </div>
        </div>
        <p className="mt-4 whitespace-pre-wrap mb-12 text-justify text-readable bg-black/60 p-4 rounded-xl">
        Introducing <strong>DRX Finance</strong>, an innovative ecosystem operating on a dual token system with education, security and real world utility at its core.
        We would like to invite you to get in early before anyone else. Our private sale contribution can be made in <strong>ETH</strong>, <strong>BNB</strong> or <strong>PLS</strong> and each wallet is limited to 2k. 
        Contributors will be added to our DRX DAO and given one of our exclusive NFTs (worth $2500) which allows users to onboard others underneath them and earn together. 
          {"\n"}
          {"\n"}
          <strong className="text-[#36CCEB]">Official Launches</strong>
          {"\n"}
        DRXS - 16th September 2023
          {"\n"}
        DRXS - 16th October 2023
        </p>
        <Suspense fallback={<></>}>
          <PrivateCard iconLogo={Logo} customLogoPadding={customLogoPadding} cardTitleInfo={{ title: "DRX Finance", description: "Frenemies Private Sale"}} contracts={[]}/>
        </Suspense>
      </div>
    </main>
  );
}
