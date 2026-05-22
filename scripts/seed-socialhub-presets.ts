/**
 * One-time (re-runnable) upload of SocialHub demo presets to Cloudinary.
 * Run: bun run seed:socialhub-presets
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { v2 as cloudinary } from 'cloudinary'

const ROOT = resolve(process.cwd())

function loadEnv() {
  const envPath = resolve(ROOT, '.env')
  const raw = readFileSync(envPath, 'utf8')
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq)
    const value = trimmed.slice(eq + 1)
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnv()

const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET
const folder = process.env.CLOUDINARY_FOLDER ?? 'portfolio'

if (!cloudName || !apiKey || !apiSecret) {
  console.error('Missing CLOUDINARY_* in .env')
  process.exit(1)
}

cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true })

const PRESETS = [
  {
    id: 'campaign-1',
    label: 'Product launch',
    source:
      'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'campaign-2',
    label: 'Team culture',
    source:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'campaign-3',
    label: 'Analytics win',
    source:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  },
] as const

async function seed() {
  console.log('Uploading SocialHub presets to Cloudinary…\n')

  for (const preset of PRESETS) {
    const publicId = `${folder}/socialhub-demo/presets/${preset.id}`
    const result = await cloudinary.uploader.upload(preset.source, {
      folder: `${folder}/socialhub-demo/presets`,
      public_id: preset.id,
      overwrite: true,
      invalidate: true,
      resource_type: 'image',
    })

    console.log(`✓ ${preset.label}`)
    console.log(`  public_id: ${result.public_id}`)
    console.log(`  url: ${result.secure_url}\n`)
  }

  console.log('Done. Presets are ready for instant LinkedIn posting.')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
