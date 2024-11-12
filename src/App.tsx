import React, { useEffect } from "react";
import Layout from "./layout";
import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./redux/store";
import { currentProfile } from "./redux/authSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Preload from "./components/Preload";
const App: React.FC = () => {
  const authenticated = useSelector<RootState>(
    (state) => state.auth.authenticated
  ) as boolean;

  const loading = useSelector<RootState>((state) => state.auth.loading) as boolean;
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (authenticated) {
      return;
    }
    dispatch(currentProfile());
  }, [dispatch, authenticated]);

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
