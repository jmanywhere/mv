import { useAuth, ConnectorNames } from "hooks/useAuth";
import Image from "next/image";

type ModalProps = {
  modalAnchors: {
    label: string;
    connector: ConnectorNames;
    icon?: string;
  }[];
  visible: boolean;
  onClose: () => void;
};

const Modal = (props: ModalProps) => {
  const { modalAnchors, visible, onClose } = props;

  const anchorsArray = [...modalAnchors];
  const { login } = useAuth();

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className=" rounded-xl border-2 border-slate-300 bg-bg_dark_m py-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className=" flex flex-col pb-3 text-white">
          {[...anchorsArray].map(({ label, connector, icon }, i) => (
            <button
              key={i}
              className="flex flex-row items-center gap-4 py-2 px-6 hover:bg-slate-400"
              onClick={() => login(connector)}
              disabled={!connector}
            >
              <div>
                {icon && (
                  <Image
                    src={icon}
                    width={40}
                    height={40}
                    alt={label + "-icon"}
                  />
                )}
              </div>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
