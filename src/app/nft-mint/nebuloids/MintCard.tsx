'use client';

import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount, useBalance, useContractWrite } from "wagmi";
import { waitForTransaction } from '@wagmi/core'
// ABI
import abi from 'abi/NebulousABI';
import { useSetAtom } from "jotai";
import { txQueue } from "data/atoms";

const MintCard = () => {
  const { address } = useAccount();
  const { data: userBalance } = useBalance({ address });
  const [loading, setLoading] = useState(false);
  const [nebToMint, setNebToMint] = useState(0);
  const setTxQueue = useSetAtom(txQueue);


  const inputRef = useRef<HTMLInputElement>(null);

  const {writeAsync, error, reset} = useContractWrite({
    address: "0xDfF321a4C9E02A67B2eD8399DeD1024F84424445",
    abi,
    functionName: "mint",
    args: [BigInt(nebToMint || 0)],
    value: parseEther(`${(nebToMint || 0) * 0.1}`),
    chainId: 1,
  })

  useEffect( () => {
    if(error)
      setTimeout( () => reset(), 5000)
    
  }, [error, reset])

  const mint = async () => {
    // if (inputError.status) {
    //   setLoading(false);
    //   return;
    // }
    setLoading(true);

    const { hash } = await writeAsync().catch((e) => {
      return { hash: false as const };
    });
    if (!hash) {
      setLoading(false);
      return;
    }
    setTxQueue((draft) => {
      draft[hash] = {
        status: "pending",
        description: `Minting Nebuloids`,
        chainId: 1,
      };
    });
    const data = await waitForTransaction({ hash });
    if (data.status === "success") {
      setTxQueue((draft) => {
        const txnData = draft[hash];
        if (!txnData) return;
        txnData.status = data.status === "success" ? "complete" : "error";
        draft[hash] = txnData;
      });
    }
    setLoading(false);
  }

  return <section className="flex flex-col items-center justify-center pb-12">
    <div className=" rounded-3xl bg-bg_f_light px-9 py-8 text-readable w-[280px]">
      <h1 className="text-xl font-bold pb-5">Mint your Nebuloid</h1>
      <div className="flex flex-col gap-y-1">
        <label
              id="pledge-id"
              htmlFor="amount"
              className="pl-2 font-semibold"
            >
              Amount of Nebuloids
            </label>
        <input className={classNames(
          "input-bordered input w-48 border-2 bg-bg_darkest px-3 py-1 text-right"
        )}
          placeholder="Nebuloids to Mint"
          name="amount"
          ref={inputRef}
          onFocus={(e) => e.target.select()}
          type="number"
          step={1}
          onChange={ e => {
            if(isNaN(e.target.valueAsNumber))
              setNebToMint(0)
            else
              setNebToMint(e.target.valueAsNumber)
          }}
        />
        <span className=" ml-3 whitespace-pre-wrap text-sm font-normal text-t_dark">
          Price: 0.1 ETH, Max: 5 NEB{"\n"}Wallet:{" "}
          {formatEther(userBalance?.value || 0n)
            .split(".")
            .map((x, i) => (i == 1 ? x.slice(0, 3) : x))
            .join(".")}
          &nbsp;ETH
        </span>
      </div>
      <div className="flex flex-col items-center justify-center mt-2">
        <button className={classNames("btn btn-primary", loading ? "btn-disabled" : "")} onClick={mint}>
          Mint {loading ? <span className="loading loading-spinner"/> : null}
        </button>
        {error ? 
          <div className="text-sm text-error">
            {(error?.cause as any)?.metaMessages?.[0]}
          </div>
        : null}

      </div>
    </div>
  </section>
}

export default MintCard