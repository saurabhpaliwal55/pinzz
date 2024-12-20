import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({ message: "Invalid data passed" });
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "userName email avatar");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "userName email avatar",
    });
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });
    return res.status(200).json({ message });
  } catch (error) {
    return res.status(404).json(error);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  const message = await Message.find({ chat: req.params.chatId })
    .populate("sender", "userName email avatar")
    .populate("chat");

  return res.status(200).json({ message });
});


export { sendMessage, allMessages };
