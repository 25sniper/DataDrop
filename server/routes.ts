import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRoomSchema, insertContentSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Setup multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    cb(null, allowedTypes.includes(file.mimetype));
  }
});

function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new room
  app.post("/api/rooms", async (req, res) => {
    try {
      let code = generateRoomCode();
      // Ensure unique code
      while (await storage.getRoomByCode(code)) {
        code = generateRoomCode();
      }
      
      const room = await storage.createRoom({ code });
      res.json(room);
    } catch (error) {
      res.status(500).json({ message: "Failed to create room" });
    }
  });

  // Get room by code
  app.get("/api/rooms/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const room = await storage.getRoomByCode(code.toUpperCase());
      
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      
      res.json(room);
    } catch (error) {
      res.status(500).json({ message: "Failed to get room" });
    }
  });

  // Delete room
  app.delete("/api/rooms/:roomId", async (req, res) => {
    try {
      const { roomId } = req.params;
      const deleted = await storage.deleteRoom(roomId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Room not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete room" });
    }
  });

  // Get content for a room
  app.get("/api/rooms/:roomId/content", async (req, res) => {
    try {
      const { roomId } = req.params;
      const content = await storage.getContentByRoomId(roomId);
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to get content" });
    }
  });

  // Add text/link content
  app.post("/api/rooms/:roomId/content", async (req, res) => {
    try {
      const { roomId } = req.params;
      const validatedData = insertContentSchema.parse({
        ...req.body,
        roomId
      });
      
      const content = await storage.createContent(validatedData);
      res.json(content);
    } catch (error) {
      res.status(400).json({ message: "Invalid content data" });
    }
  });

  // Upload file content
  app.post("/api/rooms/:roomId/upload", upload.single('file'), async (req, res) => {
    try {
      const { roomId } = req.params;
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const content = await storage.createContent({
        roomId,
        type: "file",
        title: file.originalname,
        data: file.filename, // Store filename as data
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype
      });
      
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Download file
  app.get("/api/files/:filename", (req, res) => {
    try {
      const { filename } = req.params;
      const filePath = path.join(uploadDir, filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }
      
      res.download(filePath);
    } catch (error) {
      res.status(500).json({ message: "Failed to download file" });
    }
  });

  // Delete content
  app.delete("/api/rooms/:roomId/content/:contentId", async (req, res) => {
    try {
      const { roomId, contentId } = req.params;
      const deleted = await storage.deleteContent(contentId, roomId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete content" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
