import env from "@/utils/env";

export default {
  CHAIN_NAME: env.NETWORK === "testnet" ? "oraichaintestnet" : "oraichain",
};
