'use client'

import { useState, useEffect, useRef } from 'react'
import Peer from 'peerjs'
import VideoStream from './VideoStream'
import CallControls from './CallControls'

export default function VideoChat() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [peerId, setPeerId] = useState<string>('')
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected'>('idle')
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const [isVideoDisabled, setIsVideoDisabled] = useState(false)
  const peerRef = useRef<Peer | null>(null)

  useEffect(() => {
    const initPeer = async () => {
      const peer = new Peer()
      peer.on('open', (id) => setPeerId(id))
      
      peer.on('call', (call) => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((stream) => {
            setLocalStream(stream)
            call.answer(stream)
            call.on('stream', (remoteStream) => {
              setRemoteStream(remoteStream)
              setCallStatus('connected')
            })
          })
      })

      peerRef.current = peer
    }

    initPeer()

    return () => {
      peerRef.current?.destroy()
    }
  }, [])

  const startCall = (remotePeerId: string) => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream)
        setCallStatus('calling')
        const call = peerRef.current!.call(remotePeerId, stream)
        call.on('stream', (remoteStream) => {
          setRemoteStream(remoteStream)
          setCallStatus('connected')
        })
      })
  }

  const endCall = () => {
    localStream?.getTracks().forEach(track => track.stop())
    setLocalStream(null)
    setRemoteStream(null)
    setCallStatus('idle')
  }

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      audioTrack.enabled = !audioTrack.enabled
      setIsAudioMuted(!audioTrack.enabled)
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      videoTrack.enabled = !videoTrack.enabled
      setIsVideoDisabled(!videoTrack.enabled)
    }
  }

  return (
    <div className="relative h-screen w-full bg-gray-900 overflow-hidden">
      {remoteStream && (
        <VideoStream
          stream={remoteStream}
          label="Remote"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {localStream && (
        <div className="absolute top-4 right-4 w-1/3 max-w-[200px] aspect-video">
          <VideoStream
            stream={localStream}
            label="You"
            muted
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
        <CallControls
          startCall={startCall}
          endCall={endCall}
          toggleAudio={toggleAudio}
          toggleVideo={toggleVideo}
          isAudioMuted={isAudioMuted}
          isVideoDisabled={isVideoDisabled}
          callStatus={callStatus}
          peerId={peerId}
        />
      </div>
    </div>
  )
}

