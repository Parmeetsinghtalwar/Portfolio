'use client'
import Link from 'next/link'
import { NAV_LINKS, SITE } from '@/lib/constants'

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/60 border-b border-foreground/10">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-mono text-sm font-semibold tracking-tight">
          {SITE.name.toLowerCase().replace(' ', '.')}
        </Link>
        <ul className="hidden md:flex gap-8 text-sm">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
