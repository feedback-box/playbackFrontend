import { useEffect, useRef, useState } from "react";
import tokenABI from "../contracts/tokenABI.json";
import { type Schema } from "../ressource";
import uploadFileToS3Bucket from "../utils/uploadToS3Bucket";
import DragAndDrop from "./DragAndDrop";
import ProgressBar from "./ProgressBar";
import { generateClient } from "aws-amplify/api";
import nlp from "compromise";
import { ethers } from "ethers";
import { openDB } from "idb";
import Tesseract from "tesseract.js";
import { useAccount } from "wagmi";

const VideoCompromise = ({ taskID }: { taskID: string }) => {
  const [completed, setCompleted] = useState(0);
  const [localtaskID] = useState(taskID);
  const [frames, setFrames] = useState<string[]>([]);
  const { address: connectedAddress } = useAccount();
  let frameCounter = 1;

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const client = generateClient<Schema>();

  // IF you want to change the frame rate you HAVE TO CHANGE fmfpeg.exec() in createVideo()
  const frameRate = 5;

  const keywordsToRedact = ["ffmpeg", , "medium", "URL", "\\bhttps?://[^\\s]+\\b"];
  console.log("You selected the task" + localtaskID);

  // DB useEffect Hook
  /* eslint-disable */
  useEffect(() => {
    async function initializeDB() {
      const db = await openDB("framesDB", 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("frames")) {
            db.createObjectStore("frames", { keyPath: "id", autoIncrement: true });
          }
        },
      });
      console.log("Database initialized", db);
    }
    initializeDB();

    const payloadSubscription = client.models.Task.onUpdate().subscribe({
      next: async response => {
        console.log("Task updated", response);
        const data = response;
        //TODO unsafe handling of data, good enough for POC
        if (data.id === localtaskID && data.walletAddress === connectedAddress && data.dataPayload !== "") {
          console.log("Task updated, initiating transaction", data);
          const dataPayload = response.dataPayload;
          const tokenAmount = 5;

          // dataPayload handler for the subscription
          await sendTransaction(dataPayload, tokenAmount);
          dataPayload;
        }
      },
      error: error => {
        console.warn("Subscription error", error);
      },
    });

    return () => payloadSubscription.unsubscribe();
  }, [localtaskID, connectedAddress]);

  /* eslint-enable */

  const sendTransaction = async (dataPayload: any, tokenAmount: number) => {
    const contractABI = tokenABI;
    const contractAddress = process.env.TOKEN_ADDRESS;

    if (!contractAddress) {
      throw new Error("Contract address is undefined.");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);

    await provider.send("eth_requestAccounts", []);

    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    try {
      const transaction = await contract.someMethod(dataPayload, tokenAmount);
      console.log("Transaction sent:", transaction);
      const receipt = await transaction.wait();
      console.log("Transaction confirmed:", receipt);
    } catch (error) {
      console.error("Transaction rejected or failed:", error);
    }
  };

  const handleFileChange = async (file: File) => {
    const db = await openDB("framesDB", 1);
    await db.clear("frames");

    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.src = URL.createObjectURL(file);
      videoElement.onloadedmetadata = () => {
        if (canvasRef.current) {
          canvasRef.current.width = videoElement.videoWidth;
          canvasRef.current.height = videoElement.videoHeight;
        }
        // Set frame rate here

        const totalFrames = Math.floor(videoElement.duration * frameRate);
        const framesArray: string[] = [];

        const captureFrame = (currentTime: number) => {
          if (!canvasRef.current) return;
          videoElement.currentTime = currentTime;
          videoElement.onseeked = async () => {
            const canvas = canvasRef.current;
            const context = canvas?.getContext("2d");
            if (context && canvas?.width && canvas?.height) {
              context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
              const dataURL = canvas.toDataURL("image/jpeg");
              framesArray.push(dataURL);

              // Calculate the percentage progress based on the current frame and total frames
              const progress = Math.round((framesArray.length / totalFrames) * 100);
              setCompleted(progress);
              // Update the progress state
              //Tesseract OCR
              const result = await Tesseract.recognize(canvas, "eng");
              const {
                data: { words },
              } = result;

              const normalizedText = words.map(word => word.text.trim().toLowerCase()).join(" ");
              // Compromise NLP
              const doc = nlp(normalizedText);

              // This needs testing with a bunch of different documents to see if it works as expected, aka they have to inlcude Emails and phonenumbers
              const privateEntities = [
                ...doc.people().out("array"),
                ...doc.match("#Email").out("array"),
                ...doc.match("#PhoneNumber").out("array"),
                ...doc.urls().out("array"),
              ];

              const privateTexts = new Set(privateEntities);

              // Redact specified words and draw boxes around other words
              words.forEach(word => {
                const lowerCaseText = word.text.toLowerCase();
                const shouldRedact =
                  privateTexts.has(lowerCaseText) ||
                  keywordsToRedact.some(keyword => new RegExp(keyword || "", "i").test(lowerCaseText));

                if (shouldRedact) {
                  context.fillStyle = "black"; // Redaction color
                  context.fillRect(
                    word.bbox.x0,
                    word.bbox.y0,
                    word.bbox.x1 - word.bbox.x0,
                    word.bbox.y1 - word.bbox.y0,
                  );
                } else {
                  context.strokeStyle = "green"; // Box color for non-redacted words
                  context.lineWidth = 2;
                  context.strokeRect(
                    word.bbox.x0,
                    word.bbox.y0,
                    word.bbox.x1 - word.bbox.x0,
                    word.bbox.y1 - word.bbox.y0,
                  );
                }
              });

              // set compression of frames here

              const redactedFrameData = canvas.toDataURL("image/jpeg", 0.5);
              framesArray.push(redactedFrameData);
              framesArray.forEach(frameDataURL => {
                const image = new Image();
                image.onload = () => {
                  if (canvasRef.current) {
                    const canvas = canvasRef.current;
                    const context = canvas.getContext("2d");
                    if (context && canvas.width && canvas.height) {
                      context.drawImage(image, 0, 0, canvas.width, canvas.height);
                    }
                  }
                };
                image.src = frameDataURL;
              });

              const base64ToBlob = (base64String: string, contentType: any) => {
                const byteCharacters = Buffer.from(base64String.split(",")[1], "base64").toString("binary");
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                return new Blob([byteArray], { type: contentType });
              };

              const base64ToFile = (base64String: any, fileName: string, contentType: any) => {
                const blob = base64ToBlob(base64String, contentType);
                return new File([blob], fileName, { type: contentType });
              };
              if (!connectedAddress) {
                console.error("No connected wallet address found");
                return;
              }
              if (redactedFrameData) {
                const file = base64ToFile(redactedFrameData, `frame_${frameCounter}.jpeg`, "image/jpeg");
                const s3Url = await uploadFileToS3Bucket({
                  file,
                  taskId: localtaskID,
                  walletAddress: connectedAddress,
                });

                frameCounter++;
                console.log("Media uploaded to S3", s3Url);

                const mutationResponse = await client.models.Media.create({
                  s3address: s3Url,
                  taskId: localtaskID,
                  walletAddress: connectedAddress,
                });
                console.log("Media mutation response", mutationResponse);

                const taskUpdateResponse = await client.models.Task.update({
                  id: localtaskID,
                  walletAddress: connectedAddress,
                });

                console.log("Task update response", taskUpdateResponse);

                //call update Task mutation with walletAddress
                const idIDB = currentTime.toString();
                try {
                  console.log("Attempting to store frame in IndexedDB", redactedFrameData);

                  await db.put("frames", { id: idIDB, frame: redactedFrameData });
                } catch (error) {
                  console.error("Storage quota exceeded:", error);
                  // Handle storage quota exceeded by possibly removing old frames
                  const allFrames = await db.getAll("frames");
                  if (allFrames.length > 0) {
                    await db.delete("frames", allFrames[0].id); // remove the oldest frame
                    await db.put("frames", { id: idIDB, frame: redactedFrameData });
                  }
                }

                if (currentTime < totalFrames) {
                  captureFrame(currentTime + 1);
                } else {
                  setFrames(framesArray);
                  await updateTask();

                  await flagFile();
                }
              }
            }
          };
        };
        captureFrame(0);
      };
    }
  };

  const updateTask = async () => {
    const taskUpdateResponse = await client.models.Task.update({
      id: localtaskID,
      walletAddress: connectedAddress,
    });
    console.log("Task update response", taskUpdateResponse);
  };

  const flagFile = async () => {
    const fetchTaskName = async (localtaskID: string) => {
      try {
        const taskData = await client.models.Task.get({ id: localtaskID });
        return taskData?.data?.name || "Unknown Task";
      } catch (error) {
        console.error("Error fetching task name:", error);
        return "Unknown Task";
      }
    };
    if (!connectedAddress) {
      console.error("No connected wallet address found");
      return;
    }
    const taskName = await fetchTaskName(localtaskID);
    const fileContent = `${taskName} `;
    const flagFile = new File([fileContent], "play.back", { type: "text/plain" });
    const flagFileUpload = await uploadFileToS3Bucket({
      file: flagFile,
      taskId: localtaskID,
      walletAddress: connectedAddress,
    });
    console.log("Flag file uploaded to S3", flagFileUpload);
  };

  return (
    <div>
      <h1>Video Frame Extractor</h1>
      <DragAndDrop onFileAccepted={handleFileChange} />
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <ProgressBar bgcolor="#6a1b9a" completed={completed} />
      <div>
        {frames.map((frame, index) => (
          <img key={index} src={frame} alt={`Frame ${index}`} /> // eslint-disable-line 
        ))}
      </div>
    </div>
  );
};
export default VideoCompromise;
