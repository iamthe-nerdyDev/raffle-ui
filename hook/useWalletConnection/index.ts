import { Config } from "@/constants";
import { useChain } from "@cosmos-kit/react";

export default function () {
  return useChain(Config.CHAIN_NAME);
}
