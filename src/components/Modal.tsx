type ModalProps = {
  modalAnchors: {
    label: string;
    href: string;
  }[];
  visible: boolean;
  onClose: () => void;
};

const Modal = (props: ModalProps) => {
  const { modalAnchors, visible, onClose } = props;

  const anchorsArray = [...modalAnchors];

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex
                     flex-col
                     rounded-xl
                     bg-[#10161f]
                     "
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className=" self-end
          p-[10px]
          text-[#2192dd]"
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
            <button
              key={i}
              className="
                  py-2"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
