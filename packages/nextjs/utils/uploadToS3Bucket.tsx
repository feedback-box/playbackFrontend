import { uploadData } from "aws-amplify/storage";

const uploadFileToS3Bucket = async ({
  file,
  taskId,
  walletAddress,
}: {
  file: File;
  taskId: string;
  walletAddress: string;
}): Promise<string | null> => {
  try {
    const result = await uploadData({
      path: `public/${walletAddress}/${taskId}/raw-images/${file.name}`,
      data: file,
      options: {
        contentType: "image/jpeg",
        onProgress: ({ transferredBytes, totalBytes }) => {
          if (totalBytes) {
            console.log(`Upload progress ${Math.round((transferredBytes / totalBytes) * 100)} %`);
          }
        },
      },
    });
    console.log("Result from Response: ", result);
    const s3Url = `https://YOUR_BUCKET_NAME.s3.amazonaws.com/public/${walletAddress}/${taskId}/raw-images/${file.name}`;
    return s3Url; // Successful upload
  } catch (error) {
    console.error("Error : ", error);
    return null; // Upload failure
  }
};

export default uploadFileToS3Bucket;
