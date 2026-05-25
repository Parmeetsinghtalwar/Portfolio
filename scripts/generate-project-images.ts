/**
 * Generate hero + preview images and movie quotes for all projects (OpenRouter + GPT image).
 * Run: bun run generate:project-images
 * Flags: --id=socialhub  --force  --keep-prompts (reuse manifest prompts; images only)
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { loadEnvFile } from '../lib/load-env'
import {
  dataUrlToBuffer,
  generateGptImage,
  generateProjectCopy,
} from '../lib/openrouter-client'
import { getAllProjectSlugs, getProjectById } from '../lib/projects'
import type { ProjectVisualsManifest } from '../lib/project-visuals'

loadEnvFile()

const apiKey =
  process.env.OPENROUTER_API_KEY ?? process.env.OPEN_ROUTER_API_KEY
if (!apiKey) {
  console.error('Missing OPENROUTER_API_KEY (or OPEN_ROUTER_API_KEY) in .env')
  process.exit(1)
}

const args = process.argv.slice(2)
const force = args.includes('--force')
const keepPrompts = args.includes('--keep-prompts')
const idArg = args.find((a) => a.startsWith('--id='))?.split('=')[1]

const ROOT = process.cwd()
const MANIFEST_PATH = resolve(ROOT, 'data/project-visuals.json')
const PUBLIC_PROJECTS = resolve(ROOT, 'public/projects')

function loadManifest(): ProjectVisualsManifest {
  if (!existsSync(MANIFEST_PATH)) return {}
  return JSON.parse(
    readFileSync(MANIFEST_PATH, 'utf8'),
  ) as ProjectVisualsManifest
}

function saveManifest(manifest: ProjectVisualsManifest) {
  writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`)
}

function saveImage(
  outDir: string,
  baseName: 'hero' | 'preview',
  dataUrl: string,
): string {
  const { ext, buffer } = dataUrlToBuffer(dataUrl)
  const filename = `${baseName}.${ext === 'png' ? 'png' : 'jpg'}`
  mkdirSync(outDir, { recursive: true })
  writeFileSync(resolve(outDir, filename), buffer)
  return filename
}

function isComplete(
  id: string,
  outDir: string,
  manifest: ProjectVisualsManifest,
): boolean {
  const entry = manifest[id]
  if (!entry?.hero || !entry.preview || !entry.quote) return false
  const heroExists =
    existsSync(resolve(outDir, 'hero.jpg')) ||
    existsSync(resolve(outDir, 'hero.png'))
  const previewExists =
    existsSync(resolve(outDir, 'preview.jpg')) ||
    existsSync(resolve(outDir, 'preview.png'))
  return heroExists && previewExists
}

const ids = idArg ? [idArg] : getAllProjectSlugs()

async function main() {
  const manifest = loadManifest()
  const imageModel = process.env.OPENROUTER_IMAGE_MODEL ?? 'openai/gpt-image-1'
  const textModel = process.env.OPENROUTER_TEXT_MODEL ?? 'openai/gpt-4.1-mini'
  console.log(`Text: ${textModel} · Image: ${imageModel}`)
  console.log(`Projects: ${ids.length}\n`)

  for (const id of ids) {
    const project = getProjectById(id)
    if (!project) {
      console.warn(`Skip ${id}: not found`)
      continue
    }

    const outDir = resolve(PUBLIC_PROJECTS, id)
    if (!force && isComplete(id, outDir, manifest)) {
      console.log(`Skip ${id}: complete (use --force)`)
      continue
    }

    console.log(`\n→ ${id}: ${project.title}`)

    const existing = manifest[id]
    const copy =
      keepPrompts &&
      existing?.heroImagePrompt &&
      existing?.previewImagePrompt &&
      existing.quote
        ? {
            quote: existing.quote,
            attribution: existing.attribution ?? 'Cinema',
            heroImagePrompt: existing.heroImagePrompt,
            previewImagePrompt: existing.previewImagePrompt,
          }
        : await generateProjectCopy(apiKey, {
            title: project.title,
            tagline: project.tagline,
            description: project.description,
            stack: project.stack,
          })
    if (keepPrompts && existing?.heroImagePrompt) {
      console.log('  prompts: from manifest (--keep-prompts)')
    }
    console.log(`  quote: "${copy.quote}"`)
    console.log(`  film:  ${copy.attribution}`)

    let heroFile = ''
    let previewFile = ''

    try {
      const heroDataUrl = await generateGptImage(
        apiKey,
        copy.heroImagePrompt,
        'hero',
      )
      heroFile = saveImage(outDir, 'hero', heroDataUrl)
      console.log(`  hero:    /projects/${id}/${heroFile}`)
    } catch (err) {
      console.error(`  hero failed: ${err instanceof Error ? err.message : err}`)
      continue
    }

    await new Promise((r) => setTimeout(r, 1200))

    try {
      const previewDataUrl = await generateGptImage(
        apiKey,
        copy.previewImagePrompt,
        'preview',
      )
      previewFile = saveImage(outDir, 'preview', previewDataUrl)
      console.log(`  preview: /projects/${id}/${previewFile}`)
    } catch (err) {
      console.warn(
        `  preview failed (${err instanceof Error ? err.message : err}) — using hero`,
      )
      previewFile = heroFile
    }

    manifest[id] = {
      hero: `/projects/${id}/${heroFile}`,
      preview: `/projects/${id}/${previewFile}`,
      quote: copy.quote,
      attribution: copy.attribution,
      heroImagePrompt: copy.heroImagePrompt,
      previewImagePrompt: copy.previewImagePrompt,
    }
    saveManifest(manifest)

    await new Promise((r) => setTimeout(r, 1500))
  }

  console.log('\nDone → data/project-visuals.json')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
