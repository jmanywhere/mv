//React
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
    <header
      className="
            sticky
            top-0
            z-20
            flex
            w-full
          grow
            flex-row
            justify-center
            bg-[#10161f]
            py-6
            px-4
            "
    >
      <div
        className=" flex
                    max-w-[1200px]
                    grow
                    flex-row"
      >
        <div
          className="
                  flex
                  max-w-[1200px]
                  grow
                  items-center
                  justify-between"
        >
          <button
            className="
                      hover:border-2/30
                      ml-2.5
                      inline-block
                      max-w-[100px]
                      transition 
                      duration-500
                      ease-in-out
                      hover:rounded-md
                      hover:bg-[#2192dd]
                      lg:m-0
                      lg:max-w-[180px]"
          >
            <Image src={img} alt="logo"></Image>
          </button>
          <HiOutlineMenuAlt2
            onClick={() => setShowNav(!showNav)}
            className="
                          block
                          h-10
                          w-10
                          cursor-pointer
                          p-2
                          text-[#2192dd]
                          lg:hidden"
          />
        </div>
        <nav
          className={
            (showNav ? "right-0" : "-right-full") +
            " botom-0 transition-left fixed top-[60px] flex flex-col items-center border-[#2B313A] bg-[#10161f] lg:static lg:mx-10 lg:flex-row lg:border-x-2 lg:bg-transparent lg:px-9"
          }
        >
          <button
            className="
            hover:border-2/30
                      flex
                      h-10
                      w-[300px]
                      items-center
                      justify-center
                      rounded-md
                      px-5 
                      py-[35px]
                      font-sans
                      text-base
                      font-thin
                      text-white
                      transition
                      duration-500
                      ease-in-out
                      hover:rounded-md
                    hover:bg-[#2192dd]
                      lg:w-[100px]
                      "
          >
            About
          </button>
          <button
            className="
            hover:border-2/30
            flex
            h-10 
            w-[300px]
                      items-center
                      justify-center
                      rounded-md
                      
                      px-5
                      py-[35px]
                      font-sans
                      text-base 
                      font-thin
                      
                      text-white
                      transition
                      duration-500
                      ease-in-out
                      hover:rounded-md
                    hover:bg-[#2192dd]
                      lg:w-[100px]
                      "
          >
            Dock
          </button>
          <button
            className="
            hover:border-2/30
            flex
            h-10 
            w-[300px]
                      items-center
                      justify-center
                      rounded-md
                      
                      px-5
                      py-[35px]
                      font-sans
                      text-base 
                      font-thin
                      
                      text-white
                      
                    lg:hidden
                      "
          >
            Explore Project
          </button>
          <button
            className="
            hover:border-2/30
            flex
            h-10 
            w-[300px]
                      items-center
                      justify-center
                      rounded-md
                      
                      px-5
                      py-[35px]
                      font-sans
                      text-base 
                      font-thin
  
                      text-white
                      transition
                      duration-500
                      ease-in-out
                      lg:hidden
                      "
          >
            Connect
          </button>
          <button
            className="
            hover:border-2/30
            mb-[34px]
            flex 
                      h-10
                      max-w-[131px]
                      items-center
                      justify-center
                      rounded-md

                      bg-[#2192dd]
                      px-5 

                      font-sans
                      text-base
                      font-thin
    
                      text-white
                    lg:hidden
                      "
          >
            Get Started
          </button>
        </nav>
        <nav
          className="
                  hidden
                  grow
                  items-center
                  justify-end
                  lg:flex
                  
                  "
        >
          <div className="botom-0 transition-left fixed top-[60px] mx-10 flex flex-col border-r-2 border-[#2B313A] px-9 lg:static lg:flex-row lg:items-center lg:bg-transparent">
            <button
              className="
              hover:border-2/30
              flex
              h-10 
                      
                        items-center
                        justify-center
                        rounded-md
                       
                        px-5
                        py-[35px]
                        
                        font-sans
                        
                        text-base
                        text-white
                        transition
                        duration-500
                        ease-in-out
                      hover:rounded-md
                        hover:bg-[#2192dd]
                        "
            >
              Explore Projects
            </button>
            <button
              className="
              hover:border-2/30
              flex
              h-10 
                      items-center
                        justify-center
                        rounded-md
                       
                        px-5
                        py-[35px]
                        
                        font-sans 
                        
                        text-base
                        text-white
                        transition
                        duration-500
                        ease-in-out
                        hover:rounded-md
                      hover:bg-[#2192dd]
                      
                        "
            >
              Get Started
            </button>
          </div>
          <button
            className="
            hover:border-2/30
            flex
            h-10 
                      w-[300px]
                      items-center
                      justify-center
                      rounded-md
                      
                      px-5
                      py-[35px]
                      font-sans 
                      text-base
                      font-thin
                      
                      text-white
                      transition
                      duration-500
                      ease-in-out
                      hover:rounded-md
                    hover:bg-[#2192dd]
                      lg:w-[100px]
                      "
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
        ></Modal>
      </div>
    </header>
  );
};

export default Header;
