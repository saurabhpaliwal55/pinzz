import {Router} from "express";
import { getAllUsers, loginUser,logOut,registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single('avatar'),registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logOut);
router.route("/").get(verifyJWT,getAllUsers);

export default router;