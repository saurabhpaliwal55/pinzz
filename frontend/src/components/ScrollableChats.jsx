import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { usePinzzState } from "../Context/ChatContext";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../utils/chatLogics.js";
import Avatar from "@mui/material/Avatar";

const ScrollableChats = ({ messages }) => {
  const { user } = usePinzzState();

  return (
    <ScrollableFeed className="h-[300px] overflow-y-auto">
      {messages.map((m, i) => (
        <div className="flex text-black" key={m._id}>
          {/* {isSameSender(messages, m, i, user._id) ||
            (isLastMessage(messages, i, user._id) && (
              <Avatar
                alt={m.sender.userName}
                src={m.sender.avatar}
                className="hover:cursor-pointer mt-[7px] mr-1"
              />
            ))} */}
          
          <span style={{
            marginLeft: isSameSenderMargin(messages,m,i,user._id),
            marginTop: isSameUser(messages,m,i,user._id) ? 3 : 10,
          }}
            className={`${
              m.sender._id === user._id ? "bg-[#BEE3F8]" : "bg-[#B9F5D0]"
            } rounded-2xl px-[15px] py-[5px] max-w-[75%]`
          }
          >
            {m.content}
          </span>
        </div>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableChats;
