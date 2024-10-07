import React from "react";
import { CustomButton, HomeRaffleRender } from "@/components";
import Link from "next/link";
import RaffleContract from "@/utils/contract";
import { notFound } from "next/navigation";
import { getNftInfo } from "@/utils";

const Home = async ({ searchParams }: { searchParams: { tab?: string } }) => {
  const { tab } = searchParams;
  if (![undefined, "ongoing", "ended"].includes(tab)) notFound();

  const LIMIT = 6;

  let fn = async (params: { page: number }) => {
    const contract = new RaffleContract(null);
    const raffles = (await contract.getRaffles(params.page, LIMIT)) || [];

    const fns = raffles.map(async (raffle) => {
      const nftInfo = await getNftInfo(
        raffle.cw721_contract_addr,
        raffle.token_id
      );

      return { ...raffle, nft: nftInfo };
    });

    return await Promise.all(fns);
  };

  if (tab === "ongoing") {
    fn = async (params: { page: number }) => {
      const contract = new RaffleContract(null);
      const raffles =
        (await contract.getOngoingRaffles(params.page, LIMIT)) || [];

      const fns = raffles.map(async (raffle) => {
        const nftInfo = await getNftInfo(
          raffle.cw721_contract_addr,
          raffle.token_id
        );

        return { ...raffle, nft: nftInfo };
      });

      return await Promise.all(fns);
    };
  }

  if (tab === "ended") {
    fn = async (params: { page: number }) => {
      const contract = new RaffleContract(null);
      const raffles =
        (await contract.getEndedRaffles(params.page, LIMIT)) || [];

      const fns = raffles.map(async (raffle) => {
        const nftInfo = await getNftInfo(
          raffle.cw721_contract_addr,
          raffle.token_id
        );

        return { ...raffle, nft: nftInfo };
      });

      return await Promise.all(fns);
    };
  }

  const raffles = await fn({ page: 1 });

  const tabs = [
    { title: "All Raffles" },
    { title: "Ongoing Raffles", key: "ongoing" },
    { title: "Ended Raffles", key: "ended" },
  ];

  return (
    <main>
      <div className="mb-6 relative h-[450px] flex flex-col justify-center bg-orange-200 px-5">
        <div className="container mx-auto">
          <div className="w-full max-w-[35rem]">
            <h1 className="text-[40px] font-extrabold">NFT Raffle</h1>
            <p className="mb-7 text-base leading-[30px] text-gray-700">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>

            <Link href={"/create-raffle"}>
              <CustomButton children={"Create Raffle +"} />
            </Link>
          </div>
        </div>
      </div>

      <div className="px-5 w-full mb-8">
        <div className="container mx-auto w-full">
          <div className="grid grid-cols-12 gap-6 w-full">
            <div className="col-span-12 md:col-span-4 lg:col-span-3">
              <div className="flex flex-col gap-y-1.5 sticky top-5">
                {tabs.map((item, idx) => (
                  <Link
                    href={item.key ? `?tab=${item.key}` : "/"}
                    key={`tab-${idx}`}
                    className={`w-full ${
                      item.key === tab
                        ? "bg-orange-200 border-orange-400"
                        : "bg-transparent border-transparent hover:bg-orange-200"
                    } border-[1px] py-3.5 rounded-md cursor-pointer transition-all`}
                  >
                    <p className="text-sm text-center">{item.title}</p>
                  </Link>
                ))}
              </div>
            </div>

            <HomeRaffleRender raffles={raffles} tab={tab} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
