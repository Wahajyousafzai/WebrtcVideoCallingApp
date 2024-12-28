import VideoCall from '@/components/VideoCall'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center md:px-4">
      <div className="max-w-6xl mx-auto justify-center bg-white/10 md:rounded-2xl shadow-2xl backdrop-blur-lg border border-white/20 overflow-hidden">
        <VideoCall />
      </div>
    </main>
  )
}