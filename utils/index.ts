import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import env from "./env";

export interface NFTInfo {
  token_id: string;
  token_uri: string;
  extension: {
    title?: string;
    description?: string;
    media?: string;
    tags?: string[];
    [key: string]: any;
  };
}

export const getClient = async () => {
  return await CosmWasmClient.connect(env.RPC_URL);
};

export const getUserNfts = async (ca: string, userAddr: string) => {
  const client = await getClient();
  const { ids: tokenIds } = await client.queryContractSmart(ca, {
    tokens: { owner: userAddr, start_after: null, limit: 100 },
  });

  const fns = (tokenIds as string[]).map(async (tokenId) => {
    return getNftInfo(ca, tokenId);
  });

  return await Promise.all(fns);
};

export const getCollectionInfo = async (ca: string) => {
  const client = await getClient();
  const contractInfo = await client.queryContractSmart(ca, {
    contract_info: {},
  });

  return contractInfo as { name: string; symbol: string; [key: string]: any };
};

export const getNftInfo = async (ca: string, token_id: string) => {
  const client = await getClient();
  const query = { nft_info: { token_id } };

  const convert = (uri: string) => {
    if (uri.startsWith("ipfs://")) {
      return uri.replace("ipfs://", "https://ipfs.io/ipfs/");
    }

    return uri;
  };

  const nftInfo = await client.queryContractSmart(ca, query);
  nftInfo.token_id = token_id;

  if (nftInfo.token_uri) {
    let uri = convert(nftInfo.token_uri);
    const metadata = await fetch(uri).then((res) => res.json());

    nftInfo.token_uri = uri;
    metadata.media = convert(metadata.media);
    nftInfo.extension = { ...nftInfo.extension, ...metadata };
  }

  return nftInfo as NFTInfo;
};

export const getAvatar = (seed: string) => {
  return `https://api.dicebear.com/9.x/lorelei/png?seed=${seed}`;
};

export const truncate = (address: string) => {
  return `${address.slice(0, 6)}.....${address.slice(-4)}`;
};

export function calcCountdown(time: number) {
  const now = new Date().getTime();
  const distance = new Date(time).getTime() - now;

  if (distance < 0) {
    return {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
    };
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return {
    days: String(days),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}
