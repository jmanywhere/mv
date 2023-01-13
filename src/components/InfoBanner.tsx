import React from "react";
//Nextjs
import Image from "next/image";
//mv
import img from "./../../public/images/Big Moon.png"; //Cambiar la imagen por la real
import classNames from "classnames";

const InfoBanner = () => {
  return (
    <section className=" flex w-full flex-col items-center pt-[64px] pb-[76px] lg:flex-row lg:items-start">
      <div className="mb-[63px] flex flex-col items-center lg:mb-0 lg:mr-[200px]">
        <h2
          className=" 
                  mb-[58px]
                  max-w-[207px]
                  text-center
                  text-[34px]
                  text-white
                  lg:mb-[139px]
                  lg:ml-[166px]
                  lg:max-w-[426px]
                  lg:text-left
                      
        "
        >
          About Moon Vector
        </h2>
        <div className="max-h-[200px] w-full overflow-hidden">
          <Image
            src={img}
            alt="moon image"
            className="w-full max-w-[343px] rounded-tr-[100px] lg:max-w-[674px] "
          />
        </div>
      </div>
      <div>
        <p
          className=" 
                  mb-[35px]
                  max-w-[294px]
                  text-center
                  text-lg font-bold 
                  text-white
                  lg:max-w-[calc(100%-40%)]
                  lg:text-left
                "
        >
          Moon Vector is a new decentralized Private Sale, Public Sale, and
          Crowd Funding platform that allows projects to seamlessly raise funds,
          with or without having a token, allowing you the option of Crypto, or
          traditional non-crypto, crowdfunding and fundraising.
        </p>
        <p
          className=" 
                  mb-[41px]
                  max-w-[294px]
                  text-center
                  text-lg
                text-white
                lg:max-w-[calc(100%-40%)]
                lg:text-left
                "
        >
          Whether launching a private sale for your P2E Game IDO, launching a
          royalty sharing fundraise to launch your non-crypto based video game,
          raising funds for your brick and mortar retail store, or just
          crowdfunding some relief to help pay for your cute little kitty
          cat&apos;s vet bill, Moon Vector has you covered. Easy to deploy, easy
          to set your terms and timeline, and easy to collect and distribute
          funds/tokens, Moon Vector removes the friction and headache from
          launching projects and jumping through hoops. Just set your terms,
          customize your page, and you&apos;re ready to go!
        </p>
        <div
          className="
                  flex
                  flex-col
                  items-center
                  lg:flex-row
        "
        >
          <a
            href="https://medium.com/@admin_77189/introducing-moon-vector-d0f65fc533b9"
            target="_blank"
            rel="noreferrer"
            className={classNames(
              "mb-[39px] max-w-[175px] rounded-xl bg-white px-[41px] py-[20px] text-center text-base lg:mb-0 lg:mr-[51px]",
              "hover:bg-primary hover:text-white"
            )}
          >
            Read More
          </a>
          <a className="cursor-default text-center text-base text-t_dark underline underline-offset-4">
            Explore Projects
          </a>
        </div>
      </div>
    </section>
  );
};

export default InfoBanner;
