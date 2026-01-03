'use client'

import { Video } from '@/lib/youtube'
import { Play } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale/ja'

interface VideoCardProps {
  video: Video
  onClick: () => void
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  const timeAgo = formatDistanceToNow(new Date(video.publishedAt), {
    addSuffix: true,
    locale: ja,
  })

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer rounded-2xl overflow-hidden glass card-hover"
    >
      {/* サムネイル */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {/* オーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* 再生アイコン */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>
        {/* チャンネル名バッジ */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-xs font-medium">
          {video.channelTitle}
        </div>
      </div>
      
      {/* 情報エリア */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold line-clamp-2 text-sm group-hover:text-blue-300 transition-colors">
          {video.title}
        </h3>
        <p className="text-xs text-gray-400">
          {timeAgo}
        </p>
      </div>
    </div>
  )
}

