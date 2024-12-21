import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(()=>{
    return JSON.parse(localStorage.getItem("userInfo")) || null;
});
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const loadUserInfo = () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      setUser(userInfo);
      if (!userInfo) {
        navigate("/");
      }
    };
    loadUserInfo();
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const usePinzzState = () => useContext(ChatContext);
