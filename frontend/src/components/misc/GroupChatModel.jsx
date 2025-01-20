import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { usePinzzState } from "../../Context/ChatContext";
import axios from "axios";
import { toast } from "react-toastify";
import UserListItem from "./UserListItem";
import UserBadgeIcon from "./UserBadgeIcon";
import { API_URL } from "../../utils/confog";

const GroupChatModel = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setgroupChatName] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { users, chats, setChats } = usePinzzState();

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchResult([])
    setSelectedUser([])
  };

  const handleSearch = async (query) => {
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(`/${API_URL}/user?search=${query}`);
      setSearchResult(data);
      console.log(data);
      setLoading(false);
    } catch (error) {}
  };

  const handleGroupFun = (userToAdd) => {
    if (selectedUser.includes(userToAdd)) {
      toast.error("User already in group", toastErrorOptions);
      return
    }
    setSelectedUser([...selectedUser, userToAdd]);
  };

  const handleSubmit = async()=>{
    if(!groupChatName && !selectedUser){
        toast.error("Plz enter all fields",toastErrorOptions)
        return;
    }
    try {
        const { data } = await axios.post(`/${API_URL}/chat/group`,{
            groupName:groupChatName,
            users:JSON.stringify(selectedUser.map((u)=>u._id))
        })
        const { data: updatedChats } = await axios.get(`/${API_URL}/chat`);
        setChats(updatedChats);
        toast.success("Group created successfully",toastSuccessOptions)
        setOpen(false);
        setSearchResult([])
        setSelectedUser([])
    } catch (error) {
        console.log(error);
    }
    
  }

  const handleDelete = (delUser) => {
    setSelectedUser(selectedUser.filter((sel)=>sel._id !== delUser._id));
  };

  return (
    <>
      <span onClick={handleClickOpen}>{children}</span>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Group</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To Create a group Lorem, ipsum dolor sit amet consectetur
            adipisicing elit
          </DialogContentText>
          <div className="flex flex-col gap-1 m-2 p-2">
            <input
              className="w-full p-2 border-2 outline-none rounded-md"
              type="text"
              placeholder="Enter group name"
              onChange={(e) => setgroupChatName(e.target.value)}
            />
            <input
              className="w-full p-2 border-2 outline-none rounded-md"
              type="text"
              placeholder="Add users"
              onChange={(e) => handleSearch(e.target.value)}
            />
            <div className="flex">
              {selectedUser.map((user) => (
                <UserBadgeIcon
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </div>
            {loading ? (
              <div>Loading.....</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroupFun(user)}
                  />
                ))
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Group</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GroupChatModel;
