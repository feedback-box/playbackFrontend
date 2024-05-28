//TODO
// taskTable.tsx
import React, { useState } from "react";
import Modal from "./Modal";
import NoSSRWrapper from "./NoSSRWrapper";
import VideoCompromise from "./VideoCompromise";

const TaskTable = () => {
  const tasks = [
    { id: "1", title: "Buy tokens", owner: "fabbaist.eth", price: "50$", taskID: "1" },
    { id: "2", title: "Place limit order", owner: "vitalik.eth", price: "40$", taskID: "2" },
    { id: "3", title: "Provide liquidity to LP pool", owner: "hayden.eth", price: "35$", taskID: "3" },
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
    <div className="task-table">
      <table>
        <thead>
          <tr>
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

              <td>{task.owner}</td>
              <td>{task.price}</td>
              <td>
                <button onClick={() => openModal(task.taskID)}>Earn</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <NoSSRWrapper>
        <Modal show={showModal} onClose={closeModal}>
          {selectedTaskID && <VideoCompromise taskID={selectedTaskID} />}
        </Modal>
      </NoSSRWrapper>
    </div>
  );
};

export default TaskTable;
