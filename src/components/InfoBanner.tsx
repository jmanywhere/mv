import React, { Fragment, useRef } from "react";
//Nextjs
import Image from "next/image";
//mv
import img from "./../../public/images/Big Moon.png"; //Cambiar la imagen por la real
//Glide
import Glide, { Slide } from "react-glidejs";

const InfoBanner = () => {
  return (
    <main>
      <section
        className="
                  
                  flex
                  w-full
                  flex-col
                  items-center
                  pt-[64px]
                  pb-[76px]
                  lg:flex-row
                  lg:items-start
                  "
      >
        <div
          className="
                      mb-[63px]
                      flex
                      flex-col
                      items-center
                      lg:mb-0
                      lg:mr-[200px]
        "
        >
          <h2
            className=" 
                    mb-[58px]
                    max-w-[207px]
                    text-center
                    text-[34px]
                    text-white
                    lg:mb-[139px]
                    lg:ml-[166px]
                    lg:max-w-[477px]
                    lg:text-left
                    lg:text-[50px]
                        
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
                    text-lg
                    text-white
                    lg:max-w-[509px]
                    lg:text-left
                    lg:font-bold
                  "
          >
            Under Construction
          </p>
          <p
            className=" 
                    mb-[41px]
                    max-w-[294px]
                    text-center
                    text-lg
                  text-white
                  lg:max-w-[509px]
                  lg:text-left
                  "
          >
            Please come back soon
          </p>
          <div
            className="
                    flex
                    flex-col
                    items-center
                    lg:flex-row
          "
          >
            <button
              className=" 
                    mb-[39px]
                    max-w-[175px]
                    rounded-xl
                    bg-white
                    px-[41px]
                    py-[20px]
                    text-center
                    text-base
                    lg:mb-0
                    lg:mr-[51px]
                    "
            >
              Read More
            </button>
            <a
              className=" 
                  text-center
                  text-base
                  text-white
                  underline
                  underline-offset-4"
            >
              Explore Projects
            </a>
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center">
        <h2
          className="mb-[58px]
                    max-w-[207px]
                    text-center
                    text-[50px]
                    text-white
                    lg:mb-[139px]
                    lg:ml-[166px]
                    lg:max-w-[268px]
                    lg:self-start
                    lg:text-left"
        >
          Overview <span className="text-primary"> &</span> Get Started!
        </h2>
        <div className="flex flex-col lg:flex-row">
          <OverViewCards
            img="/images/overViewIcons/box.png" //poner la imagen OG
            alt="box icon"
            title="whats included"
            text="dewcriptive text"
            href=""
          />
          <OverViewCards
            img="/images/overViewIcons/gear.png"
            alt="gear icon"
            title="whats included"
            text="dewcriptive text"
            href=""
          />
          <OverViewCards
            img="/images/overViewIcons/wallet.png"
            alt="wallet icon"
            title="whats included"
            text="dewcriptive text"
            href=""
          />
        </div>
      </section>
      <section>
        <h2
          className="mb-[58px]
                    max-w-[207px]
                    text-center
                    text-[50px]
                    text-white
                    lg:mb-[139px]
                    lg:ml-[166px]
                    lg:max-w-[427px]
                    lg:self-start
                    lg:text-left"
        >
          Team Behind This
        </h2>
        <TeamCarrousel />
      </section>
    </main>
  );
};

type overViewCardsProps = {
  img: string;
  alt: string;
  title: string;
  text: string;
  href: string;
};

const OverViewCards = (props: overViewCardsProps) => {
  const { img, title, text, alt, href } = props;

  return (
    <section className="relative mb-[63px] flex h-[386px] w-[330px] flex-col items-center  rounded-tr-[25px] bg-[#151d29] lg:mr-[61px] lg:items-start lg:pl-[50px]">
      <div className="absolute top-[-48px] rounded-full  border-[#151d29] bg-[#0c111a] px-[25px] py-[27px]">
        <Image src={img} width={49} height={49} alt={alt} />
      </div>
      <h2
        className="mb-[25px] 
                    pt-[82px]
                    text-center
                    text-[30px]
                    text-white
                    lg:text-left"
      >
        {title}
      </h2>
      <p className="mb-[38px] text-center text-base text-white lg:mb-[52px]">
        {text}
      </p>
      <a href={href} className="text-white underline underline-offset-8">
        Read More
      </a>
    </section>
  );
};

type teamProps = {
  img: string;
  name: string;
  title: string;
  description: string;
};

const TeamCards = (props: teamProps) => {
  const { img, name, title, description } = props;

  return (
    <li>
      <div className="text-white">hacuna matata{img}</div>
    </li>
  );
};

const TeamCarrousel = () => {
  const gliderRef = useRef(null);
  return (
    <>happy</>
    /* <div ClassName="glide">
      <Glide
        ref={gliderRef}
        throttle={0}
        type="slider"
        customSlideAnimation={{
          timeout: 500,
          classNames: "fade",
        }}
        peek={{
          before: 500,
          after: 500,
        }}
        perView={1}
        startAt={3}
        slideClassName="slider__frame"
        focusAt="center"
      >
        <Fragment>
          <TeamCards img="1" />
        </Fragment>
        <Fragment>
          <TeamCards img="2" />
        </Fragment>
        <Fragment>
          <TeamCards img="3" />
        </Fragment>
      </Glide>
    </div> */
  );
};

export default InfoBanner;
