import React, { useEffect, useRef } from "react";
import nlp from "../utils/nlp-plugins/twitterHandlePlugin";
import { openDB } from "idb";
import Tesseract from "tesseract.js";

interface VideoProcessorProps {
  file: File;
  onProgress: (progress: number) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
  onFrameProcessed: (frame: string) => void; // New callback for each processed frame
}

const VideoProcessor: React.FC<VideoProcessorProps> = ({ file, onProgress, onComplete, onError, onFrameProcessed }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRate = 5;
  const keywordsToRedact = ["ffmpeg", "medium", "URL", "\\bhttps?://[^\\s]+\\b", "/@w+/"];
  /* eslint-disable */
  useEffect(() => {
    const handleFileChange = async () => {
      try {
        const db = await openDB("framesDB", 1, {
          upgrade(db) {
            db.createObjectStore("frames", { keyPath: "id", autoIncrement: true });
          },
        });
        await db.clear("frames");

        const videoElement = videoRef.current;

        if (videoElement) {
          videoElement.src = URL.createObjectURL(file);
          videoElement.onloadedmetadata = () => {
            if (canvasRef.current) {
              canvasRef.current.width = videoElement.videoWidth;
              canvasRef.current.height = videoElement.videoHeight;
            }

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

                  const progress = Math.round((framesArray.length / totalFrames) * 100);
                  onProgress(progress);

                  const result = await Tesseract.recognize(canvas, "eng");
                  const {
                    data: { words },
                  } = result;

                  const normalizedText = words.map(word => word.text.trim().toLowerCase()).join(" ");
                  const doc = nlp(normalizedText);

                  const privateEntities = [
                    ...doc.people().out("array"),
                    ...doc.match("#Email").out("array"),
                    ...doc.match("#PhoneNumber").out("array"),
                    ...doc.urls().out("array"),
                    ...doc.match("@TwitterHandle").out("array"),
                  ];

                  const privateTexts = new Set(privateEntities);

                  words.forEach(word => {
                    const lowerCaseText = word.text.toLowerCase();
                    const shouldRedact =
                      privateTexts.has(lowerCaseText) ||
                      keywordsToRedact.some(keyword => new RegExp(keyword || "", "i").test(lowerCaseText));

                    if (shouldRedact) {
                      context.fillStyle = "black";
                      context.fillRect(
                        word.bbox.x0,
                        word.bbox.y0,
                        word.bbox.x1 - word.bbox.x0,
                        word.bbox.y1 - word.bbox.y0
                      );
                    } else {
                      context.strokeStyle = "green";
                      context.lineWidth = 2;
                      context.strokeRect(
                        word.bbox.x0,
                        word.bbox.y0,
                        word.bbox.x1 - word.bbox.x0,
                        word.bbox.y1 - word.bbox.y0
                      );
                    }
                  });

                  const redactedFrameData = canvas.toDataURL("image/jpeg", 0.5); //Compression set to 0.5
                  framesArray.push(redactedFrameData);
                  onFrameProcessed(redactedFrameData); // Callback for each processed frame

                  const idIDB = currentTime.toString();
                  try {
                    await db.put("frames", { id: idIDB, frame: redactedFrameData });
                  } catch (error) {
                    const allFrames = await db.getAll("frames");
                    if (allFrames.length > 0) {
                      await db.delete("frames", allFrames[0].id);
                      await db.put("frames", { id: idIDB, frame: redactedFrameData });
                    }
                  }

                  if (currentTime < totalFrames) {
                    captureFrame(currentTime + 1);
                  } else {
                    onComplete();
                  }
                }
              };
            };

            captureFrame(0);
          };
        }
      } catch (error) {
        onError(error as Error);
      }
    };

    handleFileChange();
  }, [file, onProgress, onComplete, onError, onFrameProcessed]);

  return (
    <div>
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default VideoProcessor;
