import Layout from "components/Layout";
import RaiseBanner from "components/raises/RaiseBanner";
import RaiseCard from "components/raises/RaiseCard";
import { raiseBasic } from "data/atoms";
import { useSetAtom } from "jotai";
import type { InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { AiFillTwitterCircle } from "react-icons/ai";
import { BsTelegram, BsYoutube, BsDiscord } from "react-icons/bs";

const SpartaFinanceRaise: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = (props) => {
  const { bannerImage, socials } = props;
  const setRaiseBasics = useSetAtom(raiseBasic);
  useEffect(() => {
    setRaiseBasics({
      bg_dark: "bg-[#162B1D]",
      bg_light: "bg-[rgb(0,73,16)]",
      primary: "bg-[rgb(75,167,114)]",
      icon_logo:
        "https://f004.backblazeb2.com/file/w3-assets/mv/sp_fin/sparta_finance_logo.png",
      text: "text-white",
      contract: "",
    });
  }, [setRaiseBasics]);
  return (
    <Layout title="Sparta Finance Private Sale" hideHeader>
      <Head>
        <meta
          name="description"
          content="Sparta Finance Private sale investing"
        />
      </Head>
      <div className="flex justify-center text-white">
        <div className="mt-24 w-screen px-4 md:max-w-[830px]">
          <RaiseBanner bannerImage={bannerImage} />
          <div className="flex flex-col items-center justify-between pt-8 pb-8 md:flex-row md:pt-16 md:pb-16">
            {/* This will become the title */}
            <h1 className="text-center text-4xl font-semibold md:text-left">
              Sparta Finance Private Sale
            </h1>
            {/* Only show the socials that we'll be using */}
            <div className="flex flex-row items-center gap-x-4 pt-8 md:pt-0">
              {/* <AiFillTwitterCircle
                size="32px"
                className="rounded-full bg-white text-primary"
              /> */}
              <a href={socials.tg} target="_blank" rel="noreferrer">
                <BsTelegram
                  size="28px"
                  className="rounded-full bg-white text-primary hover:text-blue-600"
                />
              </a>
              {/* <BsYoutube size="32px" className=" text-red-500" /> */}
              {/* <BsDiscord size="30px" className=" text-purple-500" /> */}
            </div>
          </div>
          <p className=" whitespace-pre-line pb-12">
            Sparta Finance is a project designed out of passion but built to
            survive a bear market and thrive on the bull! Our insane commitment
            to launch this project during the economic crisis speaks volumes to
            our belief that this project will go above and beyond your
            expectations! It begins with a simple pledge from the user in BUSD,
            which provides you a stake into the contract (your position
            determined as a percentage of the total supply) while using an
            innovative and multitude of ways to sustainability! We begin by
            providing you an LP (Sparta Tokens-BUSD) which provides you with a
            consistent, compoundable, and sustainable daily (Φ) 1.618% return.
          </p>
          <RaiseCard
            title="Sparta Finance"
            subtitle="Private Sale"
            iconLogo="https://f004.backblazeb2.com/file/w3-assets/mv/sp_fin/sparta_finance_logo.png"
          />
          <div className="w-full py-6" />
        </div>
      </div>
    </Layout>
  );
};

export default SpartaFinanceRaise;

export async function getStaticProps() {
  return {
    props: {
      bannerImage:
        "bg-[url('https://f004.backblazeb2.com/file/w3-assets/mv/sp_fin/sparta_bg.jpg')] bg-cover",
      socials: {
        tg: "https://t.me/SpartaFinanceMainChat",
      },
    }, // will be passed to the page component as props
  };
}
