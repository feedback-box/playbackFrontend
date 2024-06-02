import Image from "next/image";
import TaskTable from "./TaskTable";
import { NextPage } from "next";
import SideMenu from "~~/components/SideMenu";

const Settings: NextPage = () => {
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

          <TaskTable />
        </div>
      </div>
    </>
  );
};

export default Settings;
