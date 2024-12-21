import React, { useEffect, useState } from "react";
import { usePinzzState } from "../Context/ChatContext";
import { getSender, getSenderFull } from "../utils/chatLogics";
import ProfileModel from "./misc/ProfileModel";
import UpdateGroupChatModel from "./misc/UpdateGroupChatModel";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import ScrollableChats from "./ScrollableChats";
import { io } from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

// const ENDPOINT = "http://localhost:4000";
// const ENDPOINT = "http://13.126.68.136:4000";
const ENDPOINT = "https://apipinzz.onrender.com";


var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { user, chats, selectedChat, notifications, setNotifications } =
    usePinzzState();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const sendMessage = async (e) => {
    if ((e.key === "Enter" || e.type === "click") && newMessage) {
      setNewMessage("");
      try {
        const { data } = await axios.post("/api/message", {
          content: newMessage,
          chatId: selectedChat._id,
        });
        socket.emit("new message", data.message);
        setMessages([...messages, data.message]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        console.log("in timer");
        setTyping(false);
      }
    }, timerLength);
  };

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/message/${selectedChat._id}`);
      setMessages(data.message);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
       if(!notifications.includes(newMessageRecieved)){
        setNotifications([newMessageRecieved, ...notifications]);
        setFetchAgain(!fetchAgain);
       }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <>
          <p className="text-[30px] pb-3 px-2 w-full flex items-center justify-between">
            {selectedChat.isGroupChat ? (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            ) : (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
              </>
            )}
          </p>
          <div className="flex flex-col justify-end p-3 bg-[#E8E8E8] w-full h-full rounded-lg overflow-hidden">
            {loading ? (
              <div className="flex w-full m-auto justify-center items-center ">
                <CircularProgress size={70} />
              </div>
            ) : (
              <div className="flex flex-col overflow-y-scroll">
                <ScrollableChats messages={messages} />
              </div>
            )}
            {isTyping ? (
              <div>
                <Lottie
                  options={defaultOptions}
                  // height={50}
                  width={70}
                  style={{ marginBottom: 15, marginLeft: 0 }}
                />
              </div>
            ) : (
              <></>
            )}
            <div className="flex justify-between gap-2 mt-1">
              <input
                type="text"
                placeholder="Enter a message"
                className="bg-[#E0E0E0] w-full p-1 border-2 border-blue-00 rounded-md outline-none"
                onChange={typingHandler}
                value={newMessage}
                onKeyDown={sendMessage}
              />
              <Button
                variant="contained"
                onClick={(e) => sendMessage(e)}
                endIcon={<SendIcon />}
              >
                Send
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-[95%]">
          <p className="text-3xl font-bold pb-3">
            Click On A User to Start the Chat
          </p>
        </div>
      )}
    </>
  );
};

export default SingleChat;
