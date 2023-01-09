import sample from "lodash/sample"

type ChainInfo = {
  rpcUrls: Array<string>, // RPC URLs to read from
  explorer: string, // Base Explorer URL path
  explorer_tx: string, // Explorer tx URL path
  name: string, // Name of the chain
  icon: string, // URL to icon image
}

export const chains: { [chainId: number] : ChainInfo} = {
  56: {
    rpcUrls: [
      "https://bsc-dataseed1.binance.org/",
      "https://bsc-dataseed1.defibit.io/",
      "https://bsc-dataseed2.binance.org/",
      "https://bsc-dataseed3.binance.org/",
      "https://bsc-dataseed4.binance.org/",
    ],
    explorer: "https://bscscan.com/",
    explorer_tx: "tx/",
    name: "BSC",
    icon: "",
  },
}

export const validChains = Object.keys(chains).map( chainId => parseInt(chainId))

export const getRpcUrl = (chainId: number) =>{
  const chain = chains[chainId]
  if(!chain) return ""
  return sample(chain.rpcUrls)
}