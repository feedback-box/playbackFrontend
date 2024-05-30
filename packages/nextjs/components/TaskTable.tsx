//TODO
// taskTable.tsx
import React, { useCallback, useEffect, useState } from "react";
import { type Schema } from "../ressource";
import Modal from "./Modal";
import NoSSRWrapper from "./NoSSRWrapper";
import VideoCompromise from "./VideoCompromise";
import { generateClient } from "aws-amplify/api";

interface Task {
  app: string | null;
  appImage: string | null;
  createdAt: string;
  description: string;
  difficulty: number;
  id: string;
  mediaId: string | null;
  medias: any | null;
  name: string;
  updatedAt: string;
  walletAddress: string | null;
}

const TaskTable: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTaskID, setSelectedTaskID] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]); // Add state for tasks
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const client = generateClient<Schema>();

  /* eslint-disable */
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await client.models.Task.list();
      const taskData = response.data as Task[];
      console.log("Fetched tasks:", taskData);
      setTasks(taskData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);
  /* eslint-enable */
  useEffect(() => {
    fetchTasks();
    const intervalId = setInterval(() => {
      fetchTasks(); // Fetch tasks every 5 seconds
    }, 15000);

    return () => {
      clearInterval(intervalId); // Clean up the interval when the component unmounts
    };
  }, [fetchTasks]);

  const openModal = (taskID: string) => {
    console.log(`Loaded Task ID: ${taskID}`);
    setSelectedTaskID(taskID);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTaskID(null);
  };
  /* eslint-disable */
  return (
    <div className="task-table p-5">
      {loading ? (
        <div>Loading tasks...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
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
                <td title={task.description ?? ""}>{task.name}</td> {/* Add title attribute with task description */}
                <td>

                  <img src="../public/uniswap_logo.png" width={35} height={35} alt="logo" className="rounded-full w-35 h-35" />

                </td>
                <td>{task.walletAddress}</td>
                <td>{task.difficulty}</td>
                <td>
                  <button onClick={() => openModal(task.id)} className="bg-purple-600 px-4 py-2 rounded-lg">
                    Earn
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <NoSSRWrapper>
        <Modal show={showModal} onClose={closeModal}>
          <VideoCompromise taskID={selectedTaskID!} />
        </Modal>
      </NoSSRWrapper>
    </div>
  );
};

export default TaskTable;
