---
name: add-shader
description: Add a custom GLSL shader material to a React Three Fiber scene using drei's shaderMaterial helper. Sets up uniforms, vertex/fragment shaders, and useFrame ticking. Use when a stock material can't achieve the look (procedural, distortion, gradient flows).
---

# Add a custom shader

## Steps

1. **Confirm intent** — what visual effect? (gradient, distortion, fresnel, particle flow, etc.) Stock materials (`MeshStandardMaterial`, `MeshTransmissionMaterial`, `MeshDistortMaterial` from drei) cover most cases — recommend those first if applicable.

2. **Create the material module** at `components/three/materials/<Name>Material.tsx`:

   ```tsx
   'use client'
   import * as THREE from 'three'
   import { shaderMaterial } from '@react-three/drei'
   import { extend } from '@react-three/fiber'

   const MyMaterial = shaderMaterial(
     { uTime: 0, uColor: new THREE.Color('#ff0080') },
     /* vertex */ `
       varying vec2 vUv;
       void main() {
         vUv = uv;
         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
       }
     `,
     /* fragment */ `
       uniform float uTime;
       uniform vec3 uColor;
       varying vec2 vUv;
       void main() {
         float wave = sin(vUv.x * 10.0 + uTime) * 0.5 + 0.5;
         gl_FragColor = vec4(uColor * wave, 1.0);
       }
     `
   )
   extend({ MyMaterial })

   declare module '@react-three/fiber' {
     interface ThreeElements {
       myMaterial: ReactThreeFiber.Object3DNode<THREE.ShaderMaterial, typeof MyMaterial>
     }
   }
   export { MyMaterial }
   ```

3. **Use it in a mesh**:
   ```tsx
   const ref = useRef<THREE.ShaderMaterial>(null!)
   useFrame((s) => { ref.current.uniforms.uTime.value = s.clock.elapsedTime })
   return <mesh><planeGeometry /><myMaterial ref={ref} /></mesh>
   ```

## Conventions

- Always `varying vec2 vUv;` if you need uv access in fragment
- For animations, single `uTime` uniform driven by `useFrame`
- For mouse input, pass `uMouse` from a `useEffect` listener
- For complex shaders > 60 lines, put GLSL in `public/shaders/*.glsl` and import as text via `?raw` (Next.js webpack config needed) — but inline is fine for most cases

## Verify

`npm run dev` and check the scene. Watch console for shader compile errors (they'll show the GLSL line number). If the shader compiles but doesn't render, check that the geometry has uvs (`<planeGeometry>` and `<sphereGeometry>` do; some custom geometries don't).
