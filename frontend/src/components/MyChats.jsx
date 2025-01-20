import React, { useEffect, useState } from "react";
import { usePinzzState } from "../Context/ChatContext";
import axios from "axios";
import ChatLoading from "./misc/ChatLoading";
import { getSender } from "../utils/chatLogics";
import GroupChatModel from "./misc/GroupChatModel";
import { API_URL } from "../utils/confog";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, setUser, selectedChat, setSelectedChat, chats, setChats } =
    usePinzzState();

  const fetchChats = async () => {
    try {
      const { data } = await axios.get(`/${API_URL}/chat`);
      setChats(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  if (!loggedUser || !chats) {
    return <ChatLoading />;
  }
  return (
    <div className="flex flex-col items-center p-3 bg-white w-[35%] border rounded-lg h-[95%]">
      <div className="flex pb-3 px-3 text-3xl font-sans justify-between items-center w-full">
        My Chats
        <GroupChatModel>
          <button className="flex text-xl p-2 rounded-lg hover:border border-gray-700 ">
            New Group Chat ➕
          </button>
        </GroupChatModel>
      </div>
      <div className="flex flex-col p-3 bg-[f8f8f8] w-full h-full rounded-lg overflow-hidden">
        {/* {console.log(chats.length) */}
        {chats && chats.length > 0 ? (
          chats.map((chat) => (
            <div
              className={`cursor-pointer ${
                selectedChat === chat ? "bg-[#38B2AC]" : "bg-[#E8E8E8]"
              }
              ${selectedChat === chat ? "text-white" : "text-black"}
              px-3 py-2 my-1 rounded-md
              `}
              onClick={() => setSelectedChat(chat)}
              key={chat._id}
            >
              <p>
                {chat.isGroupChat
                  ? chat.chatName
                  : getSender(loggedUser, chat?.users)}
                {/* {chat.chatName} */}
              </p>
            </div>
          ))
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  );
};

export default MyChats;
