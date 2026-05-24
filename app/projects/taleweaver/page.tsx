import type { Metadata } from 'next'
import { TaleweaverLanding } from '@/components/taleweaver/TaleweaverLanding'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'AI Book Studio · AI eBooks & Author EPUB Fine-tuning',
  description:
    'From a viral tweet to Bookgen — AI story creation with author EPUB fine-tuning, voice-locked prose, and export-ready manuscripts.',
  openGraph: {
    title: 'AI Book Studio · Bookgen',
    description: 'Craft timeless stories with AI. Portfolio case study.',
    url: `${SITE.url}/projects/taleweaver`,
  },
}

export default function TaleweaverProjectPage() {
  return <TaleweaverLanding />
}
