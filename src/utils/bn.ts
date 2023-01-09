import type { BigNumber } from "ethers";
import { commify, formatEther } from "ethers/lib/utils";

export const prettyBN = (input: BigNumber, decimals?: number) : string => {

  const stringResult = commify(formatEther(input))

  if(decimals === 0)
    return stringResult.split(".")[0] ?? "0"
  if(typeof(decimals) == 'number' && decimals > 0){
    const splitResult = stringResult.split(".")
    if(!splitResult[1]) // ts made me do it
      return splitResult[0] ?? "0"
    splitResult[1] = splitResult[1].substring(0,decimals)
    return splitResult.join(".")
  }
  
  return stringResult
}