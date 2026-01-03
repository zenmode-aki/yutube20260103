export default function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
        </div>
      </div>
      <p className="text-lg text-gray-300 animate-pulse">
        動画を読み込んでいます...
      </p>
    </div>
  )
}

