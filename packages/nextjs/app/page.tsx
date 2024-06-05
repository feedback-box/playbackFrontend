"use client";

import Image from "next/image";
import outputs from "../amplify_outputs.json";
import TaskTable from "../components/TaskTable";
import { Amplify } from "aws-amplify";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import NoSSRWrapper from "~~/components/NoSSRWrapper";
import SideMenu from "~~/components/SideMenu";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  Amplify.configure(outputs);

  return (
    <>
      <div className="flex w-full">
        <SideMenu />
        <NoSSRWrapper>
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
        </NoSSRWrapper>
      </div>
    </>
  );
};

export default Home;
