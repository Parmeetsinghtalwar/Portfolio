---
description: Bootstrap the Next.js portfolio with the agreed stack (Next.js 15 + TypeScript + Tailwind + R3F + drei + GSAP + Framer Motion).
---

Bootstrap the portfolio project in the current directory.

Steps:
1. Run `npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --eslint`
2. Install 3D + animation deps:
   ```
   npm install three @react-three/fiber @react-three/drei
   npm install -D @types/three
   npm install gsap @gsap/react framer-motion
   ```
3. Create folder structure: `components/ui/`, `components/sections/`, `components/three/`, `hooks/`, `lib/`, `public/models/`, `public/textures/`
4. Add `.gitkeep` to empty directories
5. Create `lib/gsap.ts` registering ScrollTrigger and useGSAP
6. Replace `app/page.tsx` with a minimal hero section
7. Run `npm run dev` and confirm the dev server starts on :3000
8. Report next steps (add hero scene, configure metadata, etc.)
