import { useState } from 'react'
import { PhoneIcon, PhoneXMarkIcon } from '@heroicons/react/24/solid'

interface CallControlsProps {
  startCall: (remotePeerId: string) => void
  endCall: () => void
  callStatus: 'idle' | 'calling' | 'connected'
}

export default function CallControls({ startCall, endCall, callStatus }: CallControlsProps) {
  const [remotePeerId, setRemotePeerId] = useState('')

  const handleStartCall = () => {
    if (remotePeerId) {
      startCall(remotePeerId)
    }
  }

  return (
    <div className="mt-6 flex flex-col items-center">
      {callStatus === 'idle' && (
        <div className="flex items-center space-x-4 w-full max-w-md">
          <input
            type="text"
            value={remotePeerId}
            onChange={(e) => setRemotePeerId(e.target.value)}
            placeholder="Enter remote Peer ID"
            className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleStartCall}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center"
          >
            <PhoneIcon className="w-5 h-5 mr-2" />
            Call
          </button>
        </div>
      )}
      {callStatus === 'calling' && (
        <div className="text-lg font-semibold text-indigo-600">Calling...</div>
      )}
      {callStatus !== 'idle' && (
        <button
          onClick={endCall}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center"
        >
          <PhoneXMarkIcon className="w-5 h-5 mr-2" />
          End Call
        </button>
      )}
    </div>
  )
}

