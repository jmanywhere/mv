//Nextjs
import Link from "next/link";
import Image from "next/image";
//MV
import img from "./../../public/images/Logo-6.png";

const Footer = () => {
  return (
    <footer
      className=" flex
                items-center
                justify-center
                bg-bg_f_light
                px-10
                pb-16
                pt-28"
    >
      <div className="flex flex-col items-center">
        <p
          className=" 
                      hidden
                      text-center
                      font-sans
                      text-sm
                      text-[#8a93a1]
                      lg:block
                      "
        >
          Powered by
        </p>
        <Link href="/">
          <Image src={img} alt="logo" className="mb-16 mt-2 max-w-[107px]" />
        </Link>
        <p
          className=" 
                      hidden
                      text-center
                      font-sans
                      text-sm
                      text-[#8a93a1]
                      lg:block
                      "
        >
          © 2023 MoonVector. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
