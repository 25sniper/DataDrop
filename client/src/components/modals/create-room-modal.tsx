import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import type { Room } from "@shared/schema";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const createRoomMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/rooms");
      return response.json();
    },
    onSuccess: (data: Room) => {
      setRoom(data);
      toast({ title: "Room created successfully" });
    },
    onError: () => {
      toast({ 
        title: "Failed to create room", 
        variant: "destructive" 
      });
    }
  });

  const handleCreateRoom = () => {
    createRoomMutation.mutate();
  };

  const copyRoomCode = () => {
    if (room) {
      navigator.clipboard.writeText(room.code);
      toast({ title: "Room code copied to clipboard" });
    }
  };

  const enterRoom = () => {
    if (room) {
      setLocation(`/room/${room.code}`);
      onClose();
      setRoom(null);
    }
  };

  const handleClose = () => {
    onClose();
    setRoom(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
        </DialogHeader>
        
        {!room ? (
          <div className="text-center py-6">
            <i className="fas fa-plus-circle text-4xl text-primary mb-4"></i>
            <p className="text-gray-600 mb-6">
              Create a new room to start sharing content with others
            </p>
            <Button 
              onClick={handleCreateRoom}
              disabled={createRoomMutation.isPending}
              className="w-full"
            >
              {createRoomMutation.isPending ? "Creating..." : "Create Room"}
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <p className="text-sm text-gray-600 mb-2">Your room code</p>
              <div className="text-3xl font-bold text-primary tracking-wider">
                {room.code}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Share this code with others to invite them
              </p>
            </div>
            
            <Button
              onClick={copyRoomCode}
              variant="outline"
              className="mb-4"
            >
              <i className="fas fa-copy mr-2"></i>
              Copy Code
            </Button>

            <div className="space-y-3">
              <Button onClick={enterRoom} className="w-full">
                Enter Room as Creator
              </Button>
              <Button onClick={handleClose} variant="outline" className="w-full">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
