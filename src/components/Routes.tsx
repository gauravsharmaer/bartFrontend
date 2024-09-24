import { Route, Routes } from "react-router-dom";
import Signup from "../pages/signup/Signup";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
