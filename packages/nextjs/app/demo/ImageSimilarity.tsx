import React, { useEffect, useState } from "react";
import opencvLoader from "../../utils/opencvLoader";

const { loadOpenCV, cv } = opencvLoader;

interface ImageData {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

const calculatePHash = async (image: ImageData): Promise<string> => {
  await loadOpenCV();
  console.log("Calculating pHash for image");
  const imageMat = new cv.Mat();
  imageMat.create(image.height, image.width, cv.CV_8UC4);
  imageMat.data.set(image.data);

  const gray = new cv.Mat();
  cv.cvtColor(imageMat, gray, cv.COLOR_RGBA2GRAY);
  cv.resize(gray, gray, new cv.Size(32, 32), 0, 0, cv.INTER_AREA);

  const mean = cv.mean(gray);
  const hash = gray.data
    .reduce((acc: number, pixel: number) => {
      acc += pixel > mean[0] ? 1 : 0;
      return acc;
    }, 0)
    .toString(2)
    .padStart(1024, "0");

  console.log("pHash:", hash);
  return hash;
};

const comparePHashes = (hash1: string, hash2: string): number => {
  console.log("Comparing pHashes");
  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) {
      distance++;
    }
  }
  console.log("Hamming distance:", distance);
  return distance;
};

const ImageSimilarity = ({ image1Url, image2Url }: { image1Url: string; image2Url: string }) => {
  const [similarity, setSimilarity] = useState<number | null>(null);

  useEffect(() => {
    const loadImage = async (imageUrl: string): Promise<ImageData | null> => {
      console.log("Loading image:", imageUrl);
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageUrl;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            console.error("Failed to get canvas context");
            return reject(new Error("Failed to get canvas context"));
          }
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          console.log("Image loaded and processed");
          resolve({
            data: imageData.data,
            width: img.width,
            height: img.height,
          });
        };
        img.onerror = error => {
          console.error("Failed to load image", error);
          reject(error);
        };
      });
    };

    const calculateSimilarity = async () => {
      console.log("Loading OpenCV");
      await loadOpenCV();
      console.log("OpenCV loaded");
      const imageData1 = await loadImage(image1Url);
      const imageData2 = await loadImage(image2Url);
      if (!imageData1 || !imageData2) {
        console.error("Failed to load images");
        return;
      }
      console.log("Calculating pHashes for both images");
      const hash1 = await calculatePHash(imageData1);
      const hash2 = await calculatePHash(imageData2);
      const similarityScore = comparePHashes(hash1, hash2);
      setSimilarity(similarityScore);
    };

    calculateSimilarity();
  }, [image1Url, image2Url]);
  // eslint-disable
  return (
    <div>
      <div>
        <img src={image1Url} width={200} height={200} alt="Image 1" />
      </div>
      <div>
        <img src={image2Url} width={200} height={200} alt="Image 2" />
      </div>
      {similarity !== null && <p>Similarity score: {similarity}</p>}
    </div>
  );
};

export default ImageSimilarity;
