import { Request, Response } from "express";

// Endpoint command: menerima perintah dari Next.js untuk mengirim pesan ke user tertentu
export const sendMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId }: { userId: string; message: string } = req.body;
    // Dummy: Kirim ke Discord/WA (implementasi asli di sini)
    // await sendToDiscord(userId, message);
    res.status(200).json({ status: "sent", userId });
  } catch (error) {
    console.error("Error in command endpoint:", error);
    res.status(500).json({ error: "Failed to send", detail: String(error) });
  }
};
