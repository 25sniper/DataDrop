import { type Room, type InsertRoom, type Content, type InsertContent } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Room operations
  createRoom(room: InsertRoom): Promise<Room>;
  getRoomByCode(code: string): Promise<Room | undefined>;
  deleteRoom(roomId: string): Promise<boolean>;
  
  // Content operations
  createContent(content: InsertContent): Promise<Content>;
  getContentByRoomId(roomId: string): Promise<Content[]>;
  getContentById(contentId: string): Promise<Content | undefined>;
  deleteContent(contentId: string, roomId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private rooms: Map<string, Room>;
  private content: Map<string, Content>;

  constructor() {
    this.rooms = new Map();
    this.content = new Map();
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const id = randomUUID();
    const room: Room = { 
      ...insertRoom, 
      id,
      createdAt: new Date()
    };
    this.rooms.set(id, room);
    return room;
  }

  async getRoomByCode(code: string): Promise<Room | undefined> {
    return Array.from(this.rooms.values()).find(room => room.code === code);
  }

  async deleteRoom(roomId: string): Promise<boolean> {
    const deleted = this.rooms.delete(roomId);
    if (deleted) {
      // Delete all content for this room
      const contentToDelete = Array.from(this.content.entries())
        .filter(([_, content]) => content.roomId === roomId)
        .map(([id, _]) => id);
      
      contentToDelete.forEach(id => this.content.delete(id));
    }
    return deleted;
  }

  async createContent(insertContent: InsertContent): Promise<Content> {
    const id = randomUUID();
    const contentItem: Content = { 
      ...insertContent, 
      id,
      createdAt: new Date()
    };
    this.content.set(id, contentItem);
    return contentItem;
  }

  async getContentByRoomId(roomId: string): Promise<Content[]> {
    return Array.from(this.content.values())
      .filter(content => content.roomId === roomId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getContentById(contentId: string): Promise<Content | undefined> {
    return this.content.get(contentId);
  }

  async deleteContent(contentId: string, roomId: string): Promise<boolean> {
    const contentItem = this.content.get(contentId);
    if (contentItem && contentItem.roomId === roomId) {
      return this.content.delete(contentId);
    }
    return false;
  }
}

export const storage = new MemStorage();
