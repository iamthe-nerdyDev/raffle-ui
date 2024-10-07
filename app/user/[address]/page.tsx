import React from "react";
import { getAvatar,  populateNftData } from "@/utils";
import { IconTransfer } from "@tabler/icons-react";
import { UserRafflesRender } from "@/components";
import { notFound } from "next/navigation";
import RaffleContract from "@/utils/contract";

type Props = { params: { address: string }; searchParams: { tab?: string } };

const User = async (props: Props) => {
  const { address: userAddr } = props.params;
  const { tab } = props.searchParams;
  if (![undefined, "won"].includes(tab)) notFound();

  const LIMIT = 6;

  let fn = async () => {
    const contract = new RaffleContract(null);
    const raffles = (await contract.getUserRaffles(userAddr, LIMIT)) || [];

    return await populateNftData(raffles);
  };

  if (tab === "won") {
    fn = async () => {
      const contract = new RaffleContract(null);
      const raffles =
        (await contract.getRafflesWonByUser(userAddr, LIMIT)) || [];

      return await populateNftData(raffles);
    };
  }

  const raffles = await fn();

  return (
    <main className="mt-2">
      <div className="px-5 mb-10">
        <div className="container mx-auto">
          <div className="relative">
            <div className="hero-user bg-orange-100 h-[200px] md:h-[300px] flex items-center justify-center">
              <div className="flex items-center gap-x-1.5">
                <IconTransfer size={35} strokeWidth={1.5} />
                <h1 className="text-3xl mt-1.5 font-bold">Orai</h1>
              </div>
            </div>

            <img
              src={getAvatar(userAddr)}
              alt={userAddr}
              className="absolute bottom-5 left-5 h-20 w-20 flex rounded-full items-center justify-center bg-orange-200"
              width={300}
              height={300}
            />
          </div>
        </div>
      </div>

      <UserRafflesRender tab={tab} userAddr={userAddr} raffles={raffles} />
    </main>
  );
};

export default User;
