import { Router } from "express";
import { sendMessage } from "./send-message";

const router = Router();

// Command routes
router.post("/send-message", sendMessage);
// router.post("/create-room", createRoom);
// router.post("/ban-user", banUser);

export default router;
