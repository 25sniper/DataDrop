import { useQuery } from "@tanstack/react-query";
import { ContentItem } from "@/components/content-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import type { Room, Content } from "@shared/schema";

interface RoomViewerProps {
  room: Room;
}

export function RoomViewer({ room }: RoomViewerProps) {
  const { data: content = [], isLoading } = useQuery({
    queryKey: ["/api/rooms", room.id, "content"],
  });

  return (
    <div>
      <Card className="mb-8">
        <div className="border-b border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Room Viewer</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600">Room Code:</span>
                  <span className="ml-2 bg-secondary text-white px-3 py-1 rounded-lg font-mono text-lg">
                    {room.code}
                  </span>
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  <i className="fas fa-eye mr-1"></i>View Only
                </span>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <i className="fas fa-info-circle text-blue-500 mr-3"></i>
              <p className="text-blue-800">
                You're viewing this room in read-only mode. You can view and download content but cannot make changes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Display (Read-Only) */}
      <Card>
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900">Shared Content</h3>
          <p className="text-gray-600">View all content shared in this room</p>
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
              <p className="text-gray-600">The room creator hasn't shared any content yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {content.map((item: Content) => (
                <ContentItem 
                  key={item.id} 
                  content={item} 
                  isCreator={false}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
