import { useRef, useEffect } from 'react'

interface VideoStreamProps {
  stream: MediaStream | null
  muted?: boolean
  label: string
}

export default function VideoStream({ stream, muted = false, label }: VideoStreamProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        className="w-full h-[300px] object-cover rounded-lg bg-gray-200"
      />
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
        {label}
      </div>
    </div>
  )
}

