import type { NextPage } from "next";
import Layout from "components/Layout";
import Head from "next/head";
import Image from "next/image";
import Logo from "../../public/logo/logo_icon_primary.svg";
import { AiFillTwitterCircle } from "react-icons/ai/";
import { BsTelegram, BsYoutube, BsDiscord } from "react-icons/bs/";
import RaiseCard from "components/raises/RaiseCard";
import { useEagerConnect } from "hooks/useAuth";

/*
  props for Sale pages
  background color
  logo_icon
  banner image
  description
  contract address
  owner address
*/

const MoonPage: NextPage = () => {
  useEagerConnect();
  return (
    <Layout title="Moon Vector - Investment">
      <Head>
        <meta
          name="description"
          content="Invest in Moon Vector project and receive BUSD based on the amount invested. This pool allows you to receive 25% of all raise profits happening in Moon Vector."
        />
      </Head>
      <div className="flex justify-center text-white">
        <div className="mt-24 w-screen px-4 md:max-w-[830px]">
          {/* TODO ADD BACKGROUND OF SPACEMAN THIS WILL BE THE FIRST BANNER TO SHOW UP */}
          <div className=" relative h-[338px] w-full rounded-3xl rounded-tr-sm bg-[url('/images/bg/astro_banner.png')] bg-cover">
            <div className=" w-42 absolute left-[calc(50%-86px)] -top-[86px] rounded-full border-4 border-bg_f_light bg-bg_dark_m p-8">
              <Image src={Logo} alt="Logo main" height={100} width={100} />
            </div>
          </div>
          <div className="flex flex-col items-center justify-between pt-8 pb-8 md:flex-row md:pt-16 md:pb-16">
            {/* This will become the title */}
            <h1 className="text-center text-4xl font-semibold md:text-left">
              Moon Vector Investment
            </h1>
            {/* Only show the socials that we'll be using */}
            <div className="flex flex-row items-center gap-x-4 pt-8 md:pt-0">
              <AiFillTwitterCircle
                size="32px"
                className="rounded-full bg-white text-primary"
              />
              <BsTelegram
                size="28px"
                className="rounded-full bg-white text-primary"
              />
              <BsYoutube size="32px" className=" text-red-500" />
              <BsDiscord size="30px" className=" text-purple-500" />
            </div>
          </div>
          {/* This def needs some love */}
          <p className=" whitespace-pre-line pb-12">
            Some super awesome text here about what this investment pool is all
            about. There are tiers, compounding, shares, rewards. Hell the sky
            is the limit. This needs to be as concise as needs to not miss a
            beat on what the project is about. Let&apos;s take our time figuring
            out what goes here and improve upon it.{"\n\n"}Approve BUSD, send
            BUSD, get Shares, get BUSD perpetually!
          </p>
          <RaiseCard
            title="Moon Vector"
            subtitle="Investor Raise for Royalties"
          />
          <div>OWNER CARD</div>
        </div>
      </div>
    </Layout>
  );
};

export default MoonPage;
