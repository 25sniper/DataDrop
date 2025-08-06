import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { FileUpload } from "@/components/file-upload";
import { ContentItem } from "@/components/content-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import type { Room, Content } from "@shared/schema";

interface RoomCreatorProps {
  room: Room;
}

export function RoomCreator({ room }: RoomCreatorProps) {
  const [contentType, setContentType] = useState("text");
  const [contentText, setContentText] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: content = [], isLoading } = useQuery({
    queryKey: ["/api/rooms", room.id, "content"],
  });

  const addContentMutation = useMutation({
    mutationFn: async (data: { type: string; title?: string; data: string }) => {
      const response = await apiRequest("POST", `/api/rooms/${room.id}/content`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms", room.id, "content"] });
      setContentText("");
      toast({ title: "Content added successfully" });
    },
    onError: () => {
      toast({ title: "Failed to add content", variant: "destructive" });
    }
  });

  const deleteRoomMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/rooms/${room.id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Room deleted successfully" });
      window.location.href = "/";
    },
    onError: () => {
      toast({ title: "Failed to delete room", variant: "destructive" });
    }
  });

  const deleteContentMutation = useMutation({
    mutationFn: async (contentId: string) => {
      const response = await apiRequest("DELETE", `/api/rooms/${room.id}/content/${contentId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms", room.id, "content"] });
      toast({ title: "Content deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete content", variant: "destructive" });
    }
  });

  const handleAddContent = () => {
    if (!contentText.trim()) return;

    const isUrl = contentText.startsWith("http://") || contentText.startsWith("https://");
    const type = contentType === "link" || isUrl ? "link" : "text";

    addContentMutation.mutate({
      type,
      title: type === "link" ? "Link" : "Text Note",
      data: contentText.trim()
    });
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(room.code);
    toast({ title: "Room code copied to clipboard" });
  };

  const handleDeleteRoom = () => {
    if (confirm("Are you sure you want to delete this room? All content will be permanently lost.")) {
      deleteRoomMutation.mutate();
    }
  };

  return (
    <div>
      <Card className="mb-8">
        <div className="border-b border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Room Creator Dashboard</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600">Room Code:</span>
                  <span className="ml-2 bg-primary text-white px-3 py-1 rounded-lg font-mono text-lg">
                    {room.code}
                  </span>
                </div>
                <button 
                  onClick={copyRoomCode}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-copy"></i>
                </button>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <Button 
                onClick={handleDeleteRoom}
                variant="destructive"
                size="sm"
                disabled={deleteRoomMutation.isPending}
              >
                <i className="fas fa-trash mr-2"></i>
                Delete Room
              </Button>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <i className="fas fa-arrow-left mr-2"></i>
                  Exit Room
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* File Upload */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Files</h3>
              <FileUpload roomId={room.id} />
            </div>

            {/* Text/Link Upload */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Text or Links</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text Note</SelectItem>
                      <SelectItem value="link">Link/URL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <Textarea
                    placeholder="Enter your text or paste a link..."
                    rows={4}
                    value={contentText}
                    onChange={(e) => setContentText(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleAddContent}
                  className="w-full"
                  disabled={!contentText.trim() || addContentMutation.isPending}
                >
                  {addContentMutation.isPending ? "Adding..." : "Add Content"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Display */}
      <Card>
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900">Shared Content</h3>
          <p className="text-gray-600">Manage all content shared in this room</p>
        </div>
        
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading content...</p>
            </div>
          ) : content.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-folder-open text-gray-300 text-5xl mb-4"></i>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No content yet</h4>
              <p className="text-gray-600">Start sharing by uploading files or adding text above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {content.map((item: Content) => (
                <ContentItem 
                  key={item.id} 
                  content={item} 
                  isCreator={true}
                  onDelete={() => deleteContentMutation.mutate(item.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
