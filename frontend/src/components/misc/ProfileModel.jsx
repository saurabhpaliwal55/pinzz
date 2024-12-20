import React, { useState } from "react";
import InfoIcon from '@mui/icons-material/Info';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const ProfileModel = ({ user, children }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  return <>
    {children ? (
        <span onClick={handleOpen}>{children}</span>
      ) : (
        <button onClick={handleOpen}><InfoIcon/></button>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="flex flex-col items-center">
          <img className="w-56" src={user.avatar} alt="" />
          <Typography id="modal-modal-title" variant="h6" component="h2">
            UserName: {user.userName}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
           Email: {user.email}
          </Typography>
        </Box>
      </Modal>
  </>;
};

export default ProfileModel;
