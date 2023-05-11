import Image from "next/image";
// Import logo
import NebulaLogo from "../../../../public/partners/NebulaLogo.png";
import Web3ButtonContainer from "app/Web3ButtonContainer";
import classNames from "classnames";
import { AiFillTwitterCircle } from "react-icons/ai";
import { BsTelegram } from "react-icons/bs";
// Images
import neb1Bg from "../../../../public/partners/background_nebula.png";
import nebBanner from "../../../../public/partners/bg_banner.png";

export default function Page() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start px-4">
      <Image
        src={neb1Bg}
        alt="Nebulous Background 1"
        className="absolute z-0 h-full w-full object-cover brightness-50"
      />
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
      <div className="z-10 flex w-full max-w-4xl grow flex-col items-center pt-20">
        {/* Banner */}
        <div className="relative w-full max-w-4xl">
          <div
            className={classNames(
              "w-42 h-42 absolute -top-[63px] left-[calc(50%-64px)] z-10 rounded-full border-4 border-bg_f_light bg-bg_darkest px-5 py-8"
            )}
          >
            <Image src={NebulaLogo} alt="Logo main" height={80} width={80} />
          </div>
          <div
            className={classNames(
              "md:h-[250px] relative flex h-[220px] w-full flex-row items-center justify-center rounded-3xl  rounded-tr-sm",
              " overflow-hidden border-8 border-bg_f_light shadow-xl"
            )}
          >
            <Image
              src={nebBanner}
              alt="Nebulous Banner"
              className="absolute top-0 h-full w-full object-cover"
            />

            <h1 className="z-10 w-full grow text-center text-4xl font-bold text-readable">
              Nebula Finance Private Sale
            </h1>
            <div className="absolute left-0 top-0 z-0 h-full w-full backdrop-brightness-75" />
          </div>
        </div>
        {/* Socials */}
        <div className="max-w- flex w-full flex-row items-center justify-end gap-x-6 pt-6">
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
        <p className="mt-4 whitespace-pre-wrap pb-12 text-justify text-readable">
          Introducing <strong className="text-[#01EEE7]">Nebula Finance</strong>
          , a new hybrid stablecoin solution blending the advantages of both
          algorithmic and collateralized stablecoin models. Utilizing a
          two-token system - Nebula Cash (NUSD) as the stablecoin, and Nebula
          Shares (NSH) the Share token - our protocol introduces dynamic fee
          distribution and tax allocations that respond to market conditions,
          ensuring stability and enticing user engagement.
          {"\n"}
          {"\n"}
          In our quest for a collateralization ratio between 110% and 150%, the
          Nebula Cash Protocol is set to transition from an algorithmic
          stablecoin to a hybrid model. Harnessing fees, taxes, and seigniorage
          rewards, our system builds collateral and encourages user
          participation through staking, rewards, and bond issuance mechanisms.
          Our inventive approach offers a robust and adaptive stablecoin
          solution, promoting long-term stability and widespread adoption in the
          crypto ecosystem. Get ready to experience a revolutionary stablecoin
          solution that achieves the vision it set out to become!
        </p>
      </div>
    </main>
  );
}
