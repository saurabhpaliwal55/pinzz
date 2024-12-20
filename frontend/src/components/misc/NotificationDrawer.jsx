import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import { usePinzzState } from "../../Context/ChatContext";
import { ListItemText } from "@mui/material";
import { getSender } from "../../utils/chatLogics";

const NotificationDrawer = () => {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const { user, notifications, setSelectedChat, setNotifications } =
    usePinzzState();

    console.log(notifications.length);
    
  const handleClick = (notif) => {
    setSelectedChat(notif.chat);
    setNotifications(notifications.filter((n) => n !== notif));
  };
  const list = (anchor) => (
    <Box
      //   sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
      className="w-[300px]"
    >
      <List>
        <div className="flex flex-col ml-4 p-1 gap-2">
          <p>{!notifications.length && "No new notifications"}</p>
          {notifications.map((notif) => (
            <>
              <ListItemText
                key={notif._id}
                onClick={() => handleClick(notif)}
                className="hover:cursor-pointer"
              >
                {notif.chat.isGroupChat
                  ? `New Message in ${notif.chat.chatName}`
                  : `New message from ${getSender(user, notif.chat.users)}`}
              </ListItemText>
              <Divider />
            </>
          ))}
        </div>
      </List>
    </Box>
  );
  return (
    <div>
      {notifications.length==0?(<NotificationsIcon
        onClick={toggleDrawer("right", true)}
        className="hover:cursor-pointer"
      />):(<NotificationImportantIcon
        onClick={toggleDrawer("right", true)}
        className="hover:cursor-pointer"
      />)}

      <Drawer
        anchor={"right"}
        open={state["right"]}
        onClose={toggleDrawer("right", false)}
      >
        {list("right")}
      </Drawer>
    </div>
  );
};

export default NotificationDrawer;
