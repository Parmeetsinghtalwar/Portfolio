---
name: optimize-3d
description: Optimize a slow 3D scene — diagnose FPS drops, GPU memory leaks, draw call counts, and texture bloat. Apply targeted fixes only. Use when a scene feels janky or before shipping.
---

# Optimize a 3D scene

## Diagnostic pass

1. Open the scene file. Look for:
   - `setState` in `useFrame` → must become a ref mutation
   - Geometries/materials/`new THREE.*` created inside render → wrap in `useMemo`
   - Many similar meshes (>50) → switch to `<instancedMesh>`
   - Large GLB files (>2MB) → compress with Draco or Meshopt
   - Textures > 1024px when used on small meshes → downscale or use mipmaps properly
   - Missing `dpr={[1, 2]}` on `<Canvas>`
   - `frameloop="always"` on a static scene → switch to `"demand"` + `invalidate()`

2. Run `npm run build` and check bundle size for the route containing the scene. If three.js is in the static bundle for a non-3D route, that scene needs `dynamic(..., { ssr: false })`.

## Common fixes

### Memoize materials/geometries
```tsx
const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])
const material = useMemo(() => new THREE.MeshStandardMaterial({ color }), [color])
```

### Instanced rendering
```tsx
<instancedMesh args={[geometry, material, count]} ref={ref}>
  {/* set per-instance matrices via ref.current.setMatrixAt() in useEffect */}
</instancedMesh>
```

### Compress GLB
```bash
npx gltf-pipeline -i in.glb -o out.glb --draco.compressionLevel 7
```

### Demand-driven rendering
```tsx
<Canvas frameloop="demand">
  {/* call invalidate() from useThree when state changes */}
</Canvas>
```

## Reporting

After changes, run `npm run build` again and report: bundle delta, what was changed, and what to verify in browser (e.g. "open /about and scroll — FPS should hold 60 on M1").

Don't touch unrelated code. If you see other issues, list them at the bottom as "Out of scope but noted".
