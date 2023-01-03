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
          <Link href="/" className="pb-6 text-white">
            Home
          </Link>
          <Link href="/" className="pb-6 text-white">
            About
          </Link>
          <Link href="/" className="pb-6 text-white">
            Dock
          </Link>
          <Link href="/" className="pb-6 text-white">
            Explore Projects
          </Link>
        </nav>
        <nav
          className="
                    flex
                    flex-col
                    items-center
                    lg:items-start"
        >
          <Link href="/" className="pb-6 text-white">
            What&apos;s included
          </Link>
          <Link href="/" className="pb-6 text-white">
            How it works
          </Link>
          <Link href="/" className="pb-6 text-white">
            Where do the funds go
          </Link>
        </nav>
        <button
          className="
                      h-[52px]
                      rounded-md 
                      bg-primary
                      px-3
                      py-2
                      text-white
                      transition
                      duration-200
                      ease-in-out
                      hover:bg-white
                      hover:text-black
"
        >
          Get Started
        </button>
        <p
          className=" 
                      pt-6
                      text-center
                      font-sans
                      text-sm
                      font-thin
                      text-[#8a93a1]
                      lg:hidden
                      "
        >
          © 2023 MoonVector. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
