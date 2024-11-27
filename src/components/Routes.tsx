import { Route, Routes } from "react-router-dom";
import Signup from "../pages/signup/Signup";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate } from "react-router-dom";
import OneLoginCallBack from "../pages/login/OneLoginCallBack";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import Ticket from "../pages/ticket/Ticket";
import Settings from "../pages/settings/Settings";
import History from "../pages/History/History";
import Templates from "../pages/Templates/Templates";
import NewChat from "../pages/NewChat/NewChat";
// import PasswordResetAgent from "../pages/passwordResetAgent/PasswordResetAgent";
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
        path="/history"
        element={authenticated ? <History /> : <Navigate to="/login" />}
      />
      <Route
        path="/signup"
        element={authenticated ? <Navigate to="/" /> : <Signup />}
      />
      <Route
        path="/login"
        element={authenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route path="/callback" element={<OneLoginCallBack />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route
        path="/ticket"
        element={authenticated ? <Ticket /> : <Navigate to="/login" />}
      />
      <Route
        path="/settings"
        element={authenticated ? <Settings /> : <Navigate to="/login" />}
      />
      <Route
        path="/templates"
        element={authenticated ? <Templates /> : <Navigate to="/login" />}
      />
      <Route
        path="/create"
        element={authenticated ? <NewChat /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<h1>404 page not found</h1>} />
    </Routes>
  );
};

export default AppRoutes;
