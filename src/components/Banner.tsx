//Nextjs
import Image from "next/image";

const Banner = () => {
  return (
    <section
      className="
                flex
                w-full
                flex-col
                items-center
                
                bg-black
                pt-[191px]
                pb-[56px]
                lg:rounded-br-[150px]
                lg:pt-[430px]
                lg:pb-[108px]
                " //bg-[url('./../../public/images/FONDO BANNER')] para poner la imagen y quitar bg-black
    >
      <h2
        className=" 
                    text-center
                    text-[34px]
                    text-white
                    
      "
      >
        Every <span className="text-[#2192dd]">Moon</span> has start Somewhere
      </h2>
      <h3
        className=" 
                  text-lg
                    text-white    
      "
      >
        Crowd funding made Easy
      </h3>
    </section>
  );
};

export default Banner;
