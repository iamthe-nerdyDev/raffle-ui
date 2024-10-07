import RaffleContract from "@/utils/contract";
import { useCustomInfiniteQuery } from "..";
import { getNftInfo } from "@/utils";

const LIMIT = 6;

async function getUserWonRaffles(address: string, page: number) {
  const contract = new RaffleContract(null);
  const raffles =
    (await contract.getRafflesWonByUser(address, page, LIMIT)) || [];

  const fns = raffles.map(async (raffle) => {
    const nftInfo = await getNftInfo(
      raffle.cw721_contract_addr,
      raffle.token_id
    );

    return { ...raffle, nft: nftInfo };
  });

  return await Promise.all(fns);
}

async function getUserRaffles(address: string, page: number) {
  const contract = new RaffleContract(null);
  const raffles = (await contract.getUserRaffles(address, page, LIMIT)) || [];

  const fns = raffles.map(async (raffle) => {
    const nftInfo = await getNftInfo(
      raffle.cw721_contract_addr,
      raffle.token_id
    );

    return { ...raffle, nft: nftInfo };
  });

  return await Promise.all(fns);
}

export default function (address: string, filter?: "won") {
  return useCustomInfiniteQuery({
    key: ["user-raffles", address, filter],
    fn: ({ pageParam }) => {
      switch (filter) {
        case "won":
          return getUserWonRaffles(address, pageParam);

        default:
          return getUserRaffles(address, pageParam);
      }
    },
  });
}
