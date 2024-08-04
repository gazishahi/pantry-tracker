import React, { useState, useRef } from "react";
import { Camera } from "react-camera-pro";
import { Box, Button } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import Link from "next/link";
import { getStorage, ref, uploadBytes, uploadString } from "firebase/storage";

function base64ToBlob(base64Data, contentType) {
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

async function uploadBase64Image(base64DataUrl, storagePath) {
  // Extract the content type and the base64 string from the data URL
  const [metadata, base64String] = base64DataUrl.split(",");
  const contentType = metadata.match(/:(.*?);/)[1];

  // Convert the base64 string to a Blob
  const blob = base64ToBlob(base64String, contentType);

  // Initialize Firebase Storage and create a reference
  const storage = getStorage();
  const storageRef = ref(storage, storagePath);

  // Upload the Blob to Firebase Storage
  await uploadBytes(storageRef, blob).then((snapshot) => {
    console.log("Uploaded a blob or file!");
  });
}

const Component = () => {
  const camera = useRef(null);
  const [image, setImage] = useState(null);

  const uploadImage = async (event) => {
    uploadBase64Image(image, "images/photo.jpeg").catch((error) => {
      console.error("Upload failed", error);
    });
  };

  const showPhoto = () => {
    console.log(image);
  };

  return (
    <Box
      height="450px"
      padding={4}
      display="flex"
      flexDirection={"column"}
      justifyContent="center"
    >
      <Button
        onClick={() => setImage(camera.current.takePhoto())}
        variant="contained"
      >
        Take photo
      </Button>
      <Camera ref={camera} aspectRatio={4 / 3} />
      <Button
        onClick={() => uploadImage()}
        variant="contained"
        startIcon={<UploadIcon />}
      >
        Upload
      </Button>
    </Box>
  );
};

export { Component };
