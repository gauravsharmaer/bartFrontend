import { Route, Routes } from "react-router-dom";
import Signup from "../pages/signup/Signup";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate } from "react-router-dom";
const AppRoutes = () => {
  const authenticated = useSelector<RootState>(
    (state) => state.auth.authenticated
  ) as boolean;
  return (
    <Routes>
      <Route
        path="/"
        element={authenticated ? <Home /> : <Navigate to="/login" />}
      />

      <Route
        path="/signup"
        element={authenticated ? <Navigate to="/" /> : <Signup />}
      />
      <Route
        path="/login"
        element={authenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route path="*" element={<h1>404 page not found</h1>} />
    </Routes>
  );
};

export default AppRoutes;
