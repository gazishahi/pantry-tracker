import React, { useState, useRef } from "react";
import { Camera } from "react-camera-pro";
import { Box, Button } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import Link from "next/link";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const Component = () => {
  const camera = useRef(null);
  const [image, setImage] = useState(null);

  const uploadImage = async (event) => {
    const storage = getStorage();
    const storageRef = ref(storage, image.name);
    uploadBytes(storageRef, file).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
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
