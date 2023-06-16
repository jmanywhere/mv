import type { Metadata } from "next";
import Image from 'next/image'
import classNames from 'classnames';
// Components
import Web3ButtonContainer from 'app/Web3ButtonContainer';
// images
import { AiFillTwitterCircle } from "react-icons/ai";
import { BsTelegram } from "react-icons/bs";
import neb1Bg from "../../../../public/partners/background_nebula.png";
import nebBanner from "../../../../public/partners/bg_banner.png";
import NebulaLogo from "../../../../public/partners/NebulaLogo.png";
import Nebuloids from "../../../../public/partners/Nebuloids.png";
import MintCard from './MintCard';

export const metadata: Metadata = {
  title: "Nebuloids Mint",
  description:
    "Nebuloids is a unique collection of NFTs created by Nebula Finance to accompany our hybrid stable coin protocol. Holding the NFT in your wallet creates several benefits to users staked in the Nebulous Conclave, included increased rewards, and team leader abilities. The Nebuloids are a group of intergalactic warriors split into teams and species. Thematically generated to include rarity, a lot of love and effort went into creating this collection. Reveal coming soon.",
  creator: "Moonvector",
  openGraph: {
    type: "website",
    url: "https://moonvector.io",
    title: "Nebuloids Mint",
    description:
    "Nebuloids is a unique collection of NFTs created by Nebula Finance to accompany our hybrid stable coin protocol. Holding the NFT in your wallet creates several benefits to users staked in the Nebulous Conclave, included increased rewards, and team leader abilities. The Nebuloids are a group of intergalactic warriors split into teams and species. Thematically generated to include rarity, a lot of love and effort went into creating this collection. Reveal coming soon.",
    siteName: "Nebuloids Mint",
    images: [
      {
        url: "https://moonvector.io/partners/Nebuloids.png",
      },
    ],
  },
};


const NFTMintPage = () => {

  return <>
    <main className="relative flex min-h-screen flex-col items-center justify-start px-4">
      <Image
        src={neb1Bg}
        alt="Nebulous Background 1"
        className="absolute z-0 h-full w-full object-cover brightness-50"
      />
      <header
        className={
          "z-30 flex min-h-[88px] w-full flex-row items-center justify-between px-6 py-6 "
        }
      >
        <div>
          {/* <Image src={NebulaLogo} alt="Nebula Logo" width={100} height={100} /> */}
        </div>
        <Web3ButtonContainer />

      </header>
      <div className="flex flex-col items-center justify-center relative w-full max-w-4xl mt-14">
          <div
            className={classNames(
              "w-42 h-42 absolute -top-[63px] left-[calc(50%-64px)] z-10 rounded-full border-4 border-bg_f_light bg-bg_darkest px-5 py-8"
            )}
          >
            <Image src={NebulaLogo} alt="Logo main" height={80} width={80} />
          </div>
          <div
            className={classNames(
              "relative flex w-[280px] flex-row items-center justify-center rounded-3xl rounded-tr-sm ",
              " overflow-hidden border-8 border-bg_f_light shadow-xl mt-10"
            )}
          >
            <Image
              src={Nebuloids}
              alt="Nebulous Banner"
              className="h-full w-full object-cover"
            />

            <h1 className="absolute top-0 z-10 w-full grow text-center text-4xl font-bold text-transparent">
              Nebuloids NFT Mint
            </h1>
          </div>
          <div className="max-w- flex flex-row items-center justify-end gap-x-6 pt-6">
          <a
            href="https://twitter.com/nebulafinance__?s=21"
            target="_blank"
            rel="noreferrer"
          >
            <AiFillTwitterCircle
              size="40px"
              className="rounded-full bg-white text-primary hover:text-primary-focus"
            />
          </a>
          <a href="https://t.me/NebulaFinance" target="_blank" rel="noreferrer">
            <BsTelegram
              size="40px"
              className="rounded-full border-2 border-white bg-white text-primary hover:text-primary-focus"
            />
          </a>
        </div>
        <p className="mt-4 whitespace-pre-wrap pb-4 text-justify text-readable drop-shadow-md shadow-black">
          <strong className="text-[#01EEE7]">Nebuloids</strong> is a unique collection of NFTs created by <strong className="text-[#01EEE7]">Nebula Finance</strong> to accompany our hybrid stable coin protocol. Holding the NFT in your wallet creates several benefits to users staked in the <strong className="text-[#01EEE7]">Nebulous Conclave</strong>, included increased rewards, and team leader abilities. 
The Nebuloids are a group of intergalactic warriors split into teams and species.{"\n"}
Thematically generated to include rarity, a lot of love and effort went into creating this collection. 
        </p>
        <h3 className="text-xl text-[#01EEE7] pb-12">
          Reveal coming soon.
        </h3>
        <MintCard/>
        </div>
    </main>
  </>

}

export default NFTMintPage;