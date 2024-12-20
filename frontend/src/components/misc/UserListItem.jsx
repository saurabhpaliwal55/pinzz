import React from "react";
import Avatar from "@mui/material/Avatar";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div
      onClick={handleFunction}
      className="cursor-pointer bg-[#E8E8E8] w-[100%] flex items-center p-2 mb-1 rounded-lg hover:bg-[#38B2AC] hover:text-white"
    >
      <Avatar
        alt={user?.userName}
        src={user?.avatar}
        className="hover:cursor-pointer mr-2"
      />
      <div className="">
        <p className="font-bold">{user.userName}</p>
        <p><span className="font-medium">Email: </span>{user.email}</p>
      </div>
    </div>
  );
};

export default UserListItem;
