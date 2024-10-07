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
      isDisabled={isWalletConnecting}
      handleClick={isWalletConnected ? openView : connect}
    >
      {isWalletConnecting
        ? "Connecting...."
        : isWalletConnected
        ? truncate(address!)
        : "Connect wallet"}
    </CustomButton>
  );
};

export default ConnectBtn;
