//React
import Link from "next/link";
import { useState } from "react";
//React-icons
import { HiOutlineMenuAlt2 } from "react-icons/hi";
//Nextjs
import Image from "next/image";
//MV
import img from "./../../public/images/Logo-2.png";
import Modal from "./Modal";

type HeaderProps = {
  price: number;
};

const Header = (props: HeaderProps) => {
  const { price } = props;

  const [showNav, setShowNav] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleOnClose = () => setShowModal(false);

  return (
    <header className="md:block-inline sticky top-0 z-20 flex w-full grow flex-row justify-center bg-bg_dark_m py-6 px-10">
      <div className="flex grow items-center justify-between">
        <Link
          href="/"
          className="hover:border-2/30 inline-block w-[140px] transition  duration-500 ease-in-out"
        >
          <Image src={img} alt="logo"></Image>
        </Link>
        <HiOutlineMenuAlt2
          onClick={() => setShowNav(!showNav)}
          className="block h-10 w-10 cursor-pointer p-2 text-[#2192dd] lg:hidden"
        />
      </div>
      <nav
        className={
          (showNav ? "right-0" : "-right-full") +
          " transition-left fixed bottom-0 top-[88px] flex w-full flex-col items-center border-[#2B313A] bg-[#10161f] lg:static lg:mx-10 lg:flex-row lg:border-x-2 lg:bg-transparent lg:px-9"
        }
      >
        <Link
          href="/about"
          className="hover:border-2/30 items-center justify-center rounded-md px-5 py-2 text-white transition duration-500 ease-in-out hover:rounded-md hover:bg-[#2192dd]"
        >
          About
        </Link>
        <button className="hover:border-2/30 items-center justify-center rounded-md px-5 py-2 text-white transition duration-500 ease-in-out hover:rounded-md hover:bg-[#2192dd]">
          Dock
        </button>
        <button className="hover:border-2/30 flex h-10  w-[300px] flex-nowrap items-center justify-center rounded-md px-5 py-[35px] text-white lg:hidden">
          Explore Project
        </button>
        <button className=" hover:border-2/30 rounded-m flex  h-10 w-[300px] items-center justify-center px-5 py-[35px] text-white transition duration-500 ease-in-out lg:hidden">
          Connect
        </button>
        <button className="hover:border-2/30 lg: idden mb-[34px] flex h-10 max-w-[131px] items-center justify-center rounded-md  bg-[#2192dd] px-5 font-sans text-base font-thin text-white">
          Get Started
        </button>
      </nav>
      <nav className=" hidden grow items-center justify-end lg:flex">
        <div className="transition-left mx-10 flex flex-row border-r-2 border-[#2B313A] px-9  ">
          <button className="items-center justify-center whitespace-nowrap rounded-md px-5 py-2 font-sans text-white transition duration-200 ease-in-out hover:rounded-md hover:bg-[#2192dd]">
            Explore Projects
          </button>
          <button className="hover:border-2/30 flex whitespace-nowrap rounded-md px-5 py-2 text-white transition duration-200 ease-in-out hover:bg-[#2192dd]">
            Get Started
          </button>
        </div>
        <button
          className="hover:border-2/30 rounded-md px-5 py-2 text-white transition duration-200 ease-in-out hover:bg-primary"
          onClick={() => setShowModal(true)}
        >
          Connect
        </button>
      </nav>
      <Modal
        onClose={handleOnClose}
        visible={showModal}
        modalAnchors={[
          {
            label: "Meatlink",
            href: "",
          },
          {
            label: "Meatlink",
            href: "",
          },
          {
            label: "Meatlink",
            href: "",
          },
        ]}
      />
    </header>
  );
};

export default Header;
