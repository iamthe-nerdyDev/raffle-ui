import React from "react";
import RaffleContract from "@/utils/contract";
import { notFound } from "next/navigation";
import { RenderSingleRaffle, MightInterestYou } from "@/components";
import { getNftInfo } from "@/utils";

const Raffle = async ({ params }: { params: { id: string } }) => {
  const raffle_id = parseInt(params.id);
  if (isNaN(raffle_id)) notFound();

  const contract = new RaffleContract(null);
  const raffle = await contract.getRaffle(raffle_id);
  if (!raffle) notFound();

  const [tickets, nft, config] = await Promise.all([
    contract.getRaffleTickets(raffle_id),
    getNftInfo(raffle.cw721_contract_addr, raffle.token_id),
    contract.getConfig(),
  ]);

  return (
    <main>
      <div className="px-5 mb-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-12 gap-6 lg:items-center">
            <div className="col-span-12 md:col-span-5">
              <img
                className="w-full h-auto"
                src={nft.extension.media || nft.extension.image}
                alt={nft.extension.title || nft.extension.name}
                width={400}
                height={400}
              />
            </div>

            <RenderSingleRaffle
              nft={nft}
              tickets={tickets || []}
              raffle={raffle}
              config={config}
            />
          </div>
        </div>
      </div>

      <MightInterestYou />
    </main>
  );
};

export default Raffle;
