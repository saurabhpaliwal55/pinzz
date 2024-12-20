import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import { usePinzzState } from "../Context/ChatContext";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SideDrawer from "./misc/SideDrawer";
import ProfileModel from "./misc/ProfileModel";
import NotificationDrawer from "./misc/NotificationDrawer";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user } = usePinzzState();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  const toastSuccessOptions = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logOutHandler = async()=>{
    const response  = await axios.post("/api/user/logout");
    if(response.status == 200){
      localStorage.removeItem("userData");
      toast.success("LoggedOut successfully",toastSuccessOptions);
      navigate("/")
      }
    
  }

  const handleProfileClick = () => {
    // handleClose()
  };
  return (
    <div className="flex justify-between bg-white p-2 m-2 h-14 border-2 rounded-md">
      <div className="flex items-center">
        <SideDrawer />
      </div>
      <div className="flex items-center">
        <h1 className="font-extrabold text-4xl">Pinzz</h1>
      </div>
      <div className="flex items-center gap-5">
        <NotificationDrawer />
        <Avatar
          alt={user?.userName}
          src={user?.avatar}
          onClick={handleClick}
          className="hover:cursor-pointer"
        />
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <ProfileModel user={user}>
            <MenuItem onClick={handleProfileClick}>My Profile</MenuItem>
          </ProfileModel>
          <MenuItem onClick={logOutHandler}>Logout</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Navbar;
