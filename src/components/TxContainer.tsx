import { useAtomValue } from "jotai";
import { shownTxQueue, txQueue } from "data/atoms";
import TxCard from "./TxCard";

const TxContainer = () => {
  const shownTxs = useAtomValue(shownTxQueue);
  const currentQueue = useAtomValue(txQueue);

  return (
    <div className="fixed top-24 right-0 z-30 flex flex-col gap-y-3 overflow-hidden pr-8">
      {shownTxs.map((hash, index) => {
        const data = currentQueue[hash];
        if (!data) return null;
        return <TxCard key={`${hash}-${index}`} hash={hash} data={data} />;
      })}
    </div>
  );
};

export default TxContainer;
