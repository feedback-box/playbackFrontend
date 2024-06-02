import React from "react";
import Image from "next/image";
import DragAndDrop from "../../components/DragAndDrop";

interface Task {
  index: number;
  image: string;
  category: string;
  subcategory: string;
  appWebsite: string;
  task: string;
  difficulty: number;
  timeEstimate: number;
}

interface TaskDetailsProps {
  task: Task;
}

const nothing = () => {
  console.log("nothing");
};

const TaskDetails: React.FC<TaskDetailsProps> = ({ task }) => {
  return (
    <div className="p-4 text-white">
      <h2 className="mb-4 text-white text-4xl font-bold self-center">Earn 25 $BACK</h2>
      <DragAndDrop onFileAccepted={nothing} />
      <div className="flex items-center mb-4">
        <Image src={"/" + task.image} width={100} height={100} alt={task.appWebsite} className="rounded-full mr-4" />
        <div className="flex flex-col pt-5">
          <h3 className="text-lg font-semibold text-white">{task.task}</h3>
          <p className="">
            {task.category} - {task.subcategory}
          </p>
          <p className="">App/Website: {task.appWebsite}</p>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-xl">
          <strong className="text-2xl font-extrabold">Difficulty:</strong> {task.difficulty}
        </p>
        <p className="text-xl">
          <strong className="text-2xl font-extrabold">Time Estimate:</strong> {task.timeEstimate} minutes
        </p>
      </div>
    </div>
  );
};

export default TaskDetails;
