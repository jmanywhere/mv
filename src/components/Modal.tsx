import React from "react";

type ModalProps = {
  modalAnchors: {
    label: string;
    href: string;
  }[];
  visible: boolean;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
};

const Modal = (props: ModalProps) => {
  const { modalAnchors, visible, onClose } = props;

  const anchorsArray = [...modalAnchors];

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
      <div
        className="flex
                     flex-col
                     rounded-xl
                     bg-[#10161f]
                     "
      >
        <button
          onClick={onClose}
          className=" self-end
          p-[10px]
                      text-white"
        >
          X
        </button>
        <div
          className=" flex
                      flex-col
                      px-6
                      pb-6
                      text-white
                      
        "
        >
          {[...anchorsArray].map(({ label, href }, i) => (
            <a
              href={href}
              className="
                  py-2"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
