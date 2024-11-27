import React from "react";
import { TinyFaceDetectorOptions, Point, euclideanDistance } from "face-api.js";
import EyeIcon from "../assets/eye.svg";

// Constants
export const MAX_NO_FACE_FRAMES = 10;
export const MODEL_URL = "/models";
export const BLINK_THRESHOLD = 0.3;
export const OPEN_EYE_THRESHOLD = 0.4;
export const HEAD_TURN_THRESHOLD = 0.04;
export const ANALYSIS_INTERVAL = 500;
export const ANALYSIS_OPTIONS = new TinyFaceDetectorOptions({ inputSize: 224 });

// Types
export type Instructions = {
  right: string;
  left: string;
  blink: JSX.Element;
};

// Shared functions
export const generateActionSequence = (): string[] => {
  console.log("generateActionSequence called");
  return ["left", "right", "blink"];
};

export const instructions: Instructions = {
  right: "Please slowly turn your head to the left ⬅️",
  left: "Please slowly turn your head to the right ➡️",
  blink: React.createElement(
    "div",
    { className: "flex items-center" },
    React.createElement("img", {
      src: EyeIcon,
      className: "w-6 h-6 mr-5 ml-20 flex justify-center items-center",
      "aria-label": "Eye Blink Icon",
      alt: "Eye Blink Icon",
    }),
    "Please blink twice"
  ),
};

export const calculateEyeAspectRatio = (
  eye: Point[],
  otherEye: Point[]
): number => {
  console.log("calculateEyeAspectRatio called");
  if (eye.length < 6 || otherEye.length < 6) return 1;

  try {
    const eyeWidth = euclideanDistance(
      [eye[0].x, eye[0].y],
      [eye[3].x, eye[3].y]
    );
    const eyeHeight1 = euclideanDistance(
      [eye[1].x, eye[1].y],
      [eye[5].x, eye[5].y]
    );
    const eyeHeight2 = euclideanDistance(
      [eye[2].x, eye[2].y],
      [eye[4].x, eye[4].y]
    );

    return (eyeHeight1 + eyeHeight2) / (2 * eyeWidth);
  } catch (error) {
    console.error("Error calculating eye aspect ratio:", error);
    return 1;
  }
};

export const calculateAverageDescriptor = (
  descriptors: Float32Array[]
): number[] => {
  if (descriptors.length === 0) return [];

  const length = descriptors[0].length;
  const sum = new Float32Array(length);

  for (const descriptor of descriptors) {
    for (let j = 0; j < length; j++) {
      sum[j] += descriptor[j];
    }
  }

  return Array.from(sum.map((val) => val / descriptors.length));
};
