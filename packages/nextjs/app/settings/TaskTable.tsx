"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Modal from "../../components/Modal";
import VideoCompromise from "../../components/VideoCompromise";
import { type Schema } from "../../ressource";
import { generateClient } from "aws-amplify/api";
import "datatables.net";
import "datatables.net-dt/css/jquery.dataTables.css";
import $ from "jquery";

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
  const [tasks, setTasks] = useState<Task[]>([]);
  const tableRef = useRef<HTMLTableElement>(null);
  const client = generateClient<Schema>();

  const fetchTasks = useCallback(async () => {
    try {
      const response = await client.models.Task.list();
      const taskData = response.data as Task[];
      console.log("Fetched tasks:", taskData);
      setTasks(taskData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, []);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    const storedTimestamp = localStorage.getItem("tasksTimestamp");
    const cacheDuration = 1000 * 60 * 5; // 5 minutes

    if (storedTasks && storedTimestamp) {
      const parsedTasks = JSON.parse(storedTasks);
      const parsedTimestamp = JSON.parse(storedTimestamp);
      if (Date.now() - parsedTimestamp < cacheDuration) {
        setTasks(parsedTasks);
        return;
      }
    }
    fetchTasks();

    // Fetch new tasks in the background
    const intervalId = setInterval(() => {
      fetchTasks();
    }, 15000);

    return () => clearInterval(intervalId);
  }, [fetchTasks]);

  useEffect(() => {
    if (tableRef.current) {
      $(tableRef.current).DataTable();
    }
  }, [tasks]);

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
      <table ref={tableRef} className="display w-full border border-black">
        <thead>
          <tr className="text-left bg-black text-white">
            <th>Task</th>
            <th>App</th>
            <th>Owners</th>
            <th>Difficulty</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td title={task.description ?? "1"} className="font-bold ">
                {task.name}
              </td>
              <td className="items-center justify-center">
                <Image src="/uniswap_logo.png" width={50} height={50} alt="logo" className="rounded-full w-35 h-35" />
              </td>
              <td>{task.walletAddress ? task.walletAddress : <div className="black-bar" />}</td>
              <td>{task.difficulty}</td>
              <td>
                <button onClick={() => openModal(task.id)} className="buttonstyle px-4 py-2 rounded-lg">
                  Earn
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onClose={closeModal}>
        <VideoCompromise taskID={selectedTaskID!} />
      </Modal>
    </div>
  );
};

export default TaskTable;
