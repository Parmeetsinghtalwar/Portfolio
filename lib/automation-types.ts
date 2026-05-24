export type AutomationPlatform = 'n8n' | 'comfyui' | 'make' | 'zapier'

export type AutomationWorkflow = {
  id: string
  title: string
  description: string
  platform: AutomationPlatform
  tags: string[]
  /** Public path, e.g. /automations/n8n/my-flow.json */
  jsonPath: string
  /** Longer copy for Finder detail pane */
  detail?: string
  /** Optional link to a portfolio project that uses similar patterns */
  relatedHref?: string
  relatedLabel?: string
}
