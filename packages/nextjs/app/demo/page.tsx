import Image from "next/image";
import outputs from "../../amplify_outputs.json";
import TaskTable from "../../components/TaskTable";
import { Amplify } from "aws-amplify";
import { NextPage } from "next";
import SideMenu from "~~/components/SideMenu";

const Settings: NextPage = () => {
  Amplify.configure(outputs);
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
