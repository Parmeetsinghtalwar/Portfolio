---
description: Scaffold a new page section (hero/about/projects/contact-style) as a client component with motion-friendly structure.
---

Create a new section component for the portfolio.

Steps:
1. Ask for: section name (PascalCase), whether it includes a 3D element, and target page.
2. Create `components/sections/<Name>.tsx`:
   - `'use client'` only if it has interactivity, GSAP, or 3D — otherwise server component
   - Wrap in `<section id="<kebab-name>" className="relative min-h-screen ...">`
   - Tailwind layout: container, padding, responsive breakpoints
   - If 3D: import the loader from `components/three/<Name>SceneLoader`
   - If animated: use `useGSAP` from `@gsap/react` with a scoped ref
3. Import and place the section in the target page.
4. Run `npm run dev` and verify it renders without errors.

Argument: $ARGUMENTS
