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
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import BART from "../assets/Genie.svg";
import arrow from "../assets/arrow-circle-up.svg";
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
  { id: 1, name: "Home", icon: <HomeOutlined />, path: "/" },
  { id: 3, name: "Search", icon: <SearchIcon />, path: "/search" },
  { id: 4, name: "Templates", icon: <GridViewOutlined />, path: "/templates" },
  { id: 5, name: "History", icon: <HistoryIcon />, path: "/history" },
  { id: 6, name: "Tickets", icon: <StickyNote2Outlined />, path: "/tickets" },
  { id: 7, name: "Settings", icon: <SettingsIcon />, path: "/settings" },
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
        isCollapsed ? "w-32 p-[10px]" : "w-[265px] p-5"
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
        <div className="text-center">
          <img
            src={profilePhoto}
            alt="Profile"
            className="rounded-full w-[50px] h-[50px] mx-auto block"
          />
          <Box sx={{ visibility: isCollapsed ? "hidden" : "visible" }}>
            <span className="block">
              {fullName || userName || "Default Name"}
            </span>
            <small className="block mt-[5px] text-[#888]">
              Product Manager
            </small>
          </Box>
        </div>
        <nav>
          <List>
            {menuItems.map((item) => (
              <ListItem
                className="my-[10px] text-base cursor-pointer p-5 rounded-[20px]
                 bg-black text-white flex items-center hover:scale-105 hover:bg-[#333333] hover:rounded-[10px]"
                component={Link}
                to={item.path}
                key={item.id}
              >
                <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.name}
                  sx={{
                    visibility: isCollapsed ? "hidden" : "visible",
                  }}
                />
              </ListItem>
            ))}
          </List>
        </nav>
      </div>

      <footer
        className={`absolute bottom-[50px] p-[10px] bg-[#282828] flex justify-center rounded-[10px] box-border overflow-hidden ${
          isCollapsed ? "w-[calc(100%-20px)]" : "w-[calc(100%-40px)]"
        }`}
      >
        <div className="flex items-center w-full pl-0">
          <img
            src={BART}
            alt="BART Logo"
            className="w-[35px] h-[40px] mr-[10px] bg-white rounded-[5px] p-0 px-[5px] transition-transform duration-300 ease-in-out hover:scale-120"
          />
          <Box sx={{ visibility: isCollapsed ? "hidden" : "visible" }}>
            {/* <p className="m-0 text-white text-left font-['Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif] whitespace-nowrap overflow-hidden text-ellipsis">
              <strong>
                BART{" "}
                <img
                  className="w-5 h-5 mr-[10px] absolute p-0 bg-[#282828]"
                  src={arrow}
                  alt="arrow"
                />
              </strong>
            </p> */}
            <p className="m-0 text-gray-500 text-left font-['Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif] whitespace-nowrap overflow-hidden text-ellipsis">
              Bay Area Rapid Transit
            </p>
          </Box>
        </div>
      </footer>
    </aside>
  );
};

export default Navbar;
