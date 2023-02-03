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
import { useAtom, useAtomValue } from "jotai";
import { connectModal, raiseBasic } from "data/atoms";
import { ConnectorNames, useAuth } from "hooks/useAuth";
import { useWeb3React } from "@web3-react/core";
import { shortAddress } from "utils/txt";

type HeaderProps = {
  price: number;
  hideHeader?: boolean;
};

const Header = (props: HeaderProps) => {
  const { price, hideHeader } = props;
  const { account, logout } = useAuth();
  const raiseInfo = useAtomValue(raiseBasic);
  const [showModal, setShowModal] = useAtom(connectModal);

  const [showNav, setShowNav] = useState(false);
  const handleOnClose = () => setShowModal(false);

  return (
    <>
      {!hideHeader && (
        <header
          className={classNames(
            "sticky top-0 z-30 flex w-full grow flex-row items-center justify-center py-6 px-10 lg:relative",
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
                  " fixed bottom-0 top-[88px] flex w-full flex-col items-center gap-x-2 border-[#2B313A] bg-[#10161f] text-white duration-300 ease-in-out lg:static lg:ml-10 lg:flex-row lg:border-l-2 lg:bg-transparent lg:px-9"
                }
              >
                <Link
                  href="/"
                  className="hover:border-2/30 w-full items-center justify-center rounded-md px-5 py-4 text-center transition duration-500 ease-in-out hover:rounded-md hover:bg-primary/50 lg:w-auto lg:py-2"
                >
                  About
                </Link>
                <button
                  className="hover:border-2/30 w-full items-center justify-center rounded-md px-5 py-4 text-slate-500 transition duration-500 ease-in-out hover:rounded-md hover:bg-primary/50 lg:w-auto lg:py-2"
                  disabled
                >
                  Dock
                </button>
                <button
                  className="hover:border-2/30 flex w-full items-center justify-center whitespace-nowrap rounded-md px-5 py-4 text-slate-500 hover:bg-primary/50 lg:hidden"
                  disabled
                >
                  Explore Project
                </button>
                <button
                  className=" hover:border-2/30 rounded-m w-full items-center justify-center px-5 py-4 text-center transition duration-500 ease-in-out hover:bg-primary/50 lg:hidden"
                  onClick={() => setShowModal(true)}
                >
                  Connect
                </button>
                <button className="hover:border-2/30 mb-[34px] flex max-w-[131px] items-center justify-center rounded-md bg-primary  px-5 py-2 text-slate-500 lg:hidden">
                  Get Started
                </button>
              </nav>
              <nav className=" hidden grow items-center justify-end text-white lg:flex">
                <div className="transition-left mx-6 flex h-[40px] flex-row items-center gap-x-2 border-r-2 border-l-2 border-[#2B313A] px-9">
                  <button className="items-center justify-center whitespace-nowrap rounded-md px-5 py-2 font-sans text-slate-500 transition duration-200 ease-in-out hover:rounded-md hover:bg-primary">
                    Explore Projects
                  </button>
                  <button className="hover:border-2/30 whitespace-nowrap rounded-md bg-primary px-5 py-2 text-slate-500 transition duration-200 ease-in-out hover:bg-primary/50">
                    Get Started
                  </button>
                </div>
                <button
                  className={classNames(
                    "rounded-lg px-5 py-2 transition duration-200 ease-in-out",
                    "hover:border-2/30 hover:border-white hover:bg-primary hover:text-black"
                  )}
                  onClick={() => (account ? logout() : setShowModal(true))}
                >
                  {account ? shortAddress(account) : "Connect"}
                </button>
              </nav>
            </>
          )}
        </header>
      )}
      <Modal
        onClose={handleOnClose}
        visible={showModal}
        modalAnchors={[
          {
            label: "Metamask",
            connector: ConnectorNames.INJECTED,
            icon: "https://f004.backblazeb2.com/file/w3-assets/metamask.png",
          },
          {
            label: "WalletConnect",
            connector: ConnectorNames.WALLET_CONNECT,
            icon: "https://f004.backblazeb2.com/file/w3-assets/walletconnect.png",
          },
          // {
          //   label: "Meatlink",
          //   connector: "",
          // },
        ]}
      />
    </>
  );
};

export default Header;
