import React from "react";
import { usePinzzState } from "../Context/ChatContext";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = usePinzzState();
  return (
    <div className="flex items-center flex-col p-3 bg-white w-full md:w-[68%] border-1 rounded-lg h-[95%]">
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default ChatBox;
