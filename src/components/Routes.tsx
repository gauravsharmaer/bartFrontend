import { Route, Routes } from "react-router-dom";
import Signup from "../pages/signup/Signup";
import Home from "../pages/home/Home";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default AppRoutes;
