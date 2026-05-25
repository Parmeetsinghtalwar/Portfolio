import { EditorialHome } from '@/components/sections/EditorialHome'
import { About } from '@/components/sections/About'
import { AdvisoryWork } from '@/components/sections/AdvisoryWork'
import { OpenSourceMediaExploration } from '@/components/sections/OpenSourceMediaExploration'
import { Playground } from '@/components/sections/Playground'
import { LySyncLab } from '@/components/sections/LySyncLab'
import { Projects } from '@/components/sections/Projects'
import { Contact } from '@/components/sections/Contact'

export default function Home() {
  return (
    <main className="relative">
      <EditorialHome />
      <About />
      <AdvisoryWork />
      <OpenSourceMediaExploration />
      <Playground />
      <LySyncLab />
      <Projects />
      <Contact />
    </main>
  )
}
