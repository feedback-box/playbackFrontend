"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import App from "~~/components/PlaybackNetworkApp";
import SideMenu from "~~/components/SideMenu";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <SideMenu />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
            <span className="block text-2xl mt-2">
              {connectedAddress ? `Connected: ${connectedAddress}` : "Not connected"}
            </span>
          </h1>

          <App />
        </div>
      </div>
    </>
  );
};

export default Home;
