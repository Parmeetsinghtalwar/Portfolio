import type { Metadata } from 'next'
import { Cormorant_Garamond, Geist, Geist_Mono, VT323 } from 'next/font/google'
import './globals.css'
import { Loader } from '@/components/ui/Loader'
import { SmoothScroll } from '@/components/ui/SmoothScroll'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const vt323 = VT323({
  variable: '--font-vt323',
  subsets: ['latin'],
  weight: '400',
})

const editorial = Cormorant_Garamond({
  variable: '--font-editorial',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  title: {
    default: 'Parmeet Singh Talwar — Co-founder & Forward Deploy AI Engineer',
    template: '%s · Parmeet Singh Talwar',
  },
  description:
    'Co-founder & CTO of GetZoned. Forward Deploy AI Engineer. Building agent systems, GenOps pipelines, and the products around them.',
  openGraph: {
    title: 'Parmeet Singh Talwar — Co-founder & Forward Deploy AI Engineer',
    description:
      'Co-founder & CTO of GetZoned. Forward Deploy AI Engineer. Building agent systems, GenOps pipelines, and the products around them.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${vt323.variable} ${editorial.variable} antialiased bg-background text-foreground`}
      >
        <Loader brand="PARMEET" minDuration={2200} />
        <SmoothScroll />
        {children}
      </body>
    </html>
  )
}
