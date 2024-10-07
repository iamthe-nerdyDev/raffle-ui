"use client";

import React from "react";
import { ChainProvider } from "@cosmos-kit/react";
import { SignerOptions } from "cosmos-kit";
import { chains, assets } from "chain-registry";
import { wallets as KeplrWallet } from "@cosmos-kit/keplr-mobile";
import { wallets as LeapWallet } from "@cosmos-kit/leap-mobile";
import { wallets as OWallet } from "@cosmos-kit/owallet";
import { wallets as OWalletExtension } from "@cosmos-kit/owallet-extension";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import customChains from "./json/chains.json";
import customAssets from "./json/assets.json";

type Props = {
  children: React.ReactNode;
};

export default function ({ children }: Props) {
  const signerOptions: SignerOptions = {};
  const queryClient = new QueryClient({});

  return (
    <QueryClientProvider client={queryClient}>
      <ChainProvider
        chains={[...chains, ...customChains]}
        assetLists={[...assets, ...customAssets]}
        wallets={[
          ...KeplrWallet,
          ...OWallet,
          ...OWalletExtension,
          ...LeapWallet,
        ]}
        signerOptions={signerOptions}
        walletConnectOptions={{
          signClient: {
            projectId: "your_project_id",
            metadata: {
              name: "RugLeopoords",
              description: "RugLeopoords Raffles on $ORAI",
              url: "https://rugleopoords.com",
              icons: ["https://rugleopoords.com/icon.png"],
            },
          },
        }}
      >
        {children}
      </ChainProvider>
    </QueryClientProvider>
  );
}
