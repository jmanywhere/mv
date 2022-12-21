//Nextjs
import Link from "next/link";
import Image from "next/image";
//MV
import img from "./../../public/images/Logo-6.png";

const Footer = () => {
  return (
    <footer
      className=" flex
                w-screen
                items-center
                justify-center
                bg-bg_f_light
                py-28
                px-10"
    >
      <div
        className="flex
                  w-full
                  flex-col
                  justify-between
                  lg:max-w-[1200px]
                 lg:flex-row"
      >
        <div className="flex flex-col items-center lg:items-start">
          <Image src={img} alt="logo" className="mb-16 max-w-[107px]"></Image>
          <p
            className=" 
                      hidden
                      font-sans
                      text-sm
                      font-thin
                      text-[#8a93a1]
                      lg:block
                      "
          >
            © 2023 MoonVector. All rights reserved.
          </p>
        </div>
        <nav
          className="flex
                    flex-col
                    items-center
                    lg:items-start"
        >
          <a
            className="
                      flex
                      cursor-pointer  
                      items-center 
                      justify-start
                      border-primary
                      font-sans
                      text-base
                      font-thin
                      leading-[3.38rem]
                      text-white"
          >
            Home
          </a>
          <a
            className="
           flex
           cursor-pointer  
           items-center 
           justify-start
           border-primary
           font-sans
           text-base
           font-thin
           leading-[3.38rem]
           text-white"
          >
            About
          </a>
          <a
            className="
            flex
            cursor-pointer  
            items-center 
            justify-start
            border-primary
            font-sans
            text-base
            font-thin
            leading-[3.38rem]
            text-white"
          >
            Dock
          </a>
          <a
            className="
            flex
            cursor-pointer  
            items-center 
            justify-start
            border-primary
            font-sans
            text-base
            font-thin
            leading-[3.38rem]
            text-white"
          >
            Explore Projects
          </a>
        </nav>
        <nav
          className="
                    flex
                    flex-col
                    items-center
                    lg:items-start"
        >
          <Link
            className="
           items-center 
           justify-start
           border-primary
           font-sans
           text-base
           font-thin
           text-white"
            href="/" //TODO
          >
            Whats included
          </Link>
          <a
            className="
           flex
           cursor-pointer  
           items-center 
           justify-start
           border-primary
           font-sans
           text-base
           font-thin
           leading-[3.38rem]
           text-white"
          >
            How it works
          </a>
          <a
            className="
           flex
           cursor-pointer  
           items-center 
           justify-start
           border-primary
           font-sans
           text-base
           font-thin
           leading-[3.38rem]
           text-white"
          >
            Where do the Funds go
          </a>
        </nav>
        <button
          className="
            hover:border-2/30
                      mb-[52px]
                      flex
                      h-[52px]
                      items-center
                      justify-center
                      rounded-md 
                      bg-white
                      px-[21px]
                      py-[19px]
                      font-sans
                      text-base
                      font-thin
                      transition
                      duration-500
                      ease-in-out
                      hover:bg-primary
"
        >
          Get Started
        </button>
        <p
          className=" 
                      font-sans
                      text-sm
                      font-thin
                      text-[#8a93a1]
                      lg:hidden
                      "
        >
          © 2022 MoonVector. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
