import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useState } from "react";
import { RoomCreator } from "@/components/room-creator";
import { RoomViewer } from "@/components/room-viewer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function Room() {
  const [, params] = useRoute("/room/:code");
  const code = params?.code?.toUpperCase();
  const [isCreator, setIsCreator] = useState<boolean | null>(null);

  const { data: room, isLoading, error } = useQuery({
    queryKey: ["/api/rooms", code],
    enabled: !!code
  });

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading room...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !room) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Room Not Found</h2>
              <p className="text-gray-600 mb-4">
                The room code "{code}" doesn't exist or has been deleted.
              </p>
              <Link href="/">
                <Button className="w-full">
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (isCreator === null) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <i className="fas fa-users text-4xl text-primary mb-4"></i>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Room</h2>
              <p className="text-gray-600 mb-6">
                How would you like to access room <strong>{code}</strong>?
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => setIsCreator(true)}
                  className="w-full"
                >
                  <i className="fas fa-crown mr-2"></i>
                  Enter as Creator
                </Button>
                <Button 
                  onClick={() => setIsCreator(false)}
                  variant="outline"
                  className="w-full"
                >
                  <i className="fas fa-eye mr-2"></i>
                  Enter as Viewer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {isCreator ? (
        <RoomCreator room={room} />
      ) : (
        <RoomViewer room={room} />
      )}
    </main>
  );
}
