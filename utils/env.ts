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
    "orai1963k92ujfjpetnxqmd07ap48837crj6hy44q9kl6a2yfegc38r2s7f4guk",
  COLLECTION_ADDRESS: NEXT_PUBLIC_COLLECTION_ADDRESSES?.split(",") || [],
};
