import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();

    return accessToken;
  } catch (error) {
    console.log(error);
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  console.log(userName,email,password);
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValidEmail = emailRegex.test(email);
  if (!isValidEmail) {
    return res.status(405).json({ message: "Invalid Email." });
  }
  if (!userName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    return res.status(401).json({ message: "User already existed" });
  }

  const avatarLocalPath = req.file?.path;
  console.log(avatarLocalPath);
  

  if (!avatarLocalPath) {
    return res.status(402).json({ message: "No file is uploaded" });
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    return res.status(403).json({ message: "failed to uplad" });
  }

  const user = await User.create({
    userName: userName.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
  });

  if (!user) {
    return res
      .status(501)
      .json({ message: "Something went wrong while ctreating user" });
  }

  const accessToken = await generateTokens(user._id);
  const createdUser = await User.findById(user._id).select(
    "-__v -password"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
    .json({ message: "User created succefully", createdUser });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValidEmail = emailRegex.test(email);
  if (!isValidEmail) {
    return res.status(401).json({ message: "Invalid Email." });
  }
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User does not exist" });
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return res.status(402).json({ message: "Password mismatch" });
  }

  const accessToken = await generateTokens(user._id);
  const loggedInUser = await User.findById(user._id).select(
    " -__v -createdAt -updatedAt -password"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
    .json({ message: "User LoggedIn succefully", loggedInUser });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const userId = req.user._id;

  const usersExpectCurrentUser = await User.find(keyword)
    .find({ _id: { $ne: userId } })
    .select("-password -createdAt -updatedAt");

  if (!usersExpectCurrentUser) {
    return res.status(501).json({ message: "Something went wrong" });
  }

  return res.status(200).send(usersExpectCurrentUser);
});

const logOut = asyncHandler(async(req,res)=>{
  const options = {
    httpOnly:true,
    secure:true
  }
  res.status(200).clearCookie("accessToken",options).json({message:"User logOut successfully"})
})

export { registerUser, loginUser, getAllUsers,logOut };
