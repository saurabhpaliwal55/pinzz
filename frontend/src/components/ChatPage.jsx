import React, { useState } from "react";
import { usePinzzState } from "../Context/ChatContext";
import MyChats from "./MyChats";
import ChatBox from "./ChatBox";

const ChatPage = () => {
  const { user } = usePinzzState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div className="w-[100%] m-1 gap-1">
      <div className="flex justify-between w-[100%] h-[91.5vh] p-[10px] m-1 gap-2">
        {user && (
          <MyChats fetchAgain={fetchAgain} />
        )}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </div>
    </div>
  );
};

export default ChatPage;
