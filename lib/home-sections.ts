/** Homepage section order — keep numbering in sync with app/page.tsx */
export const HOME_SECTIONS = {
  about: { num: '01', label: 'About' },
  advisory: { num: '02', label: 'Advisory' },
  openModels: { num: '03', label: 'Open models' },
  playground: { num: '04', label: 'Playground' },
  lysync: { num: '05', label: 'LySync' },
  projects: { num: '06', label: 'Selected work' },
  contact: { num: '07', label: 'Contact' },
} as const

export type HomeSectionKey = keyof typeof HOME_SECTIONS

export function homeSectionEyebrow(key: HomeSectionKey): string {
  const { num, label } = HOME_SECTIONS[key]
  return `${num} · ${label}`
}
