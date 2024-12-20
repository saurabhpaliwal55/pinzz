import React from "react";
import SignUp from "./components/SignUp";
import { Route, Routes } from "react-router-dom";
import MainContainer from "./components/MainContainer";
import ChatPage from "./components/ChatPage.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="app" element={<MainContainer />}>
        <Route path="chat" element={<ChatPage/>}></Route>
      </Route>
    </Routes>
  );
};

export default App;
