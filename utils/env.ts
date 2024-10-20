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
    "orai1fwp4tvegze5z40rrgcmz0e20qp8tk9axmla72latxyng78thkjdsuzm7td",
  COLLECTION_ADDRESS: NEXT_PUBLIC_COLLECTION_ADDRESSES?.split(",") || [],
};
