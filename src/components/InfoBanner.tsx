import React from "react";
//Nextjs
import Image from "next/image";
//mv
import img from "./../../public/images/Big Moon.png"; //Cambiar la imagen por la real

const InfoBanner = () => {
  return (
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
  );
};

export default InfoBanner;
