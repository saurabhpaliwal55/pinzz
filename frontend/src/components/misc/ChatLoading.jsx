import React from "react";
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

const ChatLoading = () => {
  return (
    <Box>
      <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
      <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
      <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
      <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
      <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
      <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
      <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
      <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
      <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
      <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
      <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
      <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
    </Box>
  );
};

export default ChatLoading;
