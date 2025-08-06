import { useState } from "react";
import { CreateRoomModal } from "@/components/modals/create-room-modal";
import { JoinRoomModal } from "@/components/modals/join-room-modal";

export default function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Share Files Anonymously</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Create secure rooms to share text, links, PDFs, and images. No registration required.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Create Room Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
            <div className="mb-6">
              <i className="fas fa-plus-circle text-primary text-4xl mb-4"></i>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Create a Room</h3>
              <p className="text-gray-600">Start sharing by creating a new room with a unique code</p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Create New Room
            </button>
          </div>

          {/* Join Room Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
            <div className="mb-6">
              <i className="fas fa-door-open text-secondary text-4xl mb-4"></i>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Join a Room</h3>
              <p className="text-gray-600">Enter a 6-digit code to access an existing room</p>
            </div>
            <button 
              onClick={() => setShowJoinModal(true)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Join Existing Room
            </button>
          </div>
        </div>
      </div>

      <CreateRoomModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
      <JoinRoomModal 
        isOpen={showJoinModal} 
        onClose={() => setShowJoinModal(false)} 
      />
    </main>
  );
}
