//Nextjs
import Image from "next/image";

const Banner = () => {
  return (
    <section className=" flex flex-col items-center bg-[url('/images/bg/night_sky_banner.png')] bg-cover bg-clip-border bg-right-top bg-no-repeat px-8 pb-32 bg-blend-normal md:rounded-br-[90px]">
      <Image
        src="/images/moon_stages.png"
        height={235}
        width={960}
        alt="All Moon stages"
        className=" mt-20 mb-16"
      />
      <h2 className=" text-center text-4xl text-white">
        Every <span className="text-primary">Moon</span> has to start Somewhere
      </h2>
      <h3 className="text-center text-lg text-white">
        Crowd funding made Easy
      </h3>
    </section>
  );
};

export default Banner;
