import mongoose from "mongoose";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email",
  });

  if (isChat.length > 0) {
    return res.status(200).json(isChat[0]);
  } else {
    var chatData = {
      chatName: "Sender",
      isGroupChar: false,
      users: [userId, req.user._id],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      return res
        .status(200)
        .json({ message: "Chat created succefully", fullChat });
    } catch (error) {
      console.log(error);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password -createdAt -updatedAt -__v")
      .populate("groupAdmin", "-password -createdAt -updatedAt -__v")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name email",
    });
    return res.status(200).json(chats);
  } catch (error) {
    res.status(400);
    console.log(error);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  var { users, groupName } = req.body;
  if (!users || !groupName) {
    return res.status(400).json({ message: "please fill all the fields" });
  }

  users = JSON.parse(users);
  if (users.length < 2) {
    return res
      .status(401)
      .json({ message: "More than 2 users are required to create a group" });
  }

  users.push(req.user._id);

  try {
    const groupChat = await Chat.create({
      chatName: groupName,
      users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate("users", "-password -createdAt -updatedAt -__v")
      .populate("groupAdmin", "-password -createdAt -updatedAt -__v")
      .populate("latestMessage");

    return res
      .status(200)
      .json({ message: "Group Chat created successfully", fullGroupChat });
  } catch (error) {
    console.log(error);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  if (!chatId || !chatName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password -createdAt -updatedAt -__v")
      .populate("groupAdmin", "-password -createdAt -updatedAt -__v")
      .populate("latestMessage");

    return res.status(200).json(updatedChat);
  } catch (error) {
    console.log(error);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password -createdAt -updatedAt -__v")
      .populate("groupAdmin", "-password -createdAt -updatedAt -__v");

    return res.status(200).json(added);
  } catch (error) {
    console.log(error);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const remove = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password -createdAt -updatedAt -__v")
      .populate("groupAdmin", "-password -createdAt -updatedAt -__v");

    return res.status(200).json(remove);
  } catch (error) {
    console.log(error);
  }
});

export {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
