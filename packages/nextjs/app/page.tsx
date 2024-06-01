"use client";

import Image from "next/image";
import outputs from "../amplify_outputs.json";
import { Amplify } from "aws-amplify";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import SideMenu from "~~/components/SideMenu";
import TaskTable from "~~/components/TaskTable";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  Amplify.configure({
    ...outputs,
    API: {
      REST: outputs.custom.API,
    },
  });

  return (
    <>
      <div className="flex w-full">
        <SideMenu />
        <div className="flex items-left flex-col flex-grow p-5">
          <Image
            alt="Playback Network logo"
            className="cursor-pointer rounded-md"
            width={280}
            height={100}
            src="/logo2copytext.jpg"
          />
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
