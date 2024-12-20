import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const UserBadgeIcon = ({ user, handleFunction }) => {
  return (
    <div
      className="flex px-2 py-1 rounded-md m-1 mb-2 text-[16px] font-medium cursor-pointer bg-purple-500 text-white"
      onClick={handleFunction}
    >
      {user.userName}
      <CloseIcon fontSize="small" />
    </div>
  );
};

export default UserBadgeIcon;
