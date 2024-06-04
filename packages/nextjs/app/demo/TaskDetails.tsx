import React, { useEffect, useState } from "react";
import Image from "next/image";
import DragAndDrop from "../../components/DragAndDrop";
import tokenABI from "../../contracts/tokenABI.json";
import { type Schema } from "../../ressource";
import uploadFileToS3Bucket from "../../utils/uploadToS3Bucket";
import ProgressBar from "./LoadingBar";
import VideoProcessor from "./VideoProcessor";
import { generateClient } from "aws-amplify/api";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

const client = generateClient<Schema>();

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

const TaskDetails: React.FC<TaskDetailsProps> = ({ task }) => {
  const { address: connectedAddress } = useAccount();
  const [loading, setLoading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [redactedFrames, setRedactedFrames] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [dataPayload, setDataPayload] = useState<any>(null);
  const [additionalTime, setAdditionalTime] = useState(false);
  const localtaskID = task.index;

  const handleFileSubmit = (file: File) => {
    setLoading(true);
    setUploadComplete(false);
    setVideoFile(file);
  };

  const handleProgress = (progress: number) => {
    console.log(`Progress: ${progress}%`);
    setProgress(progress);
  };

  const handleComplete = () => {
    setLoading(false);
    setUploadComplete(true);
    uploadPlayBackFile();
    setAdditionalTime(true);
  };

  const handleError = (error: Error) => {
    console.error("Error processing video:", error);
    setLoading(false);
    setUploadComplete(false);
  };

  const addRedactedFrame = (frame: string) => {
    setRedactedFrames(prevFrames => [...prevFrames, frame]);
  };

  useEffect(() => {
    if (additionalTime) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 100); // 1% progress every 0.1 seconds for 10 seconds
      return () => clearInterval(interval);
    }
  }, [additionalTime]);

  const uploadPlayBackFile = async () => {
    if (!connectedAddress) {
      console.error("No connected wallet address found");
      return;
    }
    const taskName = `{"taskName":"${task.task}", "taskId": ${task.index} "description":"A detailed task description goes here.","additionalInfo":{"priority":"high","deadline":"2024-07-01T00:00:00Z"}}`;
    const fileContent = `${taskName} `;
    const flagFile = new File([fileContent], "play.back", { type: "text/plain" });
    const flagFileUpload = await uploadFileToS3Bucket({
      file: flagFile,
      taskId: localtaskID.toString(),
      walletAddress: connectedAddress,
    });
    console.log("Flag file uploaded to S3", flagFileUpload);
  };

  /* es-lint-disable */
  useEffect(() => {
    const updateTaskSubscription = async () => {
      const subscription = await client.models.Task.observeQuery().subscribe({
        next: ({ items: dataPayload }) => {
          setDataPayload(dataPayload);
        },
        error: error => {
          console.error("Error fetching data payload:", error);
        },
      });
      console.log(subscription);
    };
    updateTaskSubscription();
    console.log("Data Payload", dataPayload);
  }, []);

  const sendTx = () => {
    const dataPayloadHard =
      "0x54bd977e8b46f329a42d1dd8ca295e2fa3488c2cf4ee3fcbcf3babd16faaabc87730fe1a6bb4f73d865835ecd076bf20b04f96ca16bfd50e5f4d8235833ce3b21c";

    const bigNumber = 1000000000000000000n;
    const tokenAmount = BigInt(bigNumber);
    sendTransaction(dataPayloadHard, tokenAmount);
  };

  const sendTransaction = async (dataPayload: any, tokenAmount: bigint) => {
    const contractABI = tokenABI;
    const contractAddress = "0xF00DF8031E2e20F5334A3a4A0FbAaD156B6E58c7";

    if (!contractAddress) {
      throw new Error("Contract address is undefined.");
    }

    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }
    const provider = new ethers.BrowserProvider(window.ethereum);

    try {
      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const transaction = await contract.mint(dataPayload, tokenAmount, connectedAddress, { gasLimit: 99999999 });
      console.log("Transaction sent:", transaction);
      const receipt = await transaction.wait();
      console.log("Transaction confirmed:", receipt);
    } catch (error) {
      console.error("Transaction rejected or failed:", error);
    }
  };

  return (
    <div className="p-4 text-white">
      <h2 className="mb-4 text-white text-4xl font-bold self-center">Earn 25 $BACK</h2>
      <DragAndDrop onFileAccepted={handleFileSubmit} />
      {loading && (
        <div className="mt-4">
          <ProgressBar progress={progress} />
        </div>
      )}
      {videoFile && (
        <VideoProcessor
          file={videoFile}
          onProgress={handleProgress}
          onComplete={handleComplete}
          onError={handleError}
          onFrameProcessed={addRedactedFrame}
        />
      )}
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
        <p className="flex flex-row text-xl items-center">
          <strong className="text-2xl font-extrabold align-middle">Time Estimate:</strong> {task.timeEstimate} minutes
          <button
            className={`bg-grey-600 text-white p-4 ml-auto mt-4 ${uploadComplete ? "buttonstyle" : "bg-gray-600"}`}
            onClick={sendTx}
            disabled={!uploadComplete}
          >
            Send it
          </button>
        </p>
      </div>

      <div className="mt-4">
        {redactedFrames.map((frame, index) => (
          <img key={index} src={frame} alt={`Redacted Frame ${index}`} className="mb-4" /> // eslint-disable-line
        ))}
      </div>
    </div>
  );
};

export default TaskDetails;
