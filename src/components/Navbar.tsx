/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";

import ListItemText from "@mui/material/ListItemText";
import {
  Sticker,
  ClockCounterClockwise,
  Plus,
  MagnifyingGlass,
  GearSix,
} from "@phosphor-icons/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import BART from "../assets/Bart.jpg";
import arrow from "../assets/arrow-up-right.svg";
import homeIcon from "../assets/home.svg";
import { useDispatch } from "react-redux";
import { setSearchPopupOpen } from "../redux/userSlice";

interface MenuItem {
  id: number;
  name: string;
  icon: React.ReactElement;
  path: string;
  onClick?: () => void;
}

const Navbar = (props: { collapsed: boolean; onToggle: () => void }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    { id: 1, name: "Home", icon: <img src={homeIcon} alt="home" />, path: "/" },
    { id: 2, name: "New chat", icon: <Plus size={16} />, path: "/create" },
    {
      id: 3,
      name: "Search",
      icon: <MagnifyingGlass size={16} />,
      path: "#",
      onClick: () => dispatch(setSearchPopupOpen(true)),
    },
    {
      id: 4,
      name: "Templates",
      icon: <Sticker size={16} />,
      path: "/templates",
    },
    {
      id: 5,
      name: "History",
      icon: <ClockCounterClockwise size={16} />,
      path: "/history",
      onClick: () => {
        props.onToggle();
        navigate("/history");
      },
    },
    { id: 6, name: "Tickets", icon: <Sticker size={16} />, path: "/ticket" },
    { id: 7, name: "Settings", icon: <GearSix size={16} />, path: "/settings" },
  ];

  return (
    <aside
      className={`bg-black z-[200] fixed left-0 top-0 bottom-0 text-white border-r-2 border-[#313131] 
        flex flex-col items-center justify-between
        transition-all duration-700 ease-in-out  ${
          props.collapsed ? "w-[80px] p-[10px]" : "w-[265px] p-5"
        }`}
    >
      <button
        className="absolute top-5 -right-3 bg-transparent border-2 border-[#484848] rounded-full text-white text-[3px] cursor-pointer flex items-center justify-center w-5 h-5 p-[10px] bg-black"
        onClick={props.onToggle}
      >
        {props.collapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>

      <div className="w-full">
        <div className="text-center w-full flex items-center gap-3">
          <img
            src="https://avatar.vercel.sh/jill"
            alt="Profile"
            className="rounded-full w-10 h-10 mt-2"
          />
          <Box
            sx={{
              visibility: props.collapsed ? "hidden" : "visible",
              opacity: props.collapsed ? 0 : 1,
              transition: "all 0.1s ease-in-out",
              transitionDelay: props.collapsed ? "0s" : "0.7s",
            }}
          >
            <div className="flex flex-col mt-2">
              <span className="mb-[2px] text-sm font-medium text-[#fff] flex justify-start">
                {localStorage.getItem("name") || "Default Name"}
              </span>
              <small className="text-[#888] text-[12px] font-normal">
                Product Manager
              </small>
            </div>
          </Box>
        </div>

        <nav className="w-full">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="transition-all duration-700 ease-in-out"
            >
              {item.onClick ? (
                <ListItem
                  onClick={item.onClick}
                  sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px",
                    margin: "10px 0",
                    cursor: "pointer",
                    borderRadius: "10px",
                    backgroundColor:
                      location.pathname === item.path ? "#333333" : "black",
                    width: props.collapsed ? "45px" : "auto",
                    height: props.collapsed ? "45px" : "auto",
                    marginLeft: props.collapsed ? "2px" : "auto",
                    marginRight: props.collapsed ? "auto" : "auto",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#333333",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "white",
                      minWidth: "auto",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingLeft: props.collapsed ? "6px" : "0",
                      margin: 0,
                      "& .MuiSvgIcon-root": {
                        fontSize: props.collapsed ? "20px" : "16px",
                      },
                    }}
                    className="transition-all duration-700 ease-in-out"
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    sx={{
                      marginLeft: "8px",
                      visibility: props.collapsed ? "hidden" : "visible",
                      opacity: props.collapsed ? 0 : 1,
                      transition: "all 0.1s ease-in-out",
                      transitionDelay: props.collapsed ? "0s" : "0.7s",
                      "& .MuiListItemText-primary": {
                        fontSize: "14px",
                        fontWeight: 400,
                      },
                    }}
                    className="transition-all duration-700 ease-in-out"
                  />
                </ListItem>
              ) : (
                <Link to={item.path}>
                  <ListItem
                    sx={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px",
                      margin: "10px 0",
                      cursor: "pointer",
                      borderRadius: "10px",
                      backgroundColor:
                        location.pathname === item.path ? "#333333" : "black",
                      width: props.collapsed ? "45px" : "auto",
                      height: props.collapsed ? "45px" : "auto",
                      marginLeft: props.collapsed ? "2px" : "auto",
                      marginRight: props.collapsed ? "auto" : "auto",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#333333",
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: "white",
                        minWidth: "auto",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingLeft: props.collapsed ? "6px" : "0",
                        margin: 0,
                        "& .MuiSvgIcon-root": {
                          fontSize: props.collapsed ? "20px" : "16px",
                        },
                      }}
                      className="transition-all duration-700 ease-in-out"
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      sx={{
                        marginLeft: "8px",
                        visibility: props.collapsed ? "hidden" : "visible",
                        opacity: props.collapsed ? 0 : 1,
                        transition: "all 0.1s ease-in-out",
                        transitionDelay: props.collapsed ? "0s" : "0.7s",
                        "& .MuiListItemText-primary": {
                          fontSize: "14px",
                          fontWeight: 400,
                        },
                      }}
                      className="transition-all duration-700 ease-in-out"
                    />
                  </ListItem>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div
        className={`flex items-center rounded-lg w-full transition-all duration-700 ease-in-out ${
          !props.collapsed ? "bg-[#252525]  p-4" : "bg-white p-2"
        } `}
      >
        <img
          src={BART}
          alt="BART Logo"
          className={` ${
            props.collapsed ? "h-[30px] " : "h-[50px] mr-[10px] p-3 px-[5px]"
          } w-auto  bg-white rounded-[5px]  transition-transform duration-300 ease-in-out hover:scale-120`}
        />

        {props.collapsed ? null : (
          <>
            <div
              className={`flex flex-col transition-all duration-700 ease-in-out`}
              style={{
                visibility: props.collapsed ? "hidden" : "visible",
                opacity: props.collapsed ? 0 : 1,
                transition: "all 0.1s ease-in-out",
                transitionDelay: props.collapsed ? "0s" : "0.7s",
              }}
            >
              <div className="flex flex-row items-center gap-2">
                <p className="font-normal text-[14px]">BART</p>
                <img
                  src={arrow}
                  alt="arrow"
                  className="h-2 bg-none bg-transparent"
                />
              </div>
              <div className="m-0 text-[#f7f7f7] text-[12px] opacity-60 text-left font-['Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif] whitespace-nowrap overflow-hidden text-ellipsis">
                Bay Area Rapid Transit
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Navbar;
