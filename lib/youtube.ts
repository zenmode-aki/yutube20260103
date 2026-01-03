// YouTube Data API v3 の型定義とユーティリティ関数

export interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  channelTitle: string
  channelId: string
  publishedAt: string
  videoId: string
}

export interface Channel {
  id: string
  name: string
  icon?: string
}

// チャンネルIDからアップロード済みプレイリストIDを取得
// チャンネルIDは'UC'で始まり、プレイリストIDは'UU'で始まる
// 例: UCY1kMZp36IQSyNx_9h4mpCg → UUY1kMZp36IQSyNx_9h4mpCg
export function getUploadsPlaylistId(channelId: string): string {
  if (channelId.length < 2) {
    throw new Error('Invalid channel ID')
  }
  return 'UU' + channelId.substring(2)
}

// チャンネル情報の定義
export const CHANNELS: Channel[] = [
  { id: 'UCY1kMZp36IQSyNx_9h4mpCg', name: 'Mark Rober' },
  { id: 'UCnmGIkw-KdI0W5siakKPKog', name: 'Ryan Trahan' },
  { id: 'UCVi2lI40LetxLBKn-rtWC3A', name: 'Crunchyroll Collection' },
  { id: 'UC6pGDc4bFGD1_36IKv3FnYg', name: 'Crunchyroll' },
  { id: 'UCwWhs_6x42TyRM4Wstoq8HA', name: 'The Daily Show' },
  { id: 'UCwmZiChSryoWQCZMIQezgTg', name: 'BBC Earth' },
]

// プレイリストから動画を取得
export async function getVideosFromPlaylist(
  playlistId: string,
  maxResults: number = 10
): Promise<Video[]> {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
  
  if (!apiKey) {
    throw new Error('YouTube API key is not set')
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?` +
      `part=snippet&` +
      `playlistId=${playlistId}&` +
      `maxResults=${maxResults}&` +
      `order=date&` +
      `key=${apiKey}`
    )

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`)
    }

    const data = await response.json()

    return data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      channelTitle: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      publishedAt: item.snippet.publishedAt,
      videoId: item.snippet.resourceId.videoId,
    }))
  } catch (error) {
    console.error('Error fetching videos from playlist:', error)
    throw error
  }
}

// 全チャンネルの動画を取得してソート
export async function getAllVideos(): Promise<Video[]> {
  const allVideos: Video[] = []

  // 各チャンネルから動画を取得
  for (const channel of CHANNELS) {
    try {
      const playlistId = getUploadsPlaylistId(channel.id)
      const videos = await getVideosFromPlaylist(playlistId, 10)
      
      // チャンネル名を設定（APIから取得できない場合に備えて）
      videos.forEach(video => {
        if (!video.channelTitle) {
          video.channelTitle = channel.name
        }
      })
      
      allVideos.push(...videos)
    } catch (error) {
      console.error(`Error fetching videos for channel ${channel.name}:`, error)
      // エラーが発生しても他のチャンネルの取得は続行
    }
  }

  // 投稿日時でソート（新しい順）
  return allVideos.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

