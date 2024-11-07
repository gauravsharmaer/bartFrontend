import React, { useState, useEffect } from "react";
import {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import {
  ChevronLeft,
  ChevronRight,
  GridViewOutlined,
  HomeOutlined,
  StickyNote2Outlined,
  Search as SearchIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import homeIcon from "../assets/home.svg";
import {
  Sticker,
  ClockCounterClockwise,
  Plus,
  MagnifyingGlass,
  GearSix,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import BART from "../assets/Bart.jpg";
import arrow from "../assets/arrow-up-right.svg";
import {
  REACT_APP_AWS_REGION,
  REACT_APP_AWS_ACCESS_KEY_ID,
  REACT_APP_AWS_SECRET_ACCESS_KEY,
  REACT_APP_S3_BUCKET,
} from "../config";

interface MenuItem {
  id: number;
  name: string;
  icon: React.ReactElement;
  path: string;
}

const menuItems: MenuItem[] = [
  { id: 1, name: "Home", icon: <img src={homeIcon} alt="home" />, path: "/" },
  { id: 2, name: "New chat", icon: <Plus size={16} />, path: "/create" },
  {
    id: 3,
    name: "Search",
    icon: <MagnifyingGlass size={16} />,
    path: "/search",
  },
  { id: 4, name: "Templates", icon: <GridViewOutlined />, path: "/templates" },
  {
    id: 5,
    name: "History",
    icon: <ClockCounterClockwise size={16} />,
    path: "/history",
  },
  { id: 6, name: "Tickets", icon: <Sticker size={16} />, path: "/tickets" },
  { id: 7, name: "Settings", icon: <GearSix size={16} />, path: "/settings" },
];

// Initialize AWS S3 client
const s3Client = new S3Client({
  region: REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: REACT_APP_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: REACT_APP_AWS_SECRET_ACCESS_KEY || "",
  },
});

const Navbar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");

  const toggleSidebar = (): void => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const fetchUserProfile = async (): Promise<void> => {
      const usernameFromStorage = "gauravsharma@yanthraa.com";

      const decodedUsername = decodeURIComponent(usernameFromStorage);
      setUserName(decodedUsername);

      try {
        const userParams = {
          Bucket: REACT_APP_S3_BUCKET || "",
          Key: `facialdata/data/${usernameFromStorage}.json`,
        };
        const command = new GetObjectCommand(userParams);
        const response = await s3Client.send(command);
        const userJson = JSON.parse(
          (await response.Body?.transformToString()) || "{}"
        );
        const fullNameFromData = userJson.fullName || "Default Name";
        setFullName(fullNameFromData);
        localStorage.setItem("fullName", fullNameFromData);

        const profilePhotoUrl = `https://${REACT_APP_S3_BUCKET}.s3.${REACT_APP_AWS_REGION}.amazonaws.com/facialdata/profile_images/${usernameFromStorage}.jpg`;

        try {
          const headCommand = new HeadObjectCommand({
            Bucket: REACT_APP_S3_BUCKET || "",
            Key: `facialdata/profile_images/${usernameFromStorage}.jpg`,
          });
          await s3Client.send(headCommand);
          setProfilePhoto(profilePhotoUrl);
          localStorage.setItem("profilePhoto", profilePhotoUrl);
        } catch (error) {
          console.error("Error checking profile photo:", error);
          setProfilePhoto("path/to/default/image.jpg");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setFullName("Default Name");
        setProfilePhoto("path/to/default/image.jpg");
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <aside
      className={`bg-black text-white border-r-2 border-[#313131] transition-all duration-700 ease-in-out relative ${
        isCollapsed ? "w-32 p-[10px]" : "w-64 p-5"
      }`}
    >
      <button
        className="absolute top-5 -right-3 bg-transparent 
        border-2 border-[#484848] rounded-full text-white text-[3px] cursor-pointer flex items-center justify-center w-5 h-5 p-[10px] bg-black"
        onClick={toggleSidebar}
      >
        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>
      <div>
        <div className="text-center flex  ml-2 gap-3">
          <img
            src={profilePhoto}
            alt="Profile"
            className="rounded-full w-10 h-10 mt-2 "
          />
          <Box sx={{ visibility: isCollapsed ? "hidden" : "visible" }}>
            <div className="flex flex-col mt-2 ">
              <span className="mb-[2px] text-sm font-medium text-[#fff] flex justify-start">
                {fullName || userName || "Default Name"}
              </span>
              <small className=" text-[#888] text-[12px] font-normal">
                Product Manager
              </small>
            </div>
          </Box>
        </div>

        <nav className="">
          <List>
            {menuItems.map((item) => (
              <ListItem
                component={Link}
                to={item.path}
                key={item.id}
                sx={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px",
                  margin: "10px 0",
                  cursor: "pointer",
                  borderRadius: "10px",
                  backgroundColor: "black",
                  width: isCollapsed ? "45px" : "auto",
                  height: isCollapsed ? "45px" : "auto",
                  marginLeft: isCollapsed ? "2px" : "auto",
                  marginRight: isCollapsed ? "auto" : "auto",
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
                    paddingLeft: isCollapsed ? "6px" : "0",
                    margin: 0,

                    "& .MuiSvgIcon-root": {
                      fontSize: isCollapsed ? "20px" : "16px",
                    },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  sx={{
                    visibility: isCollapsed ? "hidden" : "visible",
                    marginLeft: "8px",
                    "& .MuiListItemText-primary": {
                      fontSize: "14px",
                      fontWeight: 400,
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </nav>
      </div>

      <footer
        className={`absolute bottom-12  flex justify-center rounded-[10px] box-border overflow-hidden ${
          isCollapsed
            ? "bg-none"
            : "bg-[#282828] transition-all duration-700 ease-in-out py-4 pr-3 pl-4"
        }`}
      >
        <div className="flex items-center w-full pl-0 ">
          <img
            src={BART}
            alt="BART Logo"
            className="w-[70px] h-[60px] mr-[10px] bg-white rounded-[5px] p-3 px-[5px]
             transition-transform duration-300 ease-in-out hover:scale-120"
          />
          <Box sx={{ visibility: isCollapsed ? "hidden" : "visible" }}>
            <div className="flex flex-col ">
              <div className="flex flex-row  items-center gap-2">
                <p className="font-normal text-[14px]">BART</p>
                <img
                  src={arrow}
                  alt="arrow"
                  className="w-4 h-4 bg-none bg-transparent"
                />
              </div>
              <div
                className={`m-0 text-[#f7f7f7] 
                  text-[12px]
                  opacity-60
            text-left font-['Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif] 
            whitespace-nowrap overflow-hidden text-ellipsis `}
              >
                Bay Area Rapid Transit
              </div>
            </div>
          </Box>
        </div>
      </footer>
    </aside>
  );
};

export default Navbar;
