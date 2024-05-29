"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import SideMenu from "~~/components/SideMenu";
import TaskTable from "~~/components/TaskTable";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="background flex w-full h-full">
        <SideMenu />
        <div className="flex items-left flex-col flex-grow p-5">
          <h1 className="flex mt-10 ml-10 font-bold text-2xl">GM Mfers, gimme your data</h1>
          <span className="block text-l m-2">
            {connectedAddress ? `Connected: ${connectedAddress}` : "Not connected"}
          </span>
          <TaskTable />
        </div>
      </div>
    </>
  );
};

export default Home;
