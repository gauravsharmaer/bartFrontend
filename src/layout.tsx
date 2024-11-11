
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import AppRoutes from "./components/Routes";
import { RootState } from "./redux/store";
import { useState } from "react";
const Layout = () => {
  const authenticated = useSelector<RootState>(
    (state) => state.auth.authenticated
  ) as boolean;

  const [navCollapsed, setNavCollapsed] = useState<boolean>(false);
  const toggleNav = () => {
    setNavCollapsed(!navCollapsed);
  }
  return (
    <>
      {
        authenticated ?
          <Navbar
            collapsed={navCollapsed}
            onToggle={toggleNav}
          /> : null
      }
      <div className={authenticated ?
        `${navCollapsed ? "left-[80px]" : "left-[265px]"} bg-[#1b1b1b] transition-all duration-700 fixed top-0 right-0  ease-in-out` : ""}>
        <AppRoutes />
      </div>
    </>
  )
};

export default Layout;
