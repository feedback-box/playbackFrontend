"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import PlayNetworkApp from "~~/components/PlaybackNetworkApp";
import SideMenu from "~~/components/SideMenu";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <SideMenu />
      <div className="flex items-center flex-col flex-grow pt-10">
        <span className="block text-2xl mt-2">
          {connectedAddress ? `Connected: ${connectedAddress}` : "Not connected"}
        </span>

        <PlayNetworkApp />
      </div>
    </>
  );
};

export default Home;
