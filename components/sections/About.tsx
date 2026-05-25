'use client'

import { useRef } from 'react'
import { useGSAP, gsap, ScrollTrigger } from '@/lib/gsap'
import { LayeredVideoScroll } from '@/components/sections/LayeredVideoScroll'
import { IMG_CAR_CAROUSEL_ITEMS } from '@/lib/img-car-carousel'
import { homeSectionEyebrow } from '@/lib/home-sections'

export function About() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.about-reveal', {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-copy',
          start: 'top 75%',
        },
      })
    },
    { scope: ref },
  )

  return (
    <section id="about" ref={ref} className="relative text-foreground">
      <LayeredVideoScroll
        items={IMG_CAR_CAROUSEL_ITEMS}
        title="Parmeet Talwar"
        eyebrow={homeSectionEyebrow('about')}
        watermark="parmeet"
        className="min-h-screen"
      />

      <div className="about-copy relative bg-background py-24 md:py-32">
        <div className="relative mx-auto grid max-w-6xl gap-16 px-6 md:grid-cols-2">
          <div>
            <p className="about-reveal mb-6 font-mono text-xs uppercase tracking-[0.3em] text-foreground/50">
              {homeSectionEyebrow('about')}
            </p>
            <h2 className="about-reveal text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              I design and ship agent systems, GenOps pipelines, and the products
              around them.
            </h2>
            <p className="about-reveal mt-6 text-lg leading-relaxed text-foreground/65">
              Storytelling, engineering, and strategy in one lane — for teams
              that need AI to work in production, not just in slides.
            </p>
            <p className="about-reveal mt-8 text-sm leading-relaxed text-foreground/55">
              Co-founder &amp; CTO at GetZoned. Forward Deploy AI Engineer. See{' '}
              <a href="#advisory" className="underline underline-offset-2 hover:text-foreground">
                advisory
              </a>
              ,{' '}
              <a href="#open-models" className="underline underline-offset-2 hover:text-foreground">
                open models
              </a>
              , and{' '}
              <a href="#playground" className="underline underline-offset-2 hover:text-foreground">
                playground
              </a>
              .
            </p>
          </div>
          <div className="about-reveal space-y-6 pt-4 text-lg leading-relaxed text-foreground/70 md:pt-12">
            <p>
              I&apos;m{' '}
              <span className="font-medium text-foreground">Parmeet Talwar</span>.
              I build AI systems and the products that ship on top of them —
              from architecture through launch.
            </p>
            <p>
              I co-founded{' '}
              <a
                href="https://getzoned.in"
                className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground"
                target="_blank"
                rel="noopener noreferrer"
              >
                GetZoned
              </a>{' '}
              — funded, live at getzoned.in. The{' '}
              <a
                href="#playground"
                className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground"
              >
                Playground
              </a>{' '}
              is for automation templates — n8n, ComfyUI, Make, Zapier. Open-source
              image and video work (fine-tuning, Z-Image, Wan) lives in{' '}
              <a
                href="#open-models"
                className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground"
              >
                Open models
              </a>
              .
            </p>
            <p>
              As a Forward Deploy AI Engineer, I ship production GenOps: automated
              product-research pipelines that ingest 10K+ posts a day and cut idea
              validation from two weeks to 48 hours — plus agent systems for
              social, hiring, and support. Earlier at Scale AI, I designed 200+
              LLM evaluation test cases with 96% annotation agreement across
              reasoning, coding, and NLP. I use{' '}
              <span className="font-medium text-foreground">GenOps</span> as the
              frame for LLM pipelines, scraping, and validation as one discipline.
              Day-to-day stack: Python, FastAPI, Next.js, LangGraph, RAG, MCP
              servers.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
