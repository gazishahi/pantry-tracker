import React, { useState, useRef } from "react";
import { Camera } from "react-camera-pro";
import { Box } from "@mui/material";
import Link from "next/link";

const Component = () => {
  const camera = useRef(null);
  const [image, setImage] = useState(null);

  return (
    <Box height="400px">
      <Link
        key="home"
        href="/"
        className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
      >
        <p className="hidden md:block">Back</p>
      </Link>
      <button onClick={() => setImage(camera.current.takePhoto())}>
        Take photo
      </button>
      <img src={image} alt="Taken photo" />
      <Camera ref={camera} aspectRatio={2 / 1} />
    </Box>
  );
};

export { Component };
