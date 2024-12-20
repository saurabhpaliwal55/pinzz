import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { usePinzzState } from "../../Context/ChatContext";
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';

const SideDrawer = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { setSelectedChat, chats, setChats } = usePinzzState();

  const toastSuccessOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const toastErrorOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleSearch = async() =>{
    if(!search){
      toast.error("Please enter something in search field",toastErrorOptions)
      return
    }
    try {
      setLoading(true)
      const { data } = await axios.get(`/api/user?search=${search}`)      
      setSearchResult(data);
      setLoading(false)
    } catch (error) {
      toast.error("Something went wrong while searching",toastErrorOptions)
    }
  }

  const accessChat = async(userId) =>{
    try {
      setLoadingChat(true);
      const { data } = await axios.post("/api/chat",{ userId });
      const { data: updatedChats } = await axios.get("/api/chat");
      // if (!chats.find((c) => c._id === data._id)) {
      //   setChats((prevChats) => [...prevChats,data]);      
      // }
      setChats(updatedChats)
      setSelectedChat(data)
      setLoadingChat(false)
      setOpen(false)
    } catch (error) {
      // console.log(error);
      toast.error("Something went wrong while accesing chat",toastErrorOptions)
    }
  }

  

  const DrawerList = (
    <div className="w-[300px]" role="presentation">
      <div className="m-4 w-[250px] flex flex-col gap-1">
        <input
          className="w-full h-8 p-2 border rounded-md outline-none"
          type="text"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          placeholder="Search by email or name"
        />
        <div className="flex justify-between">
        <button className="w-[60px] border rounded-md" onClick={handleSearch}>search</button>
        <button className="w-[60px] border rounded-md" onClick={()=>setOpen(false)}><CloseIcon/></button>
        </div>

      </div>
      {loading ? <ChatLoading/> : (
        searchResult?.map(user =>(
          <UserListItem key={user._id} user={user} handleFunction ={()=>accessChat(user._id)}  />
        ))
      )}
      {loadingChat ?? <CircularProgress />}
    </div>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>Search Users</Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default SideDrawer;
