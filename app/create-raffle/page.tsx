import { CreateRaffleRender } from "@/components";
import { getCollectionInfo } from "@/utils";
import RaffleContract from "@/utils/contract";
import env from "@/utils/env";
import React from "react";

const CreateRaffle = async () => {
  const addresses = env.COLLECTION_ADDRESS;
  const fns = addresses.map(async (ca) => {
    const data = await getCollectionInfo(ca);
    return { ...data, ca };
  });

  const contract = new RaffleContract(null);
  const [Collections, config] = await Promise.all([
    Promise.all(fns),
    contract.getConfig(),
  ]);

  return (
    <main>
      <div className="px-5 py-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-12 items-center lg:gap-x-10">
            <div className="col-span-12 lg:col-span-7">
              <h1 className="text-4xl font-bold mb-6">Create Raffle</h1>
              <div className="w-full">
                <CreateRaffleRender collections={Collections} config={config} />
              </div>
            </div>

            <div className="hidden lg:block lg:col-span-4 hero-user h-full" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreateRaffle;
