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
  duration?: number // 秒単位
  viewCount?: number // 視聴回数
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

// ISO 8601形式の期間（PT1H2M10S）を秒数に変換
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  
  const hours = parseInt(match[1] || '0', 10)
  const minutes = parseInt(match[2] || '0', 10)
  const seconds = parseInt(match[3] || '0', 10)
  
  return hours * 3600 + minutes * 60 + seconds
}

// 動画の詳細情報を取得（duration, viewCountなど）
export async function getVideoDetails(videoIds: string[]): Promise<Map<string, { duration: number; viewCount: number }>> {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
  
  if (!apiKey) {
    throw new Error('YouTube API key is not set')
  }

  const detailsMap = new Map<string, { duration: number; viewCount: number }>()
  
  // APIの制限により、一度に50件まで取得可能
  const batchSize = 50
  for (let i = 0; i < videoIds.length; i += batchSize) {
    const batch = videoIds.slice(i, i + batchSize)
    
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?` +
        `part=contentDetails,statistics&` +
        `id=${batch.join(',')}&` +
        `key=${apiKey}`
      )

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`)
      }

      const data = await response.json()
      
      data.items.forEach((item: any) => {
        const duration = parseDuration(item.contentDetails?.duration || 'PT0S')
        const viewCount = parseInt(item.statistics?.viewCount || '0', 10)
        detailsMap.set(item.id, { duration, viewCount })
      })
    } catch (error) {
      console.error('Error fetching video details:', error)
    }
  }
  
  return detailsMap
}

// ショート動画を除外（60秒未満の動画、またはタイトルに#Shortsが含まれる動画を除外）
export function filterShorts(videos: Video[]): Video[] {
  return videos.filter(video => {
    // タイトルに#Shortsが含まれている場合は除外
    if (video.title.toLowerCase().includes('#shorts') || 
        video.title.toLowerCase().includes('shorts')) {
      return false
    }
    
    // durationが未取得の場合は除外（安全のため）
    if (video.duration === undefined) return false
    
    // 60秒未満の動画を除外
    return video.duration >= 60
  })
}

// 全チャンネルの動画を取得してソート
export async function getAllVideos(): Promise<Video[]> {
  const allVideos: Video[] = []

  // 各チャンネルから動画を取得
  for (const channel of CHANNELS) {
    try {
      const playlistId = getUploadsPlaylistId(channel.id)
      const videos = await getVideosFromPlaylist(playlistId, 20) // 多めに取得
      
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

  // 動画の詳細情報を取得
  const videoIds = allVideos.map(v => v.videoId)
  const detailsMap = await getVideoDetails(videoIds)
  
  // 詳細情報を動画に追加
  allVideos.forEach(video => {
    const details = detailsMap.get(video.videoId)
    if (details) {
      video.duration = details.duration
      video.viewCount = details.viewCount
    }
  })

  // ショート動画を除外
  const filteredVideos = filterShorts(allVideos)

  // 投稿日時でソート（新しい順）
  return filteredVideos.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

// 各チャンネルの人気動画トップ3を取得
export async function getPopularVideos(): Promise<Video[]> {
  const popularVideos: Video[] = []

  // 各チャンネルから動画を取得
  for (const channel of CHANNELS) {
    try {
      const playlistId = getUploadsPlaylistId(channel.id)
      const videos = await getVideosFromPlaylist(playlistId, 20) // 多めに取得してから選ぶ
      
      // チャンネル名を設定
      videos.forEach(video => {
        if (!video.channelTitle) {
          video.channelTitle = channel.name
        }
      })
      
      // 動画の詳細情報を取得
      const videoIds = videos.map(v => v.videoId)
      const detailsMap = await getVideoDetails(videoIds)
      
      // 詳細情報を動画に追加
      videos.forEach(video => {
        const details = detailsMap.get(video.videoId)
        if (details) {
          video.duration = details.duration
          video.viewCount = details.viewCount
        }
      })
      
      // ショート動画を除外
      const filteredVideos = filterShorts(videos)
      
      // 視聴回数でソートしてトップ3を取得
      const top3 = filteredVideos
        .filter(v => v.viewCount !== undefined) // 視聴回数が取得できたもののみ
        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, 3)
      
      popularVideos.push(...top3)
    } catch (error) {
      console.error(`Error fetching popular videos for channel ${channel.name}:`, error)
      // エラーが発生しても他のチャンネルの取得は続行
    }
  }

  return popularVideos
}

