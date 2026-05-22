import { MultiLangVideoPlayer } from '@/app/components/MultiLangVideoPlayer'
import {
  AITV_PLAYER_CAPTION,
  AITV_PLAYER_LANGUAGES,
} from '@/lib/aitv-player'

export const metadata = {
  title: 'AITV Player · Multilingual Sync',
}

export default function PlayerPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto max-w-5xl">
        <MultiLangVideoPlayer
          caption={AITV_PLAYER_CAPTION}
          defaultLang="en"
          languages={AITV_PLAYER_LANGUAGES}
        />
      </div>
    </main>
  )
}
