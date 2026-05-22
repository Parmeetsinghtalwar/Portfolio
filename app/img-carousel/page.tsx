import type { Metadata } from 'next'
import { Nav } from '@/components/ui/Nav'
import { LayeredVideoScroll } from '@/components/sections/LayeredVideoScroll'
import { IMG_CAR_CAROUSEL_ITEMS } from '@/lib/img-car-carousel'

export const metadata: Metadata = {
  title: 'Image Carousel · Layered Scroll',
  description:
    'Layered media stage where the full-screen background and the centered card show the same item. Click the background to advance.',
}

export default function ImgCarouselPage() {
  return (
    <main className="relative bg-black text-white">
      <Nav />

      <section className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.24em] text-white/50">
            Editorial · 2025
          </p>
          <h1 className="mx-auto max-w-[14ch] text-5xl font-medium tracking-tight md:text-7xl">
            Same media in the background and the card. Click anywhere to advance.
          </h1>
          <p className="mt-8 text-xs uppercase tracking-[0.2em] text-white/40">
            Scroll ↓
          </p>
        </div>
      </section>

      <LayeredVideoScroll
        items={IMG_CAR_CAROUSEL_ITEMS}
        title="Golden Silence"
        eyebrow="Editorial · 2025"
      />

      <section className="grid min-h-[60vh] place-items-center px-6 text-center">
        <p className="max-w-[40ch] text-sm uppercase tracking-[0.18em] text-white/40">
          End of section · keep scrolling for the rest of the site
        </p>
      </section>

      <footer className="border-t border-white/10 px-7 py-10 text-xs uppercase tracking-[0.14em] text-white/40">
        © 2026 · dasupply-style layered scroll
      </footer>
    </main>
  )
}
