export type StoryLink = {
  label: string
  href: string
}

export type StoryPerson = {
  name: string
  role?: string
  href?: string
}

export type StoryBlock =
  | { type: 'chapter'; title: string; when?: string }
  | { type: 'prose'; paragraphs: string[] }
  | {
      type: 'image'
      src: string
      alt: string
      caption?: string
      fullWidth?: boolean
    }
  | { type: 'quote'; text: string; attribution?: string }
  | { type: 'divider' }

export type ProjectStory = {
  headline: string
  subtitle: string
  lede: string
  byline?: string
  people?: StoryPerson[]
  social?: StoryLink[]
  blocks: StoryBlock[]
  closing?: string
}
