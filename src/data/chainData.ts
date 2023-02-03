import sample from "lodash/sample"

type ChainInfo = {
  rpcUrls: Array<string>; // RPC URLs to read from
  explorer: string; // Base Explorer URL path
  explorer_tx: string; // Explorer tx URL path
  name: string; // Name of the chain
  icon: string; // URL to icon image
  defaultStable?: string; // Default stable coin symbol
  allowedTokens: Array< {symbol: string, decimals: number, address: string,} >;
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
    icon: "https://f004.backblazeb2.com/file/w3-assets/chains/bsc+logo.png",
    allowedTokens: [
      {symbol: "bnb", decimals: 18, address: "0x0000000000000000000000000000000000000000"},
      {symbol: "busd", decimals: 18, address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"},
      {symbol: "usdt", decimals: 18, address: "0x55d398326f99059ff775485246999027b3197955"},
    ],
    defaultStable: "busd"
  },
  97: {
    rpcUrls: [
      "https://data-seed-prebsc-1-s1.binance.org:8545/",
      "https://data-seed-prebsc-2-s1.binance.org:8545/",
      "http://data-seed-prebsc-1-s2.binance.org:8545/",
      "http://data-seed-prebsc-2-s2.binance.org:8545/",
      "https://data-seed-prebsc-1-s3.binance.org:8545/",
      "https://data-seed-prebsc-2-s3.binance.org:8545/",
    ],
    explorer: "https://testnet.bscscan.com/",
    explorer_tx: "tx/",
    name: "BSC Testnet",
    icon: "https://f004.backblazeb2.com/file/w3-assets/chains/TESTbsc+logo.png",
    allowedTokens: []
  },
}

export const validChains = Object.keys(chains).map( chainId => parseInt(chainId))

export const getRpcUrl = (chainId: number) =>{
  const chain = chains[chainId]
  if(!chain) return ""
  return sample(chain.rpcUrls)
}