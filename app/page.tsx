'use client'

import { useState, useEffect } from 'react'
import { Video } from '@/lib/youtube'
import { getAllVideos, getPopularVideos } from '@/lib/youtube'
import VideoCard from '@/components/VideoCard'
import VideoModal from '@/components/VideoModal'
import ChannelFilter from '@/components/ChannelFilter'
import LoadingAnimation from '@/components/LoadingAnimation'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import { Sparkles, TrendingUp } from 'lucide-react'

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([])
  const [popularVideos, setPopularVideos] = useState<Video[]>([])
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
        
        // 通常の動画と人気動画を並行して取得
        const [allVideos, popular] = await Promise.all([
          getAllVideos(),
          getPopularVideos()
        ])
        
        setVideos(allVideos)
        setFilteredVideos(allVideos)
        setPopularVideos(popular)
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
            {/* 人気動画セクション */}
            {popularVideos.length > 0 && selectedChannel === null && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    各チャンネルの人気動画トップ3
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {popularVideos.map((video) => (
                    <div key={`popular-${video.id}`} className="relative">
                      <div className="absolute -top-2 -left-2 z-10 px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-xs font-bold text-white shadow-lg">
                        🔥 人気
                      </div>
                      <VideoCard
                        video={video}
                        onClick={() => setSelectedVideo(video)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 最新動画セクション */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-300">
                {selectedChannel ? 'フィルター結果' : '最新動画'}
              </h2>
              <div className="text-sm text-gray-400 mb-4">
                {filteredVideos.length} 本の動画が見つかりました
                {selectedChannel === null && '（ショート動画は除外済み）'}
              </div>
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

