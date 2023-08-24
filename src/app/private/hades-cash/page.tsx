// Import logo
import type { Metadata } from "next";
import Image from "next/image";
import Web3ButtonContainer from "app/Web3ButtonContainer";
import classNames from "classnames";
import { AiFillTwitterCircle } from "react-icons/ai";
import { BsTelegram } from "react-icons/bs";
// Images
import HadesLogo from "../../../../public/partners/hades/HadesLogo.png";
import neb1Bg from "../../../../public/partners/hades/bg-main.png";
import nebBanner from "../../../../public/partners/hades/banner.png";
import PrivateCardNebFinance from "./PrivateCard";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Hades Cash Private Sale",
  description:
    "In the echoes of ancient Grecian tales, Hades Cash emerges as a beacon in decentralized finance. Drawing inspiration from the scrolls  of legendary DeFi protocols and fortified by the divine oversight of the Hyper Anti-Dump Equity System  (HADES). this protocol promises not just bountiful rewards but a balanced realm where devout investors flourish under the protective gaze of the underworld god. Hades isn't just an innovation; it's a testament to sustainable prosperity, where reckless actions are checked, and the faithful are showered with divine favor. Join us in this symposium, a blend of ancient wisdom and modern finance, as we chart a path illuminated by the torches of the underworld.",
  creator: "Moonvector",
  openGraph: {
    type: "website",
    url: "https://moonvector.io",
    title: "Hades Cash Private Sale",
    description:
      "In the echoes of ancient Grecian tales, Hades Cash emerges as a beacon in decentralized finance. Drawing inspiration from the scrolls  of legendary DeFi protocols and fortified by the divine oversight of the Hyper Anti-Dump Equity System  (HADES). this protocol promises not just bountiful rewards but a balanced realm where devout investors flourish under the protective gaze of the underworld god. Hades isn't just an innovation; it's a testament to sustainable prosperity, where reckless actions are checked, and the faithful are showered with divine favor. Join us in this symposium, a blend of ancient wisdom and modern finance, as we chart a path illuminated by the torches of the underworld.",
    siteName: "Hades Cash Private Sale",
    images: [
      {
        url: "https://moonvector.io/partners/hades/HadesText.png",
      },
    ],
  },
};

export default function Page() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start bg-gradient-to-tl from-[#17071A] via-[#21062684] via-55% to-[#4b0b57] px-4">
      <Image
        src={neb1Bg}
        alt="Nebulous Background 1"
        className="l-0 absolute top-0 z-0 w-full object-contain brightness-50"
      />
      <header
        className={
          "z-30 flex min-h-[88px] w-full flex-row items-center justify-between px-6 py-6 lg:relative"
        }
      >
        <div>
          {/* <Image src={HadesLogo} alt="Nebula Logo" width={100} height={100} /> */}
        </div>
        <Web3ButtonContainer />
      </header>
      <div className="z-10 flex w-full max-w-4xl grow flex-col items-center py-20">
        {/* Banner */}
        <div className="relative w-full max-w-4xl">
          <div
            className={classNames(
              "w-42 h-42 absolute -top-[63px] left-[calc(50%-64px)] z-10 rounded-full border-4 border-bg_f_light bg-bg_darkest p-2"
            )}
          >
            <Image src={HadesLogo} alt="Logo main" height={100} width={100} />
          </div>
          <div
            className={classNames(
              "relative flex h-[220px] w-full flex-row items-center justify-center rounded-3xl rounded-tr-sm  md:h-[250px]",
              " overflow-hidden border-8 border-bg_f_light bg-black/50 shadow-xl"
            )}
          >
            <Image
              src={nebBanner}
              alt="Nebulous Banner"
              className="absolute top-0 h-full w-full object-cover"
            />

            <h1 className="z-10 w-full grow text-center text-4xl font-bold text-readable">
              Hades Cash Private Sale
            </h1>
            <div className="absolute left-0 top-0 z-0 h-full w-full backdrop-brightness-75" />
          </div>
        </div>
        {/* Socials */}
        <div className="max-w- flex w-full flex-row items-center justify-end gap-x-6 pt-6">
          {/* <a
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
          </a> */}
        </div>
        <p className="mt-4 whitespace-pre-wrap pb-12 text-justify text-readable">
          In the echoes of ancient Grecian tales, Hades Cash emerges as a beacon
          in decentralized finance. Drawing inspiration from the scrolls of
          legendary DeFi protocols and fortified by the divine oversight of the
          Hyper Anti-Dump Equity System (HADES). this protocol promises not just
          bountiful rewards but a balanced realm where devout investors flourish
          under the protective gaze of the underworld god.{"\n"}Hades isn&apos;t
          just an innovation; it&apos;s a testament to sustainable prosperity,
          where reckless actions are checked, and the faithful are showered with
          divine favor. Join us in this symposium, a blend of ancient wisdom and
          modern finance, as we chart a path illuminated by the torches of the
          underworld.
        </p>
        <Suspense fallback={<></>}>
          <PrivateCardNebFinance />
        </Suspense>
      </div>
    </main>
  );
}
