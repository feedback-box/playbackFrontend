"use client";

import { useRef, useState } from "react";
import Tesseract from "tesseract.js";

const VideoToFrames: React.FC = () => {
  const [frames, setFrames] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const convertVideoToFrames = () => {
    const videoFile = fileInputRef.current?.files?.[0];
    if (!videoFile) {
      alert("Please select a video file.");
      return;
    }

    const url = URL.createObjectURL(videoFile);
    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.src = url;

      videoElement.onloadedmetadata = () => {
        const canvasElement = canvasRef.current;
        if (canvasElement) {
          canvasElement.width = videoElement.videoWidth;
          canvasElement.height = videoElement.videoHeight;

          videoElement.play();
          extractFrames();
        }
      };
    }
  };

  const extractFrames = () => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    if (videoElement && canvasElement) {
      const ctx = canvasElement.getContext("2d");

      if (ctx) {
        videoElement.pause();
        ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

        const frameDataUrl = canvasElement.toDataURL("image/png");
        setFrames(prevFrames => [...prevFrames, frameDataUrl]);

        extractTextFromFrame(frameDataUrl, frames.length);

        if (videoElement.currentTime < videoElement.duration) {
          videoElement.currentTime += 1; // Extract frame every second
          videoElement.play();
          setTimeout(extractFrames, 1000);
        } else {
          displayFrames();
        }
      }
    }
  };

  const extractTextFromFrame = async (frameDataUrl: string, frameIndex: number) => {
    const img = new Image();
    img.src = frameDataUrl;
    await new Promise<void>(resolve => {
      img.onload = () => resolve();
    });

    const {
      data: { text, words },
    } = await Tesseract.recognize(img, "eng", {
      logger: m => console.log(m),
    });

    console.log(`Text extracted from frame ${frameIndex + 1}:`, text);
    words.forEach(word => {
      console.log(`Word: ${word.text}, Bounding Box: ${JSON.stringify(word.bbox)}`);
    });

    return text;
  };

  const displayFrames = () => {
    const previewContainer = document.getElementById("previewContainer");
    if (previewContainer) {
      previewContainer.innerHTML = ""; // Clear previous frames

      frames.forEach(frame => {
        const img = document.createElement("img");
        img.src = frame;
        previewContainer.appendChild(img);
      });
    }
  };

  return (
    <div>
      <input type="file" ref={fileInputRef} accept="video/*" />
      <button onClick={convertVideoToFrames}>Convert Video to Frames</button>
      <div id="previewContainer"></div>
      <video ref={videoRef} style={{ display: "none" }}></video>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
};

export default VideoToFrames;
