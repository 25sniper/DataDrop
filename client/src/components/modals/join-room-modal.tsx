import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinRoomModal({ isOpen, onClose }: JoinRoomModalProps) {
  const [roomCode, setRoomCode] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const joinRoomMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest("GET", `/api/rooms/${code}`);
      return response.json();
    },
    onSuccess: () => {
      setLocation(`/room/${roomCode.toUpperCase()}`);
      onClose();
      setRoomCode("");
    },
    onError: () => {
      toast({ 
        title: "Room not found", 
        description: "Please check the room code and try again",
        variant: "destructive" 
      });
    }
  });

  const handleJoinRoom = () => {
    const code = roomCode.trim().toUpperCase();
    if (code.length === 6) {
      joinRoomMutation.mutate(code);
    } else {
      toast({ 
        title: "Invalid room code", 
        description: "Please enter a valid 6-digit code",
        variant: "destructive" 
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setRoomCode(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoinRoom();
    }
  };

  const handleClose = () => {
    onClose();
    setRoomCode("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Join Room</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="room-code">Room Code</Label>
            <Input
              id="room-code"
              placeholder="Enter 6-digit code"
              value={roomCode}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="text-center text-2xl tracking-wider uppercase"
              maxLength={6}
            />
            <p className="text-xs text-gray-500 mt-2">
              Enter the 6-digit code shared by the room creator
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleJoinRoom}
              disabled={roomCode.length !== 6 || joinRoomMutation.isPending}
              className="w-full"
            >
              {joinRoomMutation.isPending ? "Joining..." : "Join Room"}
            </Button>
            <Button onClick={handleClose} variant="outline" className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
