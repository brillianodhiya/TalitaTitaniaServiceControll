import { Router } from "express";
import { webhook } from "./webhook";

const router = Router();

// Webhook routes
router.post("/", webhook);
// router.post("/whatsapp", whatsappWebhook);
// router.post("/youtube", youtubeWebhook);

export default router;
