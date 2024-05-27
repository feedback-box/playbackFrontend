import { useState } from "react";
import Modal from "./Modal";
import NoSSRWrapper from "./NoSSRWrapper";
import SideMenu from "./SideMenu";
import TaskTable from "./TaskTable";
import VideoCompromise from "./VideoCompromise";
import { QueryClient } from "@tanstack/react-query";

export default function App() {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <SideMenu />
      <TaskTable />
      <NoSSRWrapper>
        <button className="mt-8 bg-secondary text-white py-2 px-4 rounded-lg" onClick={openModal}>
          Submit Video
        </button>
        <Modal show={showModal} onClose={closeModal}>
          <VideoCompromise taskID="1" />
        </Modal>
      </NoSSRWrapper>
    </div>
  );
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
