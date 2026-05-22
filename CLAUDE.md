# Portfolio — Next.js + 3D

**Stack**: Next.js (App Router) · TypeScript · React Three Fiber + drei · GSAP · Framer Motion · Tailwind CSS

## Project Conventions

- **App Router only** — use `app/` directory, server components by default, mark client components with `'use client'`
- **TypeScript strict** — no `any`, no `@ts-ignore` without comment explaining why
- **Tailwind for styling** — no separate CSS modules unless animating with keyframes Tailwind can't express
- **Path aliases** — `@/components`, `@/lib`, `@/hooks`, `@/three` (configured in tsconfig)

## 3D Conventions (React Three Fiber)

- Wrap 3D content in a dedicated `<Canvas>` client component; never put `<Canvas>` in a server component
- Load heavy 3D scenes with `next/dynamic` + `ssr: false` to keep initial bundle small
- Always wrap scenes in `<Suspense>` with a fallback (loader or empty group)
- Use `useFrame` for per-frame logic; never `setState` inside it (mutate refs instead)
- Prefer `drei` helpers (`useGLTF`, `OrbitControls`, `Environment`, `Html`) over hand-rolled
- GLB/GLTF assets live in `public/models/` — preload with `useGLTF.preload()`
- Textures in `public/textures/` — use `useTexture` and dispose properly in cleanup
- Use instanced meshes (`<instancedMesh>`) for > 50 repeated geometries
- Set `dpr={[1, 2]}` on `<Canvas>` to cap pixel ratio on retina

## Performance Rules

- Lighthouse score target: 90+ on mobile, including 3D pages
- Use `next/image` for all raster images; `priority` only for above-the-fold
- Defer non-critical 3D with `IntersectionObserver` or `dynamic(() => ..., { ssr: false })`
- Run `npm run build` before declaring perf work done — bundle analyzer flags regressions

## Animation

- **GSAP** for timeline-based, scroll-tied (`ScrollTrigger`), or complex sequencing
- **Framer Motion** for component enter/exit, gestures, layout animations
- Register GSAP plugins in a single `lib/gsap.ts` module, import from there
- Always `gsap.context()` + cleanup in `useEffect` return to avoid memory leaks

## File Layout

```
app/                    Next.js App Router pages + layouts
components/
  ui/                   Buttons, inputs, layout primitives
  sections/             Hero, About, Projects, Contact (page sections)
  three/                R3F components — scenes, meshes, shaders
hooks/                  Custom React hooks
lib/                    Utilities, constants, gsap setup
public/
  models/               GLB/GLTF files
  textures/             KTX2, WebP, JPG textures
  shaders/              Raw GLSL (if not inline)
```

## Quick Start

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint
npm run type-check   # tsc --noEmit
```

## Don'ts

- Don't create new component files for one-off JSX — inline it
- Don't add a new animation library — GSAP and Framer Motion already cover the space
- Don't commit `.env.local` or model files larger than 5MB to git
- Don't add comments explaining WHAT the code does — name things well instead
