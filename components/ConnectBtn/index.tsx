"use client";

import React from "react";
import { CustomButton } from "..";
import useWalletConnection from "@/hook/useWalletConnection";
import { truncate } from "@/utils";

const ConnectBtn = () => {
  const { isWalletConnecting, isWalletConnected, connect, openView, address } =
    useWalletConnection();

  return (
    <CustomButton
      children={
        isWalletConnecting
          ? "Connecting...."
          : isWalletConnected
          ? truncate(address!)
          : "Connect wallet"
      }
      isDisabled={isWalletConnecting}
      handleClick={isWalletConnected ? openView : connect}
    />
  );
};

export default ConnectBtn;
