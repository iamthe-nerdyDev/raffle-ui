import RaffleContract from "@/utils/contract";
import { useCustomInfiniteQuery } from "..";
import { getNftInfo } from "@/utils";

const LIMIT = 6;

async function getAllRaffles(page: number) {
  const contract = new RaffleContract(null);
  const raffles = (await contract.getRaffles(page, LIMIT)) || [];

  const fns = raffles.map(async (raffle) => {
    const nftInfo = await getNftInfo(
      raffle.cw721_contract_addr,
      raffle.token_id
    );

    return { ...raffle, nft: nftInfo };
  });

  return await Promise.all(fns);
}

async function getOngoingRaffles(page: number) {
  const contract = new RaffleContract(null);
  const raffles = (await contract.getOngoingRaffles(page, LIMIT)) || [];

  const fns = raffles.map(async (raffle) => {
    const nftInfo = await getNftInfo(
      raffle.cw721_contract_addr,
      raffle.token_id
    );

    return { ...raffle, nft: nftInfo };
  });

  return await Promise.all(fns);
}

async function getEndedRaffles(page: number) {
  const contract = new RaffleContract(null);
  const raffles = (await contract.getEndedRaffles(page, LIMIT)) || [];

  const fns = raffles.map(async (raffle) => {
    const nftInfo = await getNftInfo(
      raffle.cw721_contract_addr,
      raffle.token_id
    );

    return { ...raffle, nft: nftInfo };
  });

  return await Promise.all(fns);
}

export default function (filter?: string) {
  return useCustomInfiniteQuery({
    key: ["raffles", filter],
    fn: ({ pageParam }) => {
      switch (filter) {
        case "ongoing":
          return getOngoingRaffles(pageParam);

        case "ended":
          return getEndedRaffles(pageParam);

        default:
          return getAllRaffles(pageParam);
      }
    },
  });
}
