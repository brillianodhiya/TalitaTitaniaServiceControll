import { Router } from "express";
import commandsRouter from "./commands";
import webhooksRouter from "./webhooks";

const router = Router();

// Mount sub-routers
router.use("/command", commandsRouter);
router.use("/webhook", webhooksRouter);

export default router;
