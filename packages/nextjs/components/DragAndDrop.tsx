import React, { useCallback } from "react";

interface VideoDropzoneProps {
  onFileAccepted: (file: File) => void;
}

const DragAndDrop: React.FC<VideoDropzoneProps> = ({ onFileAccepted }) => {
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const files = event.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith("video/")) {
          onFileAccepted(file);
        } else {
          alert("Only video files are accepted");
        }
      }
    },
    [onFileAccepted],
  );

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("video/")) {
        onFileAccepted(file);
      } else {
        alert("Only video files are accepted");
      }
    }
  };

  return (
    <div onDrop={onDrop} onDragOver={onDragOver} style={dropzoneStyle}>
      <input type="file" accept="video/*" onChange={onFileChange} style={{ display: "none" }} id="videoUploadInput" />
      <label htmlFor="videoUploadInput" style={labelStyle}>
        Drag & drop a video file here, or click to select one
      </label>
    </div>
  );
};

const dropzoneStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "200px",
  borderWidth: "2px",
  borderRadius: "2px",
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#000000",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
  cursor: "pointer",
};

const labelStyle: React.CSSProperties = {
  cursor: "pointer",
  fontWeight: "bold",
  color: "white",
};

export default DragAndDrop;
