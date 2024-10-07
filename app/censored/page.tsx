import React from "react";
import { CensoredForm } from "@/components";
import RaffleContract from "@/utils/contract";
import { notFound } from "next/navigation";

const Censored = async () => {
  const contract = new RaffleContract(null);
  const config = await contract.getConfig();
  if (!config) return notFound();

  return (
    <main>
      <div className="px-5 mb-8 mt-5">
        <div className="container mx-auto">
          <CensoredForm config={config} />
        </div>
      </div>
    </main>
  );
};

export default Censored;
