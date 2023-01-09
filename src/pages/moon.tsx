import type { NextPage } from "next";
import Layout from "components/Layout";
import Head from "next/head";
import Image from "next/image";
import Logo from "../../public/logo/logo_icon_primary.svg";
// SM Icons
import { AiFillTwitterCircle, AiFillMediumCircle } from "react-icons/ai/";
import { BsTelegram, BsYoutube, BsDiscord, BsReddit } from "react-icons/bs/";
import { SiGitbook } from "react-icons/si/";
// Component
import RaiseCard from "components/raises/RaiseCard";
// Hooks
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
            <div className="absolute left-[calc(50%-64px)] -top-[64px] flex w-32 items-center justify-center rounded-full border-4 border-bg_f_light bg-bg_dark_m p-6 md:-top-[86px] md:left-[calc(50%-86px)] md:w-40 md:p-8">
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
              <AiFillMediumCircle
                size="32px"
                className="rounded-full bg-white text-black"
              />
              <BsYoutube size="32px" className=" text-red-500" />
              <BsDiscord size="30px" className=" text-purple-500" />
              <BsReddit
                size="30px"
                className=" rounded-full bg-white text-[rgb(255,53,0)]"
              />
              <SiGitbook size="30px" className=" text-[rgb(169,194,255)]" />
            </div>
          </div>
          {/* This def needs some love */}
          <p className=" whitespace-pre-line pb-12">
            Moon Vector is a new decentralized fund-raising, and CrowdFunding
            platform that allows projects to seamlessly raise funds utilizing
            both tokenized and non-tokenized business models.
            <br />
            Striving to be the most frictionless and easy to launch fund-raising
            option in Web3, we&apos;re empowering projects to skip the hype
            train model in DeFi by introducing a royalty sharing crowd fund
            option that allows projects to focus on the business, and not the
            token price.
            <br />
            With a roadmap that includes cross-chain royalty pools, tokenized
            and non-tokenized raises, project aggregation, P2P payments,
            education tools, OTC share swaps and more, Moon Vector is a forward
            facing game changer that has been battle tested with real projects
            for nearly a year before officially coming to market.
            <br />
            <br />
            You don&apos;t want to miss this one!
          </p>
          <RaiseCard
            title="Moon Vector"
            subtitle="Investor Raise for Royalties"
            chain={56}
            contract=""
          />
          <div>OWNER CARD</div>
        </div>
      </div>
    </Layout>
  );
};

export default MoonPage;
