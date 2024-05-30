//TODO
// taskTable.tsx
import React, { useState } from "react";
import Modal from "./Modal";
import NoSSRWrapper from "./NoSSRWrapper";
import VideoCompromise from "./VideoCompromise";

const TaskTable = () => {
  const tasks = [
    { id: "1", title: "Buy tokens", appImage: "/uniswap_logo.png", owner: "fabbaist.eth", price: "50$", taskID: "1" },
    {
      id: "2",
      title: "Place limit order",
      appImage: "/uniswap_logo.png",
      owner: "vitalik.eth",
      price: "40$",
      taskID: "2",
    },
    {
      id: "3",
      title: "Provide liquidity to LP pool",
      appImage: "/1inch_logo.png",
      owner: "hayden.eth",
      price: "35$",
      taskID: "3",
    },
  ];

  const [showModal, setShowModal] = useState(false);
  const [selectedTaskID, setSelectedTaskID] = useState<string | null>(null);

  const openModal = (taskID: string) => {
    console.log(`Loaded Task ID: ${taskID}`);
    setSelectedTaskID(taskID);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTaskID(null);
  };

  return (
    <div className="task-table p-5">
      <table className="w-full bg-white/20 rounded-lg ">
        <thead>
          <tr className="text-left">
            <th>Task</th>
            <th>App</th>
            <th>Owners</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>
                {task.appImage && (
                  <img src={task.appImage} width={35} height={35} alt="logo" className="rounded-full w-35 h-35" /> // eslint-disable-line
                )}
              </td>
              <td>{task.owner}</td>
              <td>{task.price}</td>
              <td>
                <button onClick={() => openModal(task.taskID)} className="bg-purple-600 px-4 py-2 rounded-lg">
                  Earn + $ {selectedTaskID}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <NoSSRWrapper>
        <Modal show={showModal} onClose={closeModal}>
          <VideoCompromise />
        </Modal>
      </NoSSRWrapper>
    </div>
  );
};

export default TaskTable;
