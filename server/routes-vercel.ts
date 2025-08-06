import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRoomSchema, insertContentSchema } from "@shared/schema";
import multer from "multer";

// For Vercel, we'll use memory storage instead of disk storage
// In production, you'd want to use a cloud storage service like AWS S3, Cloudinary, etc.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for serverless
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
      console.error('Error creating room:', error);
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
      console.error('Error getting room:', error);
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
      console.error('Error deleting room:', error);
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
      console.error('Error getting content:', error);
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
      console.error('Error creating content:', error);
      res.status(400).json({ message: "Invalid content data" });
    }
  });

  // Upload file content - Modified for Vercel
  app.post("/api/rooms/:roomId/upload", upload.single('file'), async (req, res) => {
    try {
      const { roomId } = req.params;
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Convert buffer to base64 for storage in database
      // In production, you'd upload to cloud storage instead
      const base64Data = file.buffer.toString('base64');

      const content = await storage.createContent({
        roomId,
        type: "file",
        title: file.originalname,
        data: base64Data, // Store base64 data instead of filename
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype
      });
      
      res.json(content);
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Download file - Modified for Vercel
  app.get("/api/files/:contentId", async (req, res) => {
    try {
      const { contentId } = req.params;
      
      // Get the content from database
      const content = await storage.getContentById(contentId);
      
      if (!content || content.type !== 'file') {
        return res.status(404).json({ message: "File not found" });
      }
      
      // Convert base64 back to buffer
      const buffer = Buffer.from(content.data, 'base64');
      
      res.set({
        'Content-Type': content.mimeType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${content.fileName}"`,
        'Content-Length': buffer.length.toString()
      });
      
      res.send(buffer);
    } catch (error) {
      console.error('Error downloading file:', error);
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
      console.error('Error deleting content:', error);
      res.status(500).json({ message: "Failed to delete content" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
