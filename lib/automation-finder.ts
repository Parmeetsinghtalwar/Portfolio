import {
  AUTOMATION_WORKFLOWS,
  type AutomationWorkflow,
} from '@/lib/automation-workflows'

export type AutomationFolderId = 'n8n' | 'comfyui' | 'make' | 'zapier'

export type AutomationFolder = {
  id: AutomationFolderId
  label: string
  /** Pastel folder color — Yan Liu portfolio palette */
  color: string
  icon: 'workflow' | 'sparkles' | 'blocks' | 'zap'
  tagline: string
  sidebarLabel: string
}

export const AUTOMATION_FOLDERS: AutomationFolder[] = [
  {
    id: 'n8n',
    label: 'n8n',
    color: '#8DB9D3',
    icon: 'workflow',
    tagline: '32 workflows · download JSON · import',
    sidebarLabel: 'n8n',
  },
  {
    id: 'comfyui',
    label: 'ComfyUI',
    color: '#C9A87C',
    icon: 'sparkles',
    tagline: 'Graphs · LoRA · image & video',
    sidebarLabel: 'ComfyUI',
  },
  {
    id: 'make',
    label: 'Make.com',
    color: '#9CB896',
    icon: 'blocks',
    tagline: 'Visual scenarios · routers · SaaS',
    sidebarLabel: 'Make.com',
  },
  {
    id: 'zapier',
    label: 'Zapier',
    color: '#A898C4',
    icon: 'zap',
    tagline: 'Zaps · filters · quick integrations',
    sidebarLabel: 'Zapier',
  },
]

export const FINDER_PATH_ROOT = '~/parmeet/playground'

export function getFolderById(id: AutomationFolderId): AutomationFolder | undefined {
  return AUTOMATION_FOLDERS.find((f) => f.id === id)
}

export function getWorkflowsForFolder(
  folderId: AutomationFolderId,
): AutomationWorkflow[] {
  const list = AUTOMATION_WORKFLOWS.filter((w) => w.platform === folderId)
  if (folderId === 'comfyui') {
    return [...list].sort((a, b) => {
      const aOs = a.tags.includes('open-source') ? 0 : 1
      const bOs = b.tags.includes('open-source') ? 0 : 1
      return aOs - bOs
    })
  }
  return list
}

