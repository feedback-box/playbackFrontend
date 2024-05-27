import { useEffect, useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import nlp from "compromise";
import { openDB } from "idb";
import Tesseract from "tesseract.js";

const VideoCompromise = ({ taskID }: { taskID: string }) => {
  const [frames, setFrames] = useState<string[]>([]);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // IF you want to change the frame rate you HAVE TO CHANGE fmfpeg.exec() in createVideo()
  const frameRate = 5;
  const ffmpeg = new FFmpeg();
  ffmpeg.on("log", ({ message }) => {
    console.log(message);
  });
  const keywordsToRedact = ["ffmpeg", , "medium", "URL", "\\bhttps?://[^\\s]+\\b"];

  useEffect(() => {
    async function initializeDB() {
      await openDB("framesDB", 1, {
        upgrade(db) {
          db.createObjectStore("frames", { keyPath: "id", autoIncrement: true });
        },
      });
    }
    async function getWalletAddress() {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          setWalletAddress(accounts[0]);
        } catch (error) {
          console.error("User denied account access");
        }
      } else {
        console.error("MetaMask not detected");
      }
    }

    initializeDB();
    getWalletAddress();
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const db = await openDB("framesDB", 1);
    await db.clear("frames");

    const file = URL.createObjectURL(event.target.files[0]);
    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.src = file;
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
              const frameData = canvas.toDataURL("image/jpeg");
              framesArray.push(frameData);

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
              framesArray[framesArray.length - 1] = redactedFrameData;
              try {
                await db.put("frames", { frame: redactedFrameData, id: currentTime });
              } catch (error) {
                console.error("Storage quota exceeded:", error);
                return;
              }
              if (currentTime < totalFrames) {
                captureFrame(currentTime + 1);
              } else {
                setFrames(framesArray);
              }
            }
          };
        };

        captureFrame(0);
      };
    }
  };

  const retrieveFrames = async () => {
    const db = await openDB("framesDB", 1);
    const allFrames = await db.getAll("frames");
    setFrames(allFrames.map(frame => frame.frame));
  };

  useEffect(() => {
    retrieveFrames();
  }, []);

  const sendFramesToBackend = async () => {
    const db = await openDB("framesDB", 1);
    const allFrames = await db.getAll("frames");

    for (const { frame, id } of allFrames) {
      const response = await fetch("https://your-backend-endpoint.com/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress, taskID, frame, id }),
      });

      if (!response.ok) {
        console.error(`Failed to send frame ${id}`);
        return;
      }
    }

    // Clear IndexedDB after successfully sending frames
    await db.clear("frames");
    setFrames([]);
  };

  const createVideo = async () => {
    const db = await openDB("framesDB", 1);
    const allFrames = await db.getAll("frames");

    if (!ffmpeg.loaded) {
      await ffmpeg.load();
    }

    for (let i = 0; i < allFrames.length; i++) {
      const frame = allFrames[i].frame;
      const frameBlob = await fetch(frame).then(res => res.blob());
      const frameFile = new File([frameBlob], `frame${i}.jpg`, { type: "image/jpeg" });
      await ffmpeg.writeFile(`frame${i}.jpg`, await fetchFile(frameFile));
    }
    //Update frame rate here
    await ffmpeg.exec([
      "-r",
      frameRate.toString(),
      "-i",
      "frame%d.jpg",
      "-c:v",
      "libx264",
      "-vf",
      "fps=25",
      "-pix_fmt",
      "yuv420p",
      "output.mp4",
    ]);

    const data = await ffmpeg.readFile("output.mp4");
    const videoBlob = new Blob([data], { type: "video/mp4" });
    const url = URL.createObjectURL(videoBlob);
    setVideoURL(url);

    // Cleanup
    allFrames.forEach((_, i) => {
      ffmpeg.unmount(`frame${i}.jpg`);
    });
    ffmpeg.unmount("output.mp4");
  };

  return (
    <div>
      <h1>Video Frame Extractor</h1>
      <input type="file" accept="video/webm,video/quicktime" onChange={handleFileChange} />
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div>
        {frames.map((frame, index) => (
          <img key={index} src={frame} alt={`Frame ${index}`} />
        ))}
      </div>
      <button onClick={createVideo}>Create Video</button>
      <button onClick={sendFramesToBackend}>Send Frames to Backend</button>
      {videoURL && (
        <div>
          <h2>Generated Video</h2>
          <video controls src={videoURL}></video>
          <a href={videoURL} download="redacted_video.mp4">
            Download Video
          </a>
        </div>
      )}
    </div>
  );
};
export default VideoCompromise;
