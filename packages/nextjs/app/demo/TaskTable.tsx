"use client";

import React, { useState } from "react";
import Image from "next/image";
import Modal from "../../components/Modal";
import ImageSimilarity from "./ImageSimilarity";
import TaskDetails from "./TaskDetails";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

const tasks: Task[] = [
  {
    index: 1,
    image: "icons/1.jpg",
    category: "Collaboration",
    subcategory: "Team Communication",
    appWebsite: "Zoom",
    task: "Share your entire screen",
    difficulty: 15,
    timeEstimate: 10,
  },
  {
    index: 2,
    image: "icons/2.jpg",
    category: "Finance and Banking",
    subcategory: "Cryptocurrency Trading",
    appWebsite: "Uniswap",
    task: "Trade Ethereum for a stablecoin on Uniswap",
    difficulty: 55,
    timeEstimate: 120,
  },
  {
    index: 3,
    image: "icons/3.jpg",
    category: "Cloud Storage",
    subcategory: "Data Backup",
    appWebsite: "Filecoin",
    task: "Backup a 1GB folder to FileCoin",
    difficulty: 30,
    timeEstimate: 300,
  },
  {
    index: 4,
    image: "icons/4.jpg",
    category: "News and Information",
    subcategory: "News Aggregation",
    appWebsite: "Hacker News",
    task: "Upvote the newest article on Hacker News",
    difficulty: 5,
    timeEstimate: 15,
  },
  {
    index: 5,
    image: "icons/5.jpg",
    category: "Web Browsers",
    subcategory: "Window Management",
    appWebsite: "Google Chrome",
    task: "Split current tab 50% right of the screen and side-by-side the other tab",
    difficulty: 10,
    timeEstimate: 15,
  },
  {
    index: 6,
    image: "icons/6.jpg",
    category: "Development & Design",
    subcategory: "Cryptocurrency Hackathons",
    appWebsite: "ETHGlobal",
    task: "Stake ETH to join an ETHGlobal hackathon",
    difficulty: 70,
    timeEstimate: 250,
  },
  {
    index: 7,
    image: "icons/7.jpg",
    category: "Spreadsheet",
    subcategory: "Spreadsheet Manipulation",
    appWebsite: "Google Sheets",
    task: "Copy the table of US presidents from Wikipedia to a new Google Sheet",
    difficulty: 25,
    timeEstimate: 45,
  },
  {
    index: 8,
    image: "icons/8.jpg",
    category: "Social Media",
    subcategory: "Engagement",
    appWebsite: "X.com",
    task: "Find @playbacknet on x.com and repost our latest post",
    difficulty: 10,
    timeEstimate: 15,
  },
  {
    index: 9,
    image: "icons/9.jpg",
    category: "Web Development",
    subcategory: "Design",
    appWebsite: "WordPress",
    task: "Log in and change the theme on a Wordpress instance",
    difficulty: 40,
    timeEstimate: 90,
  },
  {
    index: 10,
    image: "icons/10.jpg",
    category: "Calendar",
    subcategory: "Scheduling",
    appWebsite: "Apple Calendar",
    task: 'Create a recurring "Send report" invite for every Monday at 10 AM',
    difficulty: 15,
    timeEstimate: 10,
  },
];

const TaskTable: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTaskID, setSelectedTaskID] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const tasksPerPage = 10;
  const totalPages = 99;

  const openModal = (taskID: number) => {
    console.log(`Loaded Task ID: ${taskID}`);
    setSelectedTaskID(taskID);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTaskID(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredTasks = tasks.filter(
    task =>
      task.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.subcategory.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const startIndex = (currentPage - 1) * tasksPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + tasksPerPage);

  const hardcodedImage1 = "/hardcodedImage1.jpg";
  const hardcodedImage2 = "/hardcodedImage3.jpg";

  return (
    <div className="task-table p-3">
      <ImageSimilarity image1Url={hardcodedImage1} image2Url={hardcodedImage2} />
      <div className="flex justify-between mb-4">
        <div></div>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border rounded"
        />
      </div>
      <table className="w-full border border-black">
        <thead>
          <tr className="text-left bg-black text-white">
            <th>Index</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>
              App/
              <br />
              Website
            </th>
            <th>Task</th>
            <th>Difficulty</th>
            <th>{<FontAwesomeIcon icon={faClock} />}</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTasks.map(task => (
            <tr key={task.index}>
              <td>{task.index}</td>
              <td>{task.category}</td>
              <td>{task.subcategory}</td>
              <td className="">
                <Image src={"/" + task.image} width={50} height={50} alt={task.appWebsite} className="rounded-full" />
              </td>
              <td>{task.task}</td>
              <td>{task.difficulty}</td>
              <td>{task.timeEstimate}</td>
              <td>
                <button onClick={() => openModal(task.index)} className="buttonstyle px-4 py-2">
                  Earn
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between mt-4">
        <div></div>
        <div className="flex items-center">
          <button
            onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded mr-2"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded ml-2"
          >
            Next
          </button>
        </div>
      </div>

      {showModal && selectedTaskID !== null && (
        <Modal show={showModal} onClose={closeModal}>
          <TaskDetails task={tasks[selectedTaskID - 1]} />
        </Modal>
      )}
    </div>
  );
};

export default TaskTable;
