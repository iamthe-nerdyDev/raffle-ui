const {
  NEXT_PUBLIC_NETWORK,
  NEXT_PUBLIC_RPC_URL,
  NEXT_PUBLIC_CONTRACT_ADDRESS,
  NEXT_PUBLIC_COLLECTION_ADDRESSES,
} = process.env;

export default {
  NETWORK: (NEXT_PUBLIC_NETWORK || "testnet") as "mainnet" | "testnet",
  RPC_URL: NEXT_PUBLIC_RPC_URL || "https://testnet.rpc.orai.io",
  CONTRACT_ADDRESS:
    NEXT_PUBLIC_CONTRACT_ADDRESS ||
    "orai1qj83g0ddgygfrlp099nsxmpxsk2g3hj59hpxrppg0uvnysz4hkwsgjztp0",
  COLLECTION_ADDRESS: NEXT_PUBLIC_COLLECTION_ADDRESSES?.split(",") || [],
};
