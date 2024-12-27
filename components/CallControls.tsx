import { Button } from '@/components/ui/button'
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react'

interface CallControlsProps {
  isAudioEnabled: boolean
  isVideoEnabled: boolean
  onToggleAudio: () => void
  onToggleVideo: () => void
  onEndCall: () => void
}

export function CallControls({
  isAudioEnabled,
  isVideoEnabled,
  onToggleAudio,
  onToggleVideo,
  onEndCall,
}: CallControlsProps) {
  return (
    <div className="flex items-center space-x-6">
      <Button
        onClick={onToggleAudio}
        variant={isAudioEnabled ? 'default' : 'secondary'}
        className="rounded-full w-14 h-14 p-0 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 shadow-xl transition-all duration-200"
      >
        {isAudioEnabled ?
          <Mic className="h-6 w-6 text-white" /> :
          <MicOff className="h-6 w-6 text-red-500" />
        }
      </Button>
      <Button
        onClick={onEndCall}
        variant="destructive"
        className="rounded-full w-16 h-16 p-0 bg-red-500 hover:bg-red-600 shadow-xl border-2 border-red-400 transition-all duration-200"
      >
        <PhoneOff className="h-7 w-7" />
      </Button>
      <Button
        onClick={onToggleVideo}
        variant={isVideoEnabled ? 'default' : 'secondary'}
        className="rounded-full w-14 h-14 p-0 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 shadow-xl transition-all duration-200"
      >
        {isVideoEnabled ?
          <Video className="h-6 w-6 text-white" /> :
          <VideoOff className="h-6 w-6 text-red-500" />
        }
      </Button>
    </div>
  )
}

