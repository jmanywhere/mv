//React
import Link from "next/link";
import { useState } from "react";
import classNames from "classnames";
//React-icons
import { HiOutlineMenuAlt2 } from "react-icons/hi";
//Nextjs
import Image from "next/image";
//MV
import img from "./../../public/images/Logo-2.png";
import Modal from "./Modal";
import { useAtomValue } from "jotai";
import { raiseBasic } from "data/atoms";

type HeaderProps = {
  price: number;
};

const Header = (props: HeaderProps) => {
  const { price } = props;

  const raiseInfo = useAtomValue(raiseBasic);

  const [showNav, setShowNav] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleOnClose = () => setShowModal(false);

  return (
    <header
      className={classNames(
        "sticky top-0 z-20 flex w-full grow flex-row items-center justify-center py-6 px-10 lg:relative",
        raiseInfo.bg_dark,
        raiseInfo.text
      )}
    >
      <div className="flex grow items-center justify-between">
        <Link
          href="/"
          className="hover:border-2/30 inline-block w-[140px] transition  duration-500 ease-in-out"
        >
          <Image
            src={raiseInfo.icon_logo || img}
            width={raiseInfo.icon_logo ? 100 : undefined}
            height={raiseInfo.icon_logo ? 100 : undefined}
            alt="logo"
          ></Image>
        </Link>
        {!raiseInfo.icon_logo && (
          <HiOutlineMenuAlt2
            onClick={() => setShowNav(!showNav)}
            className="block h-10 w-10 cursor-pointer p-2 text-primary lg:hidden"
          />
        )}
      </div>
      {!raiseInfo.icon_logo && (
        <>
          <nav
            className={
              (showNav ? "right-0" : "-right-full") +
              " fixed bottom-0 top-[88px] flex w-full flex-col items-center gap-x-2 border-[#2B313A] bg-[#10161f] duration-300 ease-in-out lg:static lg:mx-10 lg:flex-row lg:border-l-2 lg:bg-transparent lg:px-9"
            }
          >
            <Link
              href="/about"
              className="hover:border-2/30 w-full items-center justify-center rounded-md px-5 py-4 text-center text-white transition duration-500 ease-in-out hover:rounded-md hover:bg-primary lg:w-auto lg:py-2"
            >
              About
            </Link>
            <button className="hover:border-2/30 w-full items-center justify-center rounded-md px-5 py-4 text-white transition duration-500 ease-in-out hover:rounded-md hover:bg-primary lg:w-auto lg:py-2">
              Dock
            </button>
            <button className="hover:border-2/30 flex w-full items-center justify-center whitespace-nowrap rounded-md px-5 py-4 text-white lg:hidden">
              Explore Project
            </button>
            <button className=" hover:border-2/30 rounded-m w-full items-center justify-center px-5 py-4 text-center text-white transition duration-500 ease-in-out lg:hidden">
              Connect
            </button>
            <button className="hover:border-2/30 mb-[34px] flex max-w-[131px] items-center justify-center rounded-md bg-primary  px-5 py-2 text-white lg:hidden">
              Get Started
            </button>
          </nav>
          <nav className=" hidden grow items-center justify-end lg:flex">
            <div className="transition-left mx-10 flex h-[40px] flex-row items-center gap-x-2 border-r-2 border-l-2 border-[#2B313A] px-9">
              <button className="items-center justify-center whitespace-nowrap rounded-md px-5 py-2 font-sans text-white transition duration-200 ease-in-out hover:rounded-md hover:bg-primary">
                Explore Projects
              </button>
              <button className="hover:border-2/30 whitespace-nowrap rounded-md bg-primary px-5 py-2 text-white transition duration-200 ease-in-out hover:bg-primary/50">
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
        </>
      )}
    </header>
  );
};

export default Header;
