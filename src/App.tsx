import React, { useEffect } from "react";
import Layout from "./layout";
import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./redux/store";
import { currentProfile } from "./redux/authSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Preload from "./components/Preload";
import * as faceapi from "face-api.js";
import { modelLoadingState } from "./utils/modelState";

const App: React.FC = () => {
  const authenticated = useSelector<RootState>(
    (state) => state.auth.authenticated
  ) as boolean;

  const loading = useSelector<RootState>(
    (state) => state.auth.loading
  ) as boolean;
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (authenticated) {
      return;
    }
    dispatch(currentProfile());
  }, [dispatch, authenticated]);

  useEffect(() => {
    const loadModels = async () => {
      console.log("Starting model load from App.tsx");
      const startTime = performance.now();

      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);

        modelLoadingState.isLoaded = true;
        const endTime = performance.now();
        console.log(
          `Models loaded in ${((endTime - startTime) / 1000).toFixed(
            2
          )} seconds`
        );
      } catch (error) {
        console.error("Error loading models:", error);
        modelLoadingState.error = "Failed to load face recognition models";
      }
    };

    void loadModels();
  }, []);

  if (loading) {
    return <Preload />;
  }

  return (
    <>
      <Layout />
      <ToastContainer />
    </>
  );
};
export default App;
