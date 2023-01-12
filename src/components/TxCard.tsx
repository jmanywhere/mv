// Jotai Data
import classNames from "classnames";
import type { TxData } from "data/atoms";
import { txQueue } from "data/atoms";
import { chains } from "data/chainData";
import { useSetAtom } from "jotai";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineCloseCircle, AiFillCheckCircle } from "react-icons/ai/";
import { IoMdCloseCircleOutline } from "react-icons/io";

const TxCard = (props: { hash: string; data: TxData }) => {
  const {
    hash = "0xbeb16a07ac509821e0858d0ca7e40a8b83b346dcf06e128e277b4a2b88fe5dd3",
    data = { description: "Approving BUSD", chainId: 56, status: "complete" },
  } = props;

  const [shown, setShown] = useState(false);
  const setTxQueue = useSetAtom(txQueue);

  const close = useCallback(() => {
    setShown(false);
    setTimeout(
      () =>
        setTxQueue((draft) => {
          if (!draft[hash]) return;
          if (data.status == "pending") draft[hash].status = "done";
          else delete draft[hash];
        }),
      600
    );
  }, [setTxQueue, data.status, hash]);

  useEffect(() => {
    setTimeout(() => setShown(true), 100);
    if (data.status == "pending") return;
    const timeout = setTimeout(close, data.customTimeout ?? 12000);
    return () => {
      clearTimeout(timeout);
    };
  }, [data, close]);

  const shortHash =
    hash.length > 10
      ? hash.slice(0, 10) + "..." + hash.slice(hash.length - 10, hash.length)
      : "Error";

  const statusIcon: { [key: string]: JSX.Element } = {
    pending: (
      <Image src="/ball_loader.svg" width={30} height={30} alt="tx_loader" />
    ),
    error: (
      <IoMdCloseCircleOutline className="h-[30px] w-[30px] text-red-500" />
    ),
    complete: (
      <AiFillCheckCircle className="h-[30px] w-[30px] text-green-400" />
    ),
  };
  const statusColors: { [key: string]: string } = {
    pending: "bg-yellow-500",
    error: "bg-red-500",
    complete: "bg-green-400",
  };

  const txUrl =
    (chains[data.chainId]?.explorer || "") +
    (chains[data.chainId]?.explorer_tx || "");

  return (
    <div
      className={classNames(
        "w-[307px] overflow-hidden rounded-xl rounded-tr-sm border-2 border-primary bg-bg_f_light pt-3 text-white",
        shown ? "translate-x-0" : "translate-x-96",
        "transition-transform duration-300"
      )}
    >
      <div className="w-full px-4 pb-2">
        <div className="flex flex-row items-center pt-2">
          {statusIcon[data.status]}
          <span className="flex-grow pl-4 font-light">{shortHash}</span>
          <button
            className="ml-4 rounded-full bg-slate-500/20 hover:bg-white hover:text-black"
            onClick={close}
          >
            <AiOutlineCloseCircle />
          </button>
        </div>
        <div className="pt-2">{data.description}</div>
        {shortHash.length > 5 && txUrl ? (
          <a
            href={txUrl + hash}
            rel="noreferrer"
            target="_blank"
            className=" text-sm text-blue-400 underline"
          >
            View in explorer
          </a>
        ) : null}
      </div>
      <div className={classNames("h-2 w-full", statusColors[data.status])} />
    </div>
  );
};

export default TxCard;
