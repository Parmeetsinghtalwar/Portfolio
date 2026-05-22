---
name: create-3d-scene
description: Scaffold a new React Three Fiber scene as a client component, properly dynamic-imported into a Next.js page with SSR disabled and a Suspense fallback. Use when adding a new 3D section/hero/widget.
---

# Create a 3D scene

Build a new R3F scene that integrates cleanly with Next.js App Router.

## Steps

1. **Ask** (if not specified): scene name, where it goes (`/`, `/about`, etc.), and whether it should fill viewport or sit inline.

2. **Create the scene file** at `components/three/<SceneName>.tsx`:
   - `'use client'` directive
   - Default-export a component containing `<Canvas>`
   - Set `dpr={[1, 2]}`, `gl={{ antialias: true }}`, sensible `camera={{ position, fov }}`
   - Wrap children in `<Suspense fallback={null}>`
   - Include `<ambientLight />` + one directional light minimum
   - If demo content: a `<mesh>` with the user's geometry of choice + `MeshStandardMaterial`
   - Add `<OrbitControls />` from drei unless told otherwise

3. **Create a loader** at `components/three/<SceneName>Loader.tsx`:
   ```tsx
   'use client'
   import dynamic from 'next/dynamic'
   const Scene = dynamic(() => import('./<SceneName>'), {
     ssr: false,
     loading: () => <div className="h-full w-full animate-pulse bg-neutral-900" />,
   })
   export default Scene
   ```

4. **Wire into the page** — import the Loader (not the scene directly) into the target `page.tsx` or section component.

5. **Verify** — run `npm run dev`, open the page, confirm no console errors and the scene renders.

## Conventions

- Lights at scene level, not inside reusable mesh components
- Models go in `public/models/`, preload with `useGLTF.preload('/models/x.glb')` at module scope
- Never put `setState` in `useFrame` — use refs
