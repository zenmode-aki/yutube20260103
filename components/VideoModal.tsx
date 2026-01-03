'use client'

import { Video } from '@/lib/youtube'
import { X } from 'lucide-react'
import { useEffect } from 'react'

interface VideoModalProps {
  video: Video | null
  onClose: () => void
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  useEffect(() => {
    if (video) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [video])

  if (!video) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors"
          aria-label="閉じる"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* 動画プレーヤー */}
        <div className="relative aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&cc_lang_pref=en&cc_load_policy=1&hl=en`}
            title={video.title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        
        {/* 字幕設定の説明 */}
        <div className="px-6 pt-2 pb-0">
          <div className="flex items-center gap-2 text-xs text-blue-300 bg-blue-500/10 px-3 py-2 rounded-lg border border-blue-500/20">
            <span className="px-2 py-1 bg-blue-500/30 rounded font-bold">EN</span>
            <span>英語字幕が自動的に表示されます。右下の設定アイコンから字幕の表示/非表示を切り替えられます。</span>
          </div>
        </div>

        {/* 動画情報 */}
        <div className="p-6 space-y-3">
          <h2 className="text-2xl font-bold">{video.title}</h2>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="font-medium text-white">{video.channelTitle}</span>
            <span>•</span>
            <span>{new Date(video.publishedAt).toLocaleDateString('ja-JP')}</span>
          </div>
          {video.description && (
            <p className="text-gray-300 line-clamp-3">{video.description}</p>
          )}
        </div>
      </div>
    </div>
  )
}

