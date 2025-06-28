import { Router } from "express";
import { sendMessage } from "./send-message";
import { ragQuery, ragQueryWithCallback } from "./rag-query";

const router = Router();

// Command routes
router.post("/send-message", sendMessage);
router.post("/rag-query", ragQuery);
router.post("/rag-query-with-callback", ragQueryWithCallback);
// router.post("/create-room", createRoom);
// router.post("/ban-user", banUser);

export default router;
