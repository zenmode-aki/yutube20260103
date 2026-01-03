'use client'

import { useState, useEffect } from 'react'
import { Video } from '@/lib/youtube'
import { getAllVideos } from '@/lib/youtube'
import VideoCard from '@/components/VideoCard'
import VideoModal from '@/components/VideoModal'
import ChannelFilter from '@/components/ChannelFilter'
import LoadingAnimation from '@/components/LoadingAnimation'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import { Sparkles } from 'lucide-react'

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([])
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 動画データの取得
  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true)
        setError(null)
        const allVideos = await getAllVideos()
        setVideos(allVideos)
        setFilteredVideos(allVideos)
      } catch (err) {
        console.error('Error fetching videos:', err)
        setError('動画の取得に失敗しました。APIキーを確認してください。')
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  // チャンネルフィルターの適用
  useEffect(() => {
    if (selectedChannel === null) {
      setFilteredVideos(videos)
    } else {
      setFilteredVideos(videos.filter(video => video.channelId === selectedChannel))
    }
  }, [selectedChannel, videos])

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="sticky top-0 z-40 glass border-b border-white/10 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                My Focus Tube
              </h1>
              <p className="text-xs text-gray-400">あなた専用の動画サンクチュアリ</p>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        {/* チャンネルフィルター */}
        <ChannelFilter
          selectedChannel={selectedChannel}
          onSelectChannel={setSelectedChannel}
        />

        {/* エラー表示 */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* ローディング状態 */}
        {loading ? (
          <div>
            <LoadingAnimation />
            <LoadingSkeleton />
          </div>
        ) : (
          <>
            {/* 動画数表示 */}
            <div className="mb-6 text-sm text-gray-400">
              {filteredVideos.length} 本の動画が見つかりました
            </div>

            {/* 動画グリッド */}
            {filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onClick={() => setSelectedVideo(video)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg">
                  表示する動画がありません
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* 動画モーダル */}
      <VideoModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  )
}

