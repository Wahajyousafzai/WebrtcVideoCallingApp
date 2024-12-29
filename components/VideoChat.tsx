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

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full">
      <div className="p-6 bg-indigo-600 text-white">
        <h1 className="text-2xl font-bold">WebRTC Video Chat</h1>
        <p className="text-indigo-200">Your Peer ID: {peerId}</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VideoStream stream={localStream} muted label="You" />
          <VideoStream stream={remoteStream} label="Remote" />
        </div>
        <CallControls
          startCall={startCall}
          endCall={endCall}
          callStatus={callStatus}
        />
      </div>
    </div>
  )
}

