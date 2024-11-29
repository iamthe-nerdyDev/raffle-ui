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
    "orai19226x84vx6lgrczuep9mmp6xahe90au95363vqazu0xuqw0au7mq9xeure",
  COLLECTION_ADDRESS: NEXT_PUBLIC_COLLECTION_ADDRESSES?.split(",") || [],
};
