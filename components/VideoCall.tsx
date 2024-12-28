'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useWebRTC } from '@/hooks/useWebRTC';
import { CallControls } from '@/components/CallControls';
import { Copy } from 'lucide-react';

export default function VideoCall() {
  const [remotePeerId, setRemotePeerId] = useState('');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const {
    localVideoRef,
    remoteVideoRef,
    startCall,
    joinCall,
    endCall,
    peerId,
    localStream,
    isConnecting
  } = useWebRTC();

  const handleStartCall = async () => {
    try {
      const myPeerId = await startCall();
      if (myPeerId) {
        toast({
          title: 'Call Initialized',
          description: `Your Peer ID: ${myPeerId}. Share this ID with the person you want to call.`,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to initialize call',
        variant: 'destructive',
      });
    }
  };

  const handleJoinCall = async () => {
    if (!remotePeerId) {
      toast({
        title: 'Error',
        description: 'Please enter a Peer ID',
        variant: 'destructive',
      });
      return;
    }

    try {
      await joinCall(remotePeerId);
      toast({
        title: 'Joining Call',
        description: 'Connecting to peer...',
      });
    } catch (error) {
      toast({
        title: 'Connection Error',
        description: error instanceof Error ? error.message : 'Failed to connect to peer',
        variant: 'destructive',
      });
    }
  };

  const handleToggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const handleToggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const handleEndCall = () => {
    endCall();
    toast({
      title: 'Call Ended',
      description: 'You have left the call',
    });
  };

  const handleCopyPeerId = () => {
    navigator.clipboard.writeText(peerId);
    toast({
      title: 'Copied!',
      description: 'Peer ID copied to clipboard',
    });
  };

  return (
    <div className="relative h-screen md:h-[90dvh] w-full overflow-hidden">
      {/* Main Remote Video (Full Screen) */}
      <div className="absolute inset-0 bg-gray-900">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* Local Video (Larger Overlay) */}
      <div className="absolute top-6 right-6 w-[320px] aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 backdrop-blur">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* Connection Panel */}
      <div className="absolute top-6 left-6 max-w-md">
        {!peerId ? (
          <Button
            onClick={handleStartCall}
            disabled={isConnecting}
            className="w-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-xl px-6 py-4 h-auto"
          >
            {isConnecting ? 'Initializing...' : 'Start a New Call'}
          </Button>
        ) : (
          <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                value={peerId}
                readOnly
                className="bg-white/10 border-white/20 text-white"
              />
              <Button
                onClick={handleCopyPeerId}
                variant="ghost"
                className="hover:bg-white/10"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter Peer ID to call"
                value={remotePeerId}
                onChange={(e) => setRemotePeerId(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                disabled={isConnecting}
              />
              <Button
                onClick={handleJoinCall}
                disabled={isConnecting || !remotePeerId}
                className="bg-white/10 hover:bg-white/20 text-white"
              >
                {isConnecting ? 'Connecting...' : 'Call'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <CallControls
            isAudioEnabled={isAudioEnabled}
            isVideoEnabled={isVideoEnabled}
            onToggleAudio={handleToggleAudio}
            onToggleVideo={handleToggleVideo}
            onEndCall={handleEndCall}
          />
        </div>
      </div>
    </div>
  );
}

