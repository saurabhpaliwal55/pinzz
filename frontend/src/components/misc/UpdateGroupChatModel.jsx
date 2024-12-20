import React, { useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { usePinzzState } from "../../Context/ChatContext";
import UserBadgeIcon from "./UserBadgeIcon";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { toast } from "react-toastify";
import UserListItem from "./UserListItem";

const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain,fetchMessages }) => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = usePinzzState();

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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleRemove = async (userToRemove) => {
    if (selectedChat.groupAdmin._id !== user._id && user._id !==userToRemove._id) {
      toast.error("only admins can remove users", toastErrorOptions);
      return;
    }
    if(selectedChat.groupAdmin._id === user._id){
      toast.error("You are the admin of this group you can't levae this group")
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.put("/api/chat/groupRemove", {
        chatId: selectedChat._id,
        userId: userToRemove._id,
      });
      userToRemove._id == user._id ? setSelectedChat() :setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handelRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const { data } = await axios.put("/api/chat/rename", {
        chatId: selectedChat._id,
        chatName: groupChatName,
      });
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setGroupChatName("");
      setRenameLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async (query) => {
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/user?search=${query}`);
      setSearchResult(data);
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToGroup = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast.error("User Already exists", toastErrorOptions);
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("only admin can add the users", toastErrorOptions);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put("/api/chat/groupAdd", {
        chatId: selectedChat._id,
        userId: userToAdd._id,
      });

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <button onClick={handleOpen}>
        <InfoIcon />
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="flex flex-col">
          <Typography
            className="flex text-[35px] justify-center"
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            {selectedChat.chatName}
          </Typography>
          <div className="w-full flex flex-wrap pb-3">
            {selectedChat.users.map((user) => (
              <UserBadgeIcon
                key={user._id}
                user={user}
                handleFunction={() => handleRemove(user)}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Chat Name"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
              className="p-1 h-full w-full mb-3 border-2 rounded-md outline-none"
            />

            {renameloading ? (
              <div className="flex">
                <CircularProgress size="30px" />
              </div>
            ) : (
              <button
                className="border h-full p-1 rounded-md"
                onClick={handelRename}
              >
                Update
              </button>
            )}
          </div>
          <div>
            <input
              className="w-full p-1 border-2 outline-none rounded-md"
              type="text"
              placeholder="Add users to group"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          {loading ? (
            <div className="flex">
              <CircularProgress size="30px" />
            </div>
          ) : (
            searchResult
              ?.slice(0, 4)
              .map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddToGroup(user)}
                />
              ))
          )}

          <div className="flex justify-end mt-6 ">
            <button
              className="border rounded-md p-1 bg-red-500 font-extrabold text-[18px]"
              onClick={() => handleRemove(user)}
            >
              leave group
            </button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModel;
