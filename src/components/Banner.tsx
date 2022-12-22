//Nextjs
import Image from "next/image";

const Banner = () => {
  return (
    <section
      className=" bg-black pb-[56px] lg:rounded-br-[90px]" //bg-[url('./../../public/images/FONDO BANNER')] para poner la imagen y quitar bg-black
    >
      <h2 className="pt-[191px] text-center text-4xl text-white">
        Every <span className="text-primary">Moon</span> has start Somewhere
      </h2>
      <h3 className="text-center text-lg text-white">
        Crowd funding made Easy
      </h3>
    </section>
  );
};

export default Banner;
