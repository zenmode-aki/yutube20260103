'use client'

import { CHANNELS } from '@/lib/youtube'
import { Filter } from 'lucide-react'

interface ChannelFilterProps {
  selectedChannel: string | null
  onSelectChannel: (channelId: string | null) => void
}

export default function ChannelFilter({ selectedChannel, onSelectChannel }: ChannelFilterProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Filter className="w-5 h-5" />
        <span>チャンネルフィルター</span>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onSelectChannel(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedChannel === null
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
              : 'glass hover:bg-white/20'
          }`}
        >
          すべて
        </button>
        {CHANNELS.map((channel) => (
          <button
            key={channel.id}
            onClick={() => onSelectChannel(channel.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedChannel === channel.id
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                : 'glass hover:bg-white/20'
            }`}
          >
            {channel.name}
          </button>
        ))}
      </div>
    </div>
  )
}

