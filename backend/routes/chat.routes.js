import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { accessChat, addToGroup, createGroupChat, fetchChats, removeFromGroup, renameGroup } from "../controllers/chat.controller.js";

const router = Router();

router.route("/").post(verifyJWT,accessChat)
router.route("/").get(verifyJWT,fetchChats)
router.route("/group").post(verifyJWT,createGroupChat)
router.route("/rename").put(verifyJWT,renameGroup)
router.route("/groupAdd").put(verifyJWT,addToGroup)
router.route("/groupRemove").put(verifyJWT,removeFromGroup)



export default router;