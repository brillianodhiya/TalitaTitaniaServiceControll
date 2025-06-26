import express, { Request, Response } from "express";
import dotenv from "dotenv";
// Import Discord bot dan sources
import "./sources/discord";
// Import main router
import mainRouter from "./routes/index";
dotenv.config();

const app = express();
app.use(express.json());

// Mount main router
app.use("/", mainRouter);

// Endpoint health check
app.get("/", (req: Request, res: Response) => {
  res.send("Event Gateway API is running");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Event Gateway API listening on port ${PORT}`);
});
